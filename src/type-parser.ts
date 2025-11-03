/**
 * TypeScript type definition parser using oxc-parser
 *
 * Provides fast parsing of types.d.ts files to extract:
 * - JSDoc documentation
 * - Type structure information
 * - Available endpoints and methods
 *
 * This enhances code generation with better hints and documentation.
 */

import { readFileSync } from 'node:fs'
import { parseSync } from 'oxc-parser'

/**
 * Information extracted from a type helper definition
 */
export interface TypeHelperInfo {
  /** Name of the type helper (e.g., "HetznerCloud") */
  name: string
  /** JSDoc description */
  description: string
  /** Example usage from JSDoc */
  examples: string[]
  /** Properties available on this type helper */
  properties: TypePropertyInfo[]
}

/**
 * Information about a property in a type helper
 */
export interface TypePropertyInfo {
  /** Property name (e.g., "path", "query", "request") */
  name: string
  /** Description from JSDoc comment */
  description: string
}

/**
 * Response structure information
 */
export interface ResponseStructure {
  /** Whether this is a union type with multiple variants */
  isUnion: boolean
  /** Union variants (e.g., single resource vs array) */
  variants: ResponseVariant[]
}

export interface ResponseVariant {
  /** Properties in this variant (e.g., "droplet", "droplets") */
  properties: string[]
  /** Is this variant an array response? */
  isArrayProperty: boolean
}

/**
 * Parse a types.d.ts file and extract type helper information
 */
export function parseTypesFile(filePath: string): TypeHelperInfo[] {
  try {
    const content = readFileSync(filePath, 'utf-8')
    // parseSync(filename, code) - filename extension determines parsing mode
    const result = parseSync(filePath, content)

    if (result.errors.length > 0) {
      console.error(`[type-parser] Parse errors in ${filePath}:`, result.errors)
      return []
    }

    return extractTypeHelpers(result.program, result.comments || [])
  }
  catch (error) {
    console.error(`[type-parser] Failed to parse ${filePath}:`, error)
    return []
  }
}

/**
 * Extract type helper information from AST
 */
function extractTypeHelpers(program: any, comments: any[]): TypeHelperInfo[] {
  const typeHelpers: TypeHelperInfo[] = []

  // Look for module declarations (declare module 'apiful/schema')
  for (const statement of program.body) {
    if (statement.type === 'TSModuleDeclaration' && statement.body?.type === 'TSModuleBlock') {
      // Look for exported type aliases inside the module
      for (const moduleStatement of statement.body.body) {
        if (
          moduleStatement.type === 'ExportNamedDeclaration'
          && moduleStatement.declaration?.type === 'TSTypeAliasDeclaration'
        ) {
          const typeAlias = moduleStatement.declaration
          const typeHelper = extractTypeHelperInfo(typeAlias, comments)
          if (typeHelper) {
            typeHelpers.push(typeHelper)
          }
        }
      }
    }
  }

  return typeHelpers
}

/**
 * Extract information from a type alias declaration
 */
function extractTypeHelperInfo(typeAlias: any, comments: any[]): TypeHelperInfo | null {
  const name = typeAlias.id?.name
  if (!name) {
    return null
  }

  // Extract JSDoc comment
  const { description, examples } = extractJSDoc(typeAlias, comments)

  // Extract properties if it's an object type
  const properties = extractProperties(typeAlias.typeAnnotation, comments)

  return {
    name,
    description,
    examples,
    properties,
  }
}

/**
 * Extract JSDoc comment information by finding comment before node
 */
function extractJSDoc(node: any, comments: any[]): { description: string, examples: string[] } {
  const description: string[] = []
  const examples: string[] = []

  // Find the closest block comment before this node
  const nodeStart = node.start
  let closestComment = null
  let closestDistance = Number.POSITIVE_INFINITY

  for (const comment of comments) {
    if (comment.type === 'Block' && comment.end < nodeStart) {
      const distance = nodeStart - comment.end
      // Only consider comments very close to the node (within 10 chars, accounting for whitespace)
      if (distance < closestDistance && distance < 50) {
        closestComment = comment
        closestDistance = distance
      }
    }
  }

  if (closestComment) {
    const lines = closestComment.value.split('\n')

    let currentExample: string[] = []
    let inExample = false

    for (const line of lines) {
      const trimmed = line.trim().replace(/^\*\s*/, '')

      if (trimmed.startsWith('@example')) {
        inExample = true
        currentExample = []
      }
      else if (trimmed.startsWith('@')) {
        // End of example, start of another tag
        if (inExample && currentExample.length > 0) {
          examples.push(currentExample.join('\n'))
          currentExample = []
        }
        inExample = false
      }
      else if (inExample) {
        currentExample.push(trimmed)
      }
      else if (trimmed && !trimmed.startsWith('*')) {
        description.push(trimmed)
      }
    }

    // Add last example if exists
    if (inExample && currentExample.length > 0) {
      examples.push(currentExample.join('\n'))
    }
  }

  return {
    description: description.join(' ').trim(),
    examples,
  }
}

