#!/usr/bin/env node
import { readFileSync } from 'node:fs'

const jsonContent = readFileSync('./openapi-specs/digitalocean/api.json', 'utf-8')
const spec = JSON.parse(jsonContent)

const path = spec.paths['/v2/droplets']
const operation = path?.post

console.log('📝 POST /v2/droplets Responses (from JSON):\n')
console.log('Available status codes:', Object.keys(operation.responses || {}))

if (operation.responses) {
  for (const [statusCode, response] of Object.entries(operation.responses)) {
    console.log(`\n🔹 Status ${statusCode}:`)
    console.log('  Description:', response.description?.substring(0, 80))
    console.log('  Has content:', !!response.content)
    console.log('  Has application/json:', !!response.content?.['application/json'])

    const content = response.content?.['application/json']
    if (content?.schema) {
      const schema = content.schema

      if ('$ref' in schema) {
        console.log('  Schema reference:', schema.$ref)

        // Resolve
        const refPath = schema.$ref.replace('#/', '').split('/')
        let resolved = spec
        for (const part of refPath) {
          resolved = resolved[part]
        }

        console.log('  Schema type:', resolved.type)
        if (resolved.properties) {
          console.log('  Top-level properties:', Object.keys(resolved.properties).join(', '))
        }

        if (resolved.oneOf) {
          console.log('  Has oneOf with', resolved.oneOf.length, 'options')
          for (let i = 0; i < resolved.oneOf.length; i++) {
            const option = resolved.oneOf[i]
            if ('$ref' in option) {
              console.log(`    Option ${i}:`, option.$ref)
            }
          }
        }
      }
    }
  }
}
