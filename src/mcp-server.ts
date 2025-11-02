#!/usr/bin/env node
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { decode } from '@toon-format/toon'

/**
 * Represents a loaded API specification.
 */
interface ApiSpec {
  /** Unique identifier for the API (e.g., "ory/kratos") */
  name: string
  /** File path to the .toon file */
  path: string
  /** Decoded OpenAPI specification object */
  spec: any
}

/**
 * Represents a generated TypeScript code example.
 */
interface CodeExample {
  /** Import statements needed for the example */
  imports: string
  /** Client setup code */
  setup: string
  /** API request code */
  usage: string
  /** Complete executable example including all parts */
  fullExample: string
}

/**
 * MCP (Model Context Protocol) server for ToonFetch.
 *
 * Provides AI assistants with tools to introspect OpenAPI specifications,
 * search endpoints, and generate TypeScript code examples using the toonfetch library.
 *
 * The server loads OpenAPI specs in TOON format from the openapi-specs directory
 * and exposes 7 MCP tools for API exploration and code generation.
 *
 * @example
 * ```typescript
 * // The server is started automatically when run as a script
 * // Configure in Claude Desktop:
 * {
 *   "mcpServers": {
 *     "toonfetch": {
 *       "command": "node",
 *       "args": ["/path/to/dist/mcp-server.js"]
 *     }
 *   }
 * }
 * ```
 */
class ToonFetchMCPServer {
  private server: Server
  private specs: Map<string, ApiSpec> = new Map()
  private specsDir: string

  /**
   * Initialize the MCP server and load API specifications.
   *
   * Automatically discovers and loads all .toon files from the openapi-specs directory.
   */
  constructor() {
    this.server = new Server(
      {
        name: 'toonfetch-mcp',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      },
    )

    // Get the directory where this script is located
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    // Go up one level from dist to reach project root
    const projectRoot = resolve(__dirname, '..')
    this.specsDir = resolve(projectRoot, 'openapi-specs')

    console.error(`Looking for specs in: ${this.specsDir}`)
    this.loadSpecs()
    this.setupHandlers()
  }

  /**
   * Recursively scan the openapi-specs directory and load all .toon files.
   *
   * Converts TOON-encoded files back to OpenAPI JSON and stores them in the specs map.
   * Errors during loading of individual files are logged but don't prevent server startup.
   *
   * @private
   */
  private loadSpecs() {
    try {
      // Scan openapi-specs directory for .toon files
      const scanDir = (dir: string, prefix = '') => {
        const entries = readdirSync(dir, { withFileTypes: true })

        for (const entry of entries) {
          const fullPath = join(dir, entry.name)

          if (entry.isDirectory()) {
            scanDir(fullPath, prefix ? `${prefix}/${entry.name}` : entry.name)
          }
          else if (entry.name.endsWith('.toon')) {
            const name = entry.name.replace('.toon', '')
            const key = prefix ? `${prefix}/${name}` : name

            try {
              const toonContent = readFileSync(fullPath, 'utf-8')
              // Use strict: false to allow flexible array counts in OpenAPI specs
              const spec = decode(toonContent, { strict: false })

              this.specs.set(key, {
                name: key,
                path: fullPath,
                spec,
              })
            }
            catch (error) {
              console.error(`Failed to load ${fullPath}:`, error)
            }
          }
        }
      }

      scanDir(this.specsDir)
      console.error(`Loaded ${this.specs.size} API specs`)
    }
    catch (error) {
      console.error('Failed to load specs:', error)
    }
  }

  /**
   * Extract the service name from an API identifier.
   *
   * @param apiName - Full API identifier (e.g., "ory/kratos")
   * @returns Service name (e.g., "kratos")
   * @private
   *
   * @example
   * ```typescript
   * getApiServiceName("ory/kratos") // returns "kratos"
   * getApiServiceName("ory/hydra") // returns "hydra"
   * ```
   */
  private getApiServiceName(apiName: string): string {
    // Convert "ory/kratos" to "kratos", "ory/hydra" to "hydra"
    return apiName.split('/').pop() || apiName
  }

  /**
   * Generate a realistic example value based on OpenAPI schema definition.
   *
   * Uses schema type, format, and property name to generate appropriate example values.
   * Handles primitive types, arrays, objects, and nested schemas.
   *
   * @param schema - OpenAPI schema definition
   * @param propertyName - Optional property name for context-aware value generation
   * @returns Generated example value matching the schema type
   * @private
   *
   * @example
   * ```typescript
   * generateExampleValue({ type: 'string', format: 'email' }) // "user@example.com"
   * generateExampleValue({ type: 'string', format: 'uuid' }) // "550e8400-e29b-41d4-a716-446655440000"
   * generateExampleValue({ type: 'number' }) // 10
   * generateExampleValue({ type: 'boolean' }) // true
   * ```
   */
  /**
   * Resolve a JSON reference ($ref) in an OpenAPI spec.
   *
   * @param ref - Reference string (e.g., "#/components/schemas/User")
   * @param spec - Complete OpenAPI specification object
   * @returns Resolved schema object or undefined
   * @private
   */
  private resolveRef(ref: string, spec: any): any {
    if (!ref || !ref.startsWith('#/')) {
      console.error('[resolveRef] Invalid ref:', ref)
      return undefined
    }

    const path = ref.substring(2).split('/')
    console.error('[resolveRef] Path segments:', path)
    let current = spec

    for (const segment of path) {
      if (!current || typeof current !== 'object') {
        console.error('[resolveRef] Failed at segment:', segment, 'current type:', typeof current)
        return undefined
      }
      current = current[segment]
      console.error('[resolveRef] After segment', segment, ':', current ? 'exists' : 'undefined')
    }

    console.error('[resolveRef] Final result:', current ? 'exists' : 'undefined', '- has allOf:', !!current?.allOf)
    return current
  }