/**
 * Extract property information from a type literal
 */
function extractProperties(typeAnnotation: any, comments: any[]): TypePropertyInfo[] {
  const properties: TypePropertyInfo[] = []

  if (typeAnnotation?.type === 'TSTypeLiteral') {
    for (const member of typeAnnotation.members) {
      if (member.type === 'TSPropertySignature') {
        const propertyName = member.key?.name
        if (propertyName) {
          // Extract JSDoc for this property using the same position-based approach
          const { description } = extractJSDoc(member, comments)

          properties.push({
            name: propertyName,
            description,
          })
        }
      }
    }
  }

  return properties
}

/**
 * Parse response structure from types.d.ts using oxc-parser
 */
export function parseResponseStructure(filePath: string, path: string, method: string): ResponseStructure | null {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const result = parseSync(filePath, content)

    if (result.errors.length > 0) {
      return null
    }

    // Find the paths interface
    for (const statement of result.program.body) {
      if (statement.type === 'TSModuleDeclaration' && statement.body?.type === 'TSModuleBlock') {
        for (const moduleStatement of statement.body.body) {
          if (
            moduleStatement.type === 'ExportNamedDeclaration'
            && moduleStatement.declaration?.type === 'TSInterfaceDeclaration'
            && moduleStatement.declaration.id.name === 'paths'
          ) {
            const pathsInterface = moduleStatement.declaration
            const methodJSDoc = findMethodJSDocInPaths(pathsInterface, path, method.toLowerCase(), result.comments || [])

            if (methodJSDoc) {
              return extractResponseFromJSDoc(methodJSDoc)
            }
          }
        }
      }
    }

    return null
  }
  catch {
    return null
  }
}

/**
 * Find method JSDoc in paths interface
 */
function findMethodJSDocInPaths(pathsInterface: any, targetPath: string, method: string, comments: any[]): string | null {
  if (!pathsInterface.body?.body) {
    return null
  }

  // Find the path property
  for (const pathMember of pathsInterface.body.body) {
    if (
      pathMember.type === 'TSPropertySignature'
      && (pathMember.key?.type === 'StringLiteral' || pathMember.key?.type === 'Literal')
      && pathMember.key.value === targetPath
    ) {
      // Found the path, now find the method
      const pathType = pathMember.typeAnnotation?.typeAnnotation

      if (pathType?.type === 'TSTypeLiteral') {
        for (const methodMember of pathType.members) {
          if (
            methodMember.type === 'TSPropertySignature'
            && methodMember.key?.type === 'Identifier'
            && methodMember.key.name === method
          ) {
            // Found the method, extract its JSDoc
            const jsdoc = extractJSDoc(methodMember, comments)
            return jsdoc.description
          }
        }
      }
    }
  }

  return null
}

/**
 * Extract response structure from JSDoc text
 */
function extractResponseFromJSDoc(jsdocText: string): ResponseStructure | null {
  const variants: ResponseVariant[] = []
  const foundKeys = new Set<string>()

  // Pattern: "key called `resource`" or "key of `resource`"
  const keyPattern = /key (?:called|of) `(\w+)`/g
  let match

  // eslint-disable-next-line no-cond-assign
  while ((match = keyPattern.exec(jsdocText)) !== null) {
    const keyName = match[1]
    if (keyName && !foundKeys.has(keyName)) {
      foundKeys.add(keyName)

      // Check if it's described as an array
      const beforeMatch = jsdocText.substring(0, match.index)
      const isArray = beforeMatch.toLowerCase().includes('array') || keyName.endsWith('s')

      variants.push({
        properties: [keyName],
        isArrayProperty: isArray,
      })
    }
  }

  if (variants.length === 0) {
    return null
  }

  return {
    isUnion: variants.length > 1,
    variants,
  }
}

/**
 * Complete API specification from types.d.ts
 */
export interface ApiSpec {
  /** API name/identifier */
  name: string
  /** All available paths/endpoints */
  paths: Map<string, PathInfo>
  /** API title from JSDoc */
  title?: string
  /** API description */
  description?: string
}

