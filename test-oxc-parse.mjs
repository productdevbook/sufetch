#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { parseSync } from 'oxc-parser'

const typesFile = './openapi-specs/digitalocean/types.d.ts'
const content = readFileSync(typesFile, 'utf-8')
const result = parseSync(typesFile, content)

console.log('Parse errors:', result.errors.length)
console.log('Program body statements:', result.program.body.length)

// Find module declarations
for (const statement of result.program.body) {
  if (statement.type === 'TSModuleDeclaration') {
    console.log('\nFound module:', statement.id?.value)

    if (statement.body?.type === 'TSModuleBlock') {
      console.log('Module has', statement.body.body.length, 'statements')

      for (const moduleStatement of statement.body.body) {
        if (
          moduleStatement.type === 'ExportNamedDeclaration'
          && moduleStatement.declaration?.type === 'TSInterfaceDeclaration'
        ) {
          console.log('  Interface:', moduleStatement.declaration.id.name)

          if (moduleStatement.declaration.id.name === 'paths') {
            console.log('  Found paths interface!')
            console.log('  Body members:', moduleStatement.declaration.body.body.length)

            // Find /v2/droplets
            let found = false
            for (const member of moduleStatement.declaration.body.body) {
              console.log('    Member type:', member.type, 'key type:', member.key?.type)
              if (member.type === 'TSPropertySignature' && member.key?.type === 'StringLiteral') {
                if (member.key.value === '/v2/droplets') {
                  found = true
                  console.log('\n  ✓ Found /v2/droplets property')
                  console.log('  Type annotation type:', member.typeAnnotation?.typeAnnotation?.type)

                  const pathType = member.typeAnnotation?.typeAnnotation
                  if (pathType?.type === 'TSTypeLiteral') {
                    console.log('  Methods:', pathType.members.length)

                    for (const methodMember of pathType.members) {
                      if (methodMember.type === 'TSPropertySignature' && methodMember.key?.type === 'Identifier') {
                        console.log('    Method:', methodMember.key.name)
                      }
                    }
                  }
                  break
                }
              }
            }

            if (!found) {
              console.log('  ✗ Did not find /v2/droplets')
            }
          }
        }
      }
    }
  }
}