  private generateExampleValue(schema: any, propertyName?: string, spec?: any): any {
    if (!schema) {
      console.error('[generateExampleValue] Schema is null/undefined')
      return undefined
    }

    // If there's an example, use it
    if (schema.example !== undefined)
      return schema.example

    // Handle references - resolve and recurse
    if (schema.$ref && spec) {
      console.error('[generateExampleValue] Resolving $ref:', schema.$ref)
      const resolved = this.resolveRef(schema.$ref, spec)
      if (resolved)
        return this.generateExampleValue(resolved, propertyName, spec)
    }

    // Handle oneOf/anyOf - use first option
    if (schema.oneOf && schema.oneOf.length > 0) {
      console.error('[generateExampleValue] Found oneOf with', schema.oneOf.length, 'options')
      console.error('[generateExampleValue] First oneOf option:', JSON.stringify(schema.oneOf[0]).substring(0, 200))
      const result = this.generateExampleValue(schema.oneOf[0], propertyName, spec)
      console.error('[generateExampleValue] oneOf result:', result !== undefined ? 'has value' : 'undefined')
      return result
    }
    if (schema.anyOf && schema.anyOf.length > 0) {
      return this.generateExampleValue(schema.anyOf[0], propertyName, spec)
    }

    // Handle allOf - merge all properties from all schemas
    if (schema.allOf && schema.allOf.length > 0) {
      const mergedProperties: any = {}

      for (const subSchema of schema.allOf) {
        const resolved = subSchema.$ref ? this.resolveRef(subSchema.$ref, spec) : subSchema

        // If resolved schema has properties, merge them
        if (resolved?.properties) {
          for (const [key, prop] of Object.entries(resolved.properties)) {
            mergedProperties[key] = this.generateExampleValue(prop as any, key, spec)
          }
        }
        // If it's an object type without properties, recursively process it
        else if (resolved) {
          const value = this.generateExampleValue(resolved, propertyName, spec)
          if (value && typeof value === 'object') {
            Object.assign(mergedProperties, value)
          }
        }
      }

      return Object.keys(mergedProperties).length > 0 ? mergedProperties : undefined
    }

    // Handle arrays
    if (schema.type === 'array') {
      return [this.generateExampleValue(schema.items, undefined, spec)]
    }

    // Handle objects
    if (schema.type === 'object') {
      const example: any = {}
      if (schema.properties) {
        for (const [key, prop] of Object.entries(schema.properties)) {
          example[key] = this.generateExampleValue(prop as any, key, spec)
        }
      }
      return example
    }

    // Handle primitive types
    switch (schema.type) {
      case 'string':
        if (schema.format === 'email')
          return 'user@example.com'
        if (schema.format === 'date-time')
          return new Date().toISOString()
        if (schema.format === 'uuid')
          return '550e8400-e29b-41d4-a716-446655440000'
        if (propertyName?.toLowerCase().includes('id'))
          return 'example-id'
        if (propertyName?.toLowerCase().includes('name'))
          return 'Example Name'
        return 'example'
      case 'number':
      case 'integer':
        return schema.format === 'int64' ? 1 : 10
      case 'boolean':
        return true
      default:
        return undefined
    }
  }

  /**
   * Extract authentication information from OpenAPI spec.
   *
   * Analyzes security requirements and security schemes to determine
   * the authentication method, environment variable name, and header format.
   *
   * @param spec - Complete OpenAPI specification object
   * @param operation - OpenAPI operation object
   * @param apiName - Full API identifier (e.g., "ory/kratos")
   * @returns Authentication information including type, env var name, and header details
   * @private
   *
   * @example
   * ```typescript
   * const authInfo = extractAuthInfo(spec, operation, "hetzner/cloud")
   * // Returns: { type: 'bearer', envVarName: 'HCLOUD_TOKEN', headerName: 'Authorization', scheme: 'bearer' }
   * ```
   */
  private extractAuthInfo(spec: any, operation: any, apiName: string): {
    type: string | null
    envVarName: string | null
    headerName: string
    scheme?: string
  } {
    // Get security requirements (endpoint-level takes precedence over global)
    const securityReqs = operation.security || spec.security || []

    // If no security requirements, return null
    if (!securityReqs || securityReqs.length === 0) {
      return { type: null, envVarName: null, headerName: 'Authorization' }
    }

    // Get the first security requirement
    const firstReq = securityReqs[0]
    if (!firstReq) {
      return { type: null, envVarName: null, headerName: 'Authorization' }
    }

    const schemeName = Object.keys(firstReq)[0]
    if (!schemeName) {
      return { type: null, envVarName: null, headerName: 'Authorization' }
    }

    // Look up the security scheme definition
    const scheme = spec.components?.securitySchemes?.[schemeName]

    if (!scheme) {
      return { type: null, envVarName: null, headerName: 'Authorization' }
    }

    // Infer environment variable name based on API
    let envVarName: string | null = null
    if (apiName.includes('hetzner')) {
      envVarName = 'HCLOUD_TOKEN'
    }
    else if (apiName.includes('digitalocean')) {
      envVarName = 'DIGITALOCEAN_TOKEN'
    }
    else if (apiName.includes('kratos') || apiName.includes('hydra') || apiName.includes('ory')) {
      envVarName = 'ORY_API_KEY'
    }

    // Get header name (for apiKey type) or default to Authorization
    const headerName = scheme.name || 'Authorization'

    return {
      type: scheme.type,
      scheme: scheme.scheme,
      envVarName,
      headerName,
    }
  }