/**
 * Path/endpoint information
 */
export interface PathInfo {
  /** Path string (e.g., "/v2/droplets") */
  path: string
  /** Available HTTP methods */
  methods: Map<string, MethodInfo>
}

/**
 * HTTP method information for an endpoint
 */
export interface MethodInfo {
  /** HTTP method (get, post, etc.) */
  method: string
  /** Description from JSDoc */
  description: string
  /** Request body structure if any */
  requestBody?: RequestBodyInfo
  /** Path parameters */
  pathParams?: ParameterInfo[]
  /** Query parameters */
  queryParams?: ParameterInfo[]
  /** Response structure */
  response?: ResponseStructure
}

/**
 * Request body information
 */
export interface RequestBodyInfo {
  /** Required fields */
  required: string[]
  /** All fields with their types */
  fields: Map<string, FieldInfo>
}

/**
 * Field information
 */
export interface FieldInfo {
  /** Field name */
  name: string
  /** Field type (string, number, etc.) */
  type: string
  /** Is this field required? */
  required: boolean
  /** Description */
  description?: string
  /** Example value */
  example?: string
}

/**
 * Parameter information (path or query)
 */
export interface ParameterInfo {
  /** Parameter name */
  name: string
  /** Type */
  type: string
  /** Required? */
  required: boolean
  /** Description */
  description?: string
}

/**
 * Parse complete API specification from types.d.ts
 */
export function parseApiSpec(filePath: string, apiName: string): ApiSpec | null {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const result = parseSync(filePath, content)

    if (result.errors.length > 0) {
      return null
    }

    const paths = new Map<string, PathInfo>()

    // Find the paths interface
    for (const statement of result.program.body) {
      if (statement.type === 'TSModuleDeclaration' && statement.body?.type === 'TSModuleBlock') {
        for (const moduleStatement of statement.body.body) {
          if (
            moduleStatement.type === 'ExportNamedDeclaration'
            && moduleStatement.declaration?.type === 'TSInterfaceDeclaration'
            && moduleStatement.declaration.id.name === 'paths'
          ) {
            // Parse all paths
            const pathsInterface = moduleStatement.declaration
            extractAllPaths(pathsInterface, paths, result.comments || [])
          }
        }
      }
    }

    return {
      name: apiName,
      paths,
    }
  }
  catch {
    return null
  }
}

/**
 * Extract all paths from the paths interface
 */
function extractAllPaths(pathsInterface: any, paths: Map<string, PathInfo>, comments: any[]): void {
  if (!pathsInterface.body?.body) {
    return
  }

  for (const pathMember of pathsInterface.body.body) {
    if (
      pathMember.type === 'TSPropertySignature'
      && (pathMember.key?.type === 'StringLiteral' || pathMember.key?.type === 'Literal')
    ) {
      const pathString = pathMember.key.value as string
      const pathType = pathMember.typeAnnotation?.typeAnnotation

      if (pathType?.type === 'TSTypeLiteral') {
        const methods = new Map<string, MethodInfo>()

        // Extract all methods for this path
        for (const methodMember of pathType.members) {
          if (
            methodMember.type === 'TSPropertySignature'
            && methodMember.key?.type === 'Identifier'
          ) {
            const methodName = methodMember.key.name as string

            // Skip non-HTTP methods
            if (!['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].includes(methodName)) {
              continue
            }

            const jsdoc = extractJSDoc(methodMember, comments)
            const responseStructure = extractResponseFromJSDoc(jsdoc.description)

            methods.set(methodName, {
              method: methodName,
              description: jsdoc.description,
              response: responseStructure ?? undefined,
            })
          }
        }

        if (methods.size > 0) {
          paths.set(pathString, {
            path: pathString,
            methods,
          })
        }
      }
    }
  }
}

/**
 * Cache for parsed type information
 */
export class TypeInfoCache {
  private cache = new Map<string, TypeHelperInfo[]>()

  /**
   * Get or parse type information for a file
   */
  get(filePath: string): TypeHelperInfo[] {
    if (!this.cache.has(filePath)) {
      const info = parseTypesFile(filePath)
      this.cache.set(filePath, info)
    }
    return this.cache.get(filePath) || []
  }

  /**
   * Clear the cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Find type helper by name across all cached files
   */
  findTypeHelper(name: string): TypeHelperInfo | undefined {
    for (const helpers of this.cache.values()) {
      const helper = helpers.find(h => h.name === name)
      if (helper) {
        return helper
      }
    }
    return undefined
  }
}