  /**
   * Get the type helper name for an API service.
   *
   * Maps API names to their TypeScript type helper names for use in
   * generated code examples with type safety.
   *
   * @param apiName - Full API identifier (e.g., "digitalocean/api", "hetzner/cloud")
   * @returns Type helper name or null if not available
   * @private
   *
   * @example
   * ```typescript
   * getTypeHelperName("digitalocean/api")  // Returns "DigitalOcean"
   * getTypeHelperName("hetzner/cloud")     // Returns "HetznerCloud"
   * getTypeHelperName("ory/kratos")        // Returns "OryKaratos"
   * ```
   */
  private getTypeHelperName(apiName: string): string | null {
    const mapping: Record<string, string> = {
      'digitalocean/api': 'DigitalOcean',
      'hetzner/cloud': 'HetznerCloud',
      'ory/kratos': 'OryKaratos',
      'ory/hydra': 'OryHydra',
    }
    return mapping[apiName] || null
  }

  /**
   * Analyze the response structure to extract useful information for code generation.
   *
   * Detects success status code, wrapper objects, primary resource, and important fields
   * to generate intuitive response access patterns in code examples.
   *
   * @param operation - OpenAPI operation object
   * @param spec - Complete OpenAPI specification object
   * @returns Response structure information or null if no response schema found
   * @private
   */
  private analyzeResponseStructure(operation: any, spec: any): {
    statusCode: number
    schema: any
    wrapperKeys: string[]
    primaryResource: string | null
    importantFields: string[]
    isArray: boolean
    hasActions: boolean
  } | null {
    if (!operation.responses) {
      return null
    }

    // Determine success status code (prefer 200, then 201, 202, 204)
    const successStatuses = [200, 201, 202, 204]
    let statusCode: number | null = null
    let responseObj: any = null

    for (const status of successStatuses) {
      if (operation.responses[status]) {
        statusCode = status
        responseObj = operation.responses[status]
        break
      }
    }

    if (!statusCode || !responseObj) {
      return null
    }

    // Extract response schema
    const content = responseObj.content?.['application/json']
    if (!content?.schema) {
      return null
    }

    let schema = content.schema

    // Resolve $ref if present
    if (schema.$ref) {
      schema = this.resolveRef(schema.$ref, spec)
      if (!schema) {
        return null
      }
    }

    // Handle oneOf/anyOf - use first option (usually the primary variant)
    if (schema.oneOf && schema.oneOf.length > 0) {
      let firstOption = schema.oneOf[0]
      if (firstOption.$ref) {
        firstOption = this.resolveRef(firstOption.$ref, spec)
      }
      if (firstOption) {
        schema = firstOption
      }
    }
    else if (schema.anyOf && schema.anyOf.length > 0) {
      let firstOption = schema.anyOf[0]
      if (firstOption.$ref) {
        firstOption = this.resolveRef(firstOption.$ref, spec)
      }
      if (firstOption) {
        schema = firstOption
      }
    }

    // Detect if response is an array
    const isArray = schema.type === 'array'
    let propertiesSchema = isArray && schema.items ? schema.items : schema

    // Resolve items $ref for arrays
    if (propertiesSchema.$ref) {
      propertiesSchema = this.resolveRef(propertiesSchema.$ref, spec)
    }

    // Extract wrapper keys (top-level properties that might contain resources)
    const wrapperKeys: string[] = []
    let primaryResource: string | null = null
    const importantFields: string[] = []
    let hasActions = false

    if (propertiesSchema?.properties && typeof propertiesSchema.properties === 'object') {
      const properties = propertiesSchema.properties

      // Common resource wrapper names (DigitalOcean, Hetzner patterns)
      const resourcePatterns = ['server', 'droplet', 'image', 'volume', 'snapshot', 'firewall', 'load_balancer', 'certificate', 'database', 'identity', 'client', 'token', 'session', 'action', 'network', 'ssh_key', 'domain', 'project']

      for (const key of Object.keys(properties)) {
        wrapperKeys.push(key)

        // Detect primary resource (object with nested properties)
        const prop = properties[key]
        const resolvedProp = prop.$ref ? this.resolveRef(prop.$ref, spec) : prop

        if (!primaryResource && resolvedProp?.type === 'object' && resourcePatterns.includes(key)) {
          primaryResource = key
        }

        // Detect actions (common in async APIs like Hetzner)
        if (key === 'action' || key === 'next_actions') {
          hasActions = true
        }
      }

      // If no resource pattern matched, use the first object property as primary
      if (!primaryResource && wrapperKeys.length > 0) {
        for (const key of wrapperKeys) {
          const prop = properties[key]
          const resolvedProp = prop.$ref ? this.resolveRef(prop.$ref, spec) : prop

          if (resolvedProp?.type === 'object' && key !== 'links' && key !== 'meta' && key !== 'metadata') {
            primaryResource = key
            break
          }
        }
      }

      // Extract important fields from primary resource
      if (primaryResource) {
        const resourceProp = properties[primaryResource]
        const resolvedResource = resourceProp.$ref ? this.resolveRef(resourceProp.$ref, spec) : resourceProp

        if (resolvedResource?.properties) {
          const importantFieldNames = ['id', 'name', 'status', 'state', 'created', 'created_at', 'updated_at', 'ip', 'ip_address', 'email']

          for (const fieldName of importantFieldNames) {
            if (resolvedResource.properties[fieldName]) {
              importantFields.push(fieldName)
            }
          }
        }
      }
    }

    return {
      statusCode,
      schema,
      wrapperKeys,
      primaryResource,
      importantFields,
      isArray,
      hasActions,
    }
  }

  /**
   * Generate a complete TypeScript code example for an API endpoint.
   *
   * Creates copy-paste-ready code including imports, client setup, and request execution.
   * Automatically generates realistic example values for path parameters, query parameters,
   * and request bodies based on the OpenAPI specification.
   *
   * @param apiName - Full API identifier (e.g., "ory/kratos")
   * @param spec - Complete OpenAPI specification object
   * @param path - Endpoint path (e.g., "/admin/identities")
   * @param method - HTTP method (e.g., "get", "post")
   * @param operation - OpenAPI operation object from the spec
   * @returns CodeExample object with separate parts and full example
   * @private
   *
   * @example
   * ```typescript
   * const example = generateCodeExample(
   *   "ory/kratos",
   *   specObject,
   *   "/admin/identities",
   *   "post",
   *   operationObject
   * )
   * console.log(example.fullExample) // Complete executable TypeScript code
   * ```
   */
  private generateCodeExample(apiName: string, spec: any, path: string, method: string, operation: any): CodeExample {
    const serviceName = this.getApiServiceName(apiName)
    const methodUpper = method.toUpperCase()

    // Extract authentication information
    const authInfo = this.extractAuthInfo(spec, operation, apiName)

    // Get type helper name for type-safe code generation
    const typeHelperName = this.getTypeHelperName(apiName)

    // Analyze response structure for intuitive code generation
    const responseStructure = this.analyzeResponseStructure(operation, spec)

    // Generate imports
    let imports = `import { createClient, ${serviceName} } from 'toonfetch/${apiName.split('/')[0]}'`

    // Add type import for type-safe examples
    if (typeHelperName) {
      imports += `\nimport type { ${typeHelperName} } from 'toonfetch/${apiName.split('/')[0]}'`
    }

    // Generate client setup
    const baseUrlExample = apiName.includes('kratos')
      ? 'https://your-kratos-instance.com'
      : apiName.includes('hydra')
        ? 'https://your-hydra-instance.com'
        : apiName.includes('hetzner')
          ? 'https://api.hetzner.cloud/v1'
          : apiName.includes('digitalocean')
            ? 'https://api.digitalocean.com/v2'
            : 'https://api.example.com'

    // Build client setup with authentication
    let setup = `const client = createClient({
  baseURL: '${baseUrlExample}',`

    // Add authentication headers if required
    if (authInfo.type && authInfo.envVarName) {
      if (authInfo.type === 'http' && authInfo.scheme === 'bearer') {
        // Bearer token authentication
        setup += `
  headers: {
    'Authorization': \`Bearer \${process.env.${authInfo.envVarName}}\`,
  },`
      }
      else if (authInfo.type === 'apiKey') {
        // API Key authentication
        setup += `
  headers: {
    '${authInfo.headerName}': process.env.${authInfo.envVarName},
  },`
      }
    }

    setup += `
}).with(${serviceName})`

    // Extract parameters
    const pathParams: any = {}
    const queryParams: any = {}
    let requestBody: any

    // Process parameters
    if (operation.parameters) {
      for (const param of operation.parameters) {
        if (param.in === 'path') {
          pathParams[param.name] = this.generateExampleValue(param.schema, param.name, spec)
        }
        else if (param.in === 'query') {
          queryParams[param.name] = this.generateExampleValue(param.schema, param.name, spec)
        }
      }
    }

    // Process request body and extract required fields info
    let requestBodySchema: any = null
    let requiredFields: string[] = []
    let isRequestBodyRequired = false

    if (operation.requestBody) {
      const content = operation.requestBody.content
      const jsonContent = content?.['application/json']
      isRequestBodyRequired = operation.requestBody.required === true

      console.error(`[DEBUG] ${method} ${path} - requestBody exists:`, !!operation.requestBody)
      console.error(`[DEBUG] ${method} ${path} - content exists:`, !!content)
      console.error(`[DEBUG] ${method} ${path} - jsonContent exists:`, !!jsonContent)
      console.error(`[DEBUG] ${method} ${path} - schema exists:`, !!jsonContent?.schema)

      if (jsonContent?.schema) {
        console.error(`[DEBUG] ${method} ${path} - schema keys:`, Object.keys(jsonContent.schema))
        requestBodySchema = jsonContent.schema

        // Resolve $ref if present
        const resolvedSchema = requestBodySchema.$ref
          ? this.resolveRef(requestBodySchema.$ref, spec)
          : requestBodySchema

        // Extract required fields
        if (resolvedSchema?.required && Array.isArray(resolvedSchema.required)) {
          requiredFields = resolvedSchema.required
        }
        // Also check for allOf patterns that merge required fields
        else if (resolvedSchema?.allOf) {
          for (const subSchema of resolvedSchema.allOf) {
            const resolved = subSchema.$ref ? this.resolveRef(subSchema.$ref, spec) : subSchema
            if (resolved?.required && Array.isArray(resolved.required)) {
              requiredFields.push(...resolved.required)
            }
          }
        }

        requestBody = this.generateExampleValue(jsonContent.schema, undefined, spec)
        console.error(`[DEBUG] Generated requestBody for ${method} ${path}:`, requestBody !== undefined ? `${Object.keys(requestBody || {}).length} properties` : 'undefined')
      }
    }

    // Generate type definitions if type helper is available
    let typeDefinitions = ''
    let typedVariables = ''

    if (typeHelperName) {
      const typeDefs: string[] = []

      // Add request body type if exists
      if (requestBody !== undefined) {
        typeDefs.push(`type RequestBody = ${typeHelperName}<'${path}', '${method.toLowerCase()}'>['request']`)
      }

      // Add query params type if exists
      if (Object.keys(queryParams).length > 0) {
        typeDefs.push(`type QueryParams = ${typeHelperName}<'${path}', '${method.toLowerCase()}'>['query']`)
      }

      // Add path params type if exists
      if (Object.keys(pathParams).length > 0) {
        typeDefs.push(`type PathParams = ${typeHelperName}<'${path}', '${method.toLowerCase()}'>['path']`)
      }

      // Add response type with actual status code
      if (responseStructure) {
        typeDefs.push(`type Response = ${typeHelperName}<'${path}', '${method.toLowerCase()}'>['responses'][${responseStructure.statusCode}]`)
      }
      else {
        // Fallback to default response type if structure analysis failed
        typeDefs.push(`type Response = ${typeHelperName}<'${path}', '${method.toLowerCase()}'>['response']`)
      }

      if (typeDefs.length > 0) {
        typeDefinitions = `\n${typeDefs.join('\n')}\n`
      }
    }

    // Generate typed variables
    const variableDeclarations: string[] = []

    if (requestBody !== undefined) {
      // Add helpful comment about required fields
      let bodyComment = ''
      if (requiredFields.length > 0) {
        const allFields = Object.keys(requestBody)
        const optionalFields = allFields.filter(f => !requiredFields.includes(f))

        bodyComment = '// Request body'
        if (isRequestBodyRequired) {
          bodyComment += ' (required)'
        }
        bodyComment += '\n'
        if (requiredFields.length > 0) {
          bodyComment += `// Required fields: ${requiredFields.join(', ')}\n`
        }
        if (optionalFields.length > 0) {
          bodyComment += `// Optional fields: ${optionalFields.join(', ')}\n`
        }
      }

      const bodyJson = JSON.stringify(requestBody, null, 2)
      const typedBody = typeHelperName
        ? `${bodyComment}const body: RequestBody = ${bodyJson}`
        : `${bodyComment}const body = ${bodyJson}`
      variableDeclarations.push(typedBody)
    }

    if (Object.keys(queryParams).length > 0) {
      const queryJson = JSON.stringify(queryParams, null, 2)
      const typedQuery = typeHelperName
        ? `const query: QueryParams = ${queryJson}`
        : `const query = ${queryJson}`
      variableDeclarations.push(typedQuery)
    }

    if (Object.keys(pathParams).length > 0) {
      const pathJson = JSON.stringify(pathParams, null, 2)
      const typedPath = typeHelperName
        ? `const pathParams: PathParams = ${pathJson}`
        : `const pathParams = ${pathJson}`
      variableDeclarations.push(typedPath)
    }

    if (variableDeclarations.length > 0) {
      typedVariables = `\n${variableDeclarations.join('\n\n')}\n`
    }

    // Build request options
    const requestOptions: string[] = [`  method: '${methodUpper}'`]

    if (Object.keys(pathParams).length > 0) {
      requestOptions.push('  path: pathParams')
    }

    if (Object.keys(queryParams).length > 0) {
      requestOptions.push('  query')
    }

    if (requestBody !== undefined) {
      requestOptions.push('  body')
    }

    // Generate the API call
    const responseType = typeHelperName ? ': Response' : ''
    let usage = `const response${responseType} = await client('${path}', {
${requestOptions.join(',\n')}
})`

    // Generate intuitive response access examples
    if (responseStructure) {
      const { statusCode, primaryResource, importantFields, hasActions, isArray, wrapperKeys } = responseStructure

      // Add status code comment
      const statusMessage = statusCode === 200
        ? 'OK'
        : statusCode === 201
          ? 'Created'
          : statusCode === 202
            ? 'Accepted'
            : statusCode === 204
              ? 'No Content'
              : 'Success'

      usage += `\n\n// Response status: ${statusCode} ${statusMessage}`

      // Add primary resource access examples
      if (primaryResource && importantFields.length > 0) {
        const resourceName = primaryResource.charAt(0).toUpperCase() + primaryResource.slice(1).replace(/_/g, ' ')
        usage += `\n// Access the ${resourceName.toLowerCase()}`

        for (const field of importantFields) {
          const accessor = isArray ? `response.${wrapperKeys[0]}[0].${field}` : `response.${primaryResource}.${field}`
          const fieldLabel = field.replace(/_/g, ' ')
          usage += `\nconsole.log('${fieldLabel}:', ${accessor})`
        }
      }
      else if (primaryResource) {
        // Primary resource exists but no important fields detected
        const accessor = isArray ? `response.${wrapperKeys[0]}[0]` : `response.${primaryResource}`
        usage += `\nconsole.log('${primaryResource}:', ${accessor})`
      }
      else if (wrapperKeys.length > 0 && !isArray) {
        // No primary resource, but we have wrapper keys - show access for first non-metadata key
        const firstKey = wrapperKeys.find(k => k !== 'links' && k !== 'meta' && k !== 'metadata')
        if (firstKey) {
          usage += `\nconsole.log('${firstKey}:', response.${firstKey})`
        }
      }

      // Add action polling guidance for async operations
      if (hasActions) {
        usage += `\n\n// The operation is asynchronous - poll the action status`
        usage += `\nconst actionId = response.action.id`
        usage += `\n// Poll GET /actions/{id} endpoint until status === 'success'`
      }
    }

    // Generate authentication comment
    let authComment = ''
    if (authInfo.type && authInfo.envVarName) {
      authComment = `// Authentication: Set your API token
// export ${authInfo.envVarName}='your-token-here'

`
    }

    // Generate full example (clean, modern style)
    const fullExample = `${imports}
${typeDefinitions}
${authComment}${setup}
${typedVariables}
${usage}`

    return {
      imports,
      setup,
      usage,
      fullExample,
    }
  }

  /**
   * Generate a quickstart guide for an API with common operations.
   *
   * Creates a complete guide including installation, setup, and up to 3 example operations
   * (GET and POST requests) to help users get started quickly.
   *
   * @param apiName - Full API identifier (e.g., "ory/kratos")
   * @param spec - Complete OpenAPI specification object
   * @returns Markdown-formatted quickstart guide
   * @private
   */
  private generateQuickstart(apiName: string, spec: any): string {
    const serviceName = this.getApiServiceName(apiName)
    const baseUrlExample = apiName.includes('kratos')
      ? 'https://your-kratos-instance.com'
      : apiName.includes('hydra')
        ? 'https://your-hydra-instance.com'
        : apiName.includes('hetzner')
          ? 'https://api.hetzner.cloud/v1'
          : apiName.includes('digitalocean')
            ? 'https://api.digitalocean.com/v2'
            : 'https://api.example.com'

    // Find a few common operations
    const paths = spec.paths || {}
    const operations: Array<{ path: string, method: string, operation: any }> = []

    for (const [path, pathItem] of Object.entries(paths)) {
      for (const [method, operation] of Object.entries(pathItem as any)) {
        if (['get', 'post'].includes(method) && operations.length < 3) {
          operations.push({ path, method, operation })
        }
      }
    }

    // Extract auth info from the first operation (most likely same for all)
    const authInfo = operations.length > 0 && operations[0]
      ? this.extractAuthInfo(spec, operations[0].operation, apiName)
      : { type: null, envVarName: null, headerName: 'Authorization' }

    // Build setup with authentication
    let setup = `const client = createClient({
  baseURL: '${baseUrlExample}',`

    if (authInfo.type && authInfo.envVarName) {
      if (authInfo.type === 'http' && authInfo.scheme === 'bearer') {
        setup += `
  headers: {
    'Authorization': \`Bearer \${process.env.${authInfo.envVarName}}\`,
  },`
      }
      else if (authInfo.type === 'apiKey') {
        setup += `
  headers: {
    '${authInfo.headerName}': process.env.${authInfo.envVarName},
  },`
      }
    }

    setup += `
}).with(${serviceName})`

    let examples = ''
    for (const { path, method, operation } of operations) {
      const example = this.generateCodeExample(apiName, spec, path, method, operation)
      examples += `\n// ${operation.summary || operation.operationId || 'Example'}\n${example.usage}\n`
    }

    // Add authentication setup comment if needed
    let authSetup = ''
    if (authInfo.type && authInfo.envVarName) {
      authSetup = `
// Authentication: Set your API token
// export ${authInfo.envVarName}='your-token-here'

`
    }

    return `import { createClient, ${serviceName} } from 'toonfetch/${apiName.split('/')[0]}'
${authSetup}
// Initialize the ${spec.info?.title || serviceName} client
${setup}

// Common operations:
${examples}
`
  }

  /**
   * Configure MCP request handlers for tool listing and tool execution.
   *
   * Sets up handlers for:
   * - list_apis: List all available API specifications
   * - get_api_info: Get API metadata
   * - search_endpoints: Search endpoints by path/method/description
   * - get_endpoint_details: Get detailed endpoint information with code examples
   * - get_schema_details: Get schema/model definitions
   * - generate_code_example: Generate TypeScript code examples
   * - get_quickstart: Generate quickstart guides
   *
   * @private
   */
  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'list_apis',
          description: 'List all available API specifications',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'get_api_info',
          description: 'Get high-level information about an API (title, version, description, servers)',
          inputSchema: {
            type: 'object',
            properties: {
              api_name: {
                type: 'string',
                description: 'API name (e.g., "ory/hydra", "ory/kratos")',
              },
            },
            required: ['api_name'],
          },
        },
        {
          name: 'search_endpoints',
          description: 'Search for API endpoints by path or method',
          inputSchema: {
            type: 'object',
            properties: {
              api_name: {
                type: 'string',
                description: 'API name (e.g., "ory/hydra", "ory/kratos")',
              },
              query: {
                type: 'string',
                description: 'Search query (searches in path and summary)',
              },
              method: {
                type: 'string',
                description: 'Filter by HTTP method (GET, POST, PUT, DELETE, etc.)',
              },
            },
            required: ['api_name'],
          },
        },
        {
          name: 'get_endpoint_details',
          description: 'Get detailed information about a specific endpoint',
          inputSchema: {
            type: 'object',
            properties: {
              api_name: {
                type: 'string',
                description: 'API name (e.g., "ory/hydra", "ory/kratos")',
              },
              path: {
                type: 'string',
                description: 'Endpoint path (e.g., "/admin/oauth2/clients")',
              },
              method: {
                type: 'string',
                description: 'HTTP method (e.g., "get", "post")',
              },
            },
            required: ['api_name', 'path', 'method'],
          },
        },
        {
          name: 'get_schema_details',
          description: 'Get details about a specific schema/model definition',
          inputSchema: {
            type: 'object',
            properties: {
              api_name: {
                type: 'string',
                description: 'API name (e.g., "ory/hydra", "ory/kratos")',
              },
              schema_name: {
                type: 'string',
                description: 'Schema name from components/schemas',
              },
            },
            required: ['api_name', 'schema_name'],
          },
        },
        {
          name: 'generate_code_example',
          description: 'Generate a complete TypeScript code example for using an endpoint with toonfetch library',
          inputSchema: {
            type: 'object',
            properties: {
              api_name: {
                type: 'string',
                description: 'API name (e.g., "ory/hydra", "ory/kratos")',
              },
              path: {
                type: 'string',
                description: 'Endpoint path (e.g., "/admin/oauth2/clients")',
              },
              method: {
                type: 'string',
                description: 'HTTP method (e.g., "get", "post")',
              },
            },
            required: ['api_name', 'path', 'method'],
          },
        },
        {
          name: 'get_quickstart',
          description: 'Get a quickstart guide with common operations for an API using toonfetch',
          inputSchema: {
            type: 'object',
            properties: {
              api_name: {
                type: 'string',
                description: 'API name (e.g., "ory/hydra", "ory/kratos")',
              },
            },
            required: ['api_name'],
          },
        },
      ],
    }))

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params

      try {
        switch (name) {
          case 'list_apis':
            return this.handleListApis()
          case 'get_api_info':
            return this.handleGetApiInfo(args)
          case 'search_endpoints':
            return this.handleSearchEndpoints(args)
          case 'get_endpoint_details':
            return this.handleGetEndpointDetails(args)
          case 'get_schema_details':
            return this.handleGetSchemaDetails(args)
          case 'generate_code_example':
            return this.handleGenerateCodeExample(args)
          case 'get_quickstart':
            return this.handleGetQuickstart(args)
          default:
            throw new Error(`Unknown tool: ${name}`)
        }
      }
      catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        }
      }
    })
  }

  private handleListApis() {
    const apis = Array.from(this.specs.values()).map(spec => ({
      name: spec.name,
      title: spec.spec.info?.title || 'Unknown',
      version: spec.spec.info?.version || 'Unknown',
      description: spec.spec.info?.description || '',
    }))

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(apis, null, 2),
        },
      ],
    }
  }

  private handleGetApiInfo(args: any) {
    const spec = this.specs.get(args.api_name)
    if (!spec) {
      throw new Error(`API not found: ${args.api_name}`)
    }

    const info = {
      title: spec.spec.info?.title,
      version: spec.spec.info?.version,
      description: spec.spec.info?.description,
      servers: spec.spec.servers || [],
      tags: spec.spec.tags || [],
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(info, null, 2),
        },
      ],
    }
  }

  private handleSearchEndpoints(args: any) {
    const spec = this.specs.get(args.api_name)
    if (!spec) {
      throw new Error(`API not found: ${args.api_name}`)
    }

    const paths = spec.spec.paths || {}
    const results: any[] = []

    for (const [path, pathItem] of Object.entries(paths)) {
      for (const [method, operation] of Object.entries(pathItem as any)) {
        if (['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].includes(method)) {
          const op = operation as any
          const matchesQuery = !args.query
            || path.toLowerCase().includes(args.query.toLowerCase())
            || op.summary?.toLowerCase().includes(args.query.toLowerCase())
            || op.operationId?.toLowerCase().includes(args.query.toLowerCase())

          const matchesMethod = !args.method
            || method.toLowerCase() === args.method.toLowerCase()

          if (matchesQuery && matchesMethod) {
            results.push({
              path,
              method: method.toUpperCase(),
              operationId: op.operationId,
              summary: op.summary,
              description: op.description,
              tags: op.tags || [],
            })
          }
        }
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(results, null, 2),
        },
      ],
    }
  }

  private handleGetEndpointDetails(args: any) {
    const spec = this.specs.get(args.api_name)
    if (!spec) {
      throw new Error(`API not found: ${args.api_name}`)
    }

    const pathItem = spec.spec.paths?.[args.path]
    if (!pathItem) {
      throw new Error(`Path not found: ${args.path}`)
    }

    const operation = pathItem[args.method.toLowerCase()]
    if (!operation) {
      throw new Error(`Method not found: ${args.method} for path ${args.path}`)
    }

    // Generate code example
    const codeExample = this.generateCodeExample(args.api_name, spec.spec, args.path, args.method, operation)

    // Filter out x-codeSamples and x-code-samples to prevent SDK confusion
    // These contain SDK-specific examples that don't apply to the raw REST API
    const { 'x-codeSamples': _xCodeSamples, 'x-code-samples': _xCodeSamplesAlt, ...cleanOperation } = operation

    const result = {
      endpoint: cleanOperation,
      usage_example: {
        description: 'Copy-paste ready code example using toonfetch library',
        code: codeExample.fullExample,
      },
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    }
  }

  private handleGetSchemaDetails(args: any) {
    const spec = this.specs.get(args.api_name)
    if (!spec) {
      throw new Error(`API not found: ${args.api_name}`)
    }

    const schema = spec.spec.components?.schemas?.[args.schema_name]
    if (!schema) {
      throw new Error(`Schema not found: ${args.schema_name}`)
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(schema, null, 2),
        },
      ],
    }
  }

  private handleGenerateCodeExample(args: any) {
    const spec = this.specs.get(args.api_name)
    if (!spec) {
      throw new Error(`API not found: ${args.api_name}`)
    }

    const pathItem = spec.spec.paths?.[args.path]
    if (!pathItem) {
      throw new Error(`Path not found: ${args.path}`)
    }

    const operation = pathItem[args.method.toLowerCase()]
    if (!operation) {
      throw new Error(`Method not found: ${args.method} for path ${args.path}`)
    }

    const codeExample = this.generateCodeExample(args.api_name, spec.spec, args.path, args.method, operation)

    return {
      content: [
        {
          type: 'text',
          text: `# Code Example for ${args.method.toUpperCase()} ${args.path}

## ${operation.summary || operation.operationId || 'Endpoint Usage'}

${operation.description || ''}

\`\`\`typescript
${codeExample.fullExample}
\`\`\`

## Breakdown

### 1. Import and Setup
\`\`\`typescript
${codeExample.imports}

${codeExample.setup}
\`\`\`

### 2. Make the Request
\`\`\`typescript
${codeExample.usage}
\`\`\`
`,
        },
      ],
    }
  }

  private handleGetQuickstart(args: any) {
    const spec = this.specs.get(args.api_name)
    if (!spec) {
      throw new Error(`API not found: ${args.api_name}`)
    }

    const quickstart = this.generateQuickstart(args.api_name, spec.spec)

    return {
      content: [
        {
          type: 'text',
          text: `# Quickstart Guide: ${spec.spec.info?.title || args.api_name}

${spec.spec.info?.description || ''}

## Installation

\`\`\`bash
npm install toonfetch
# or
pnpm add toonfetch
\`\`\`

## Complete Example

\`\`\`typescript
${quickstart}
\`\`\`

## Next Steps

- Use \`search_endpoints\` to find specific operations
- Use \`generate_code_example\` to get detailed code for any endpoint
- Check the API documentation for authentication requirements
`,
        },
      ],
    }
  }

  /**
   * Start the MCP server with stdio transport.
   *
   * Connects the server to stdio transport for communication with MCP clients
   * (such as Claude Desktop). The server will remain running until the process is terminated.
   *
   * @throws Error if the server fails to start or connection fails
   *
   * @example
   * ```typescript
   * const server = new ToonFetchMCPServer()
   * await server.run()
   * ```
   */
  async run() {
    const transport = new StdioServerTransport()
    await this.server.connect(transport)
    console.error('ToonFetch MCP server running on stdio')
  }
}

// Start the server
const server = new ToonFetchMCPServer()
server.run().catch(console.error)
