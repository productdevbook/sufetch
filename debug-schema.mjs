#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { decode } from '@toon-format/toon'

// Load and decode the TOON spec
const toonContent = readFileSync('./openapi-specs/digitalocean/api.toon', 'utf-8')
const spec = decode(toonContent, { strict: false })

// Find the POST /v2/droplets endpoint
const path = spec.paths['/v2/droplets']
const operation = path?.post

if (!operation) {
  console.error('Endpoint not found!')
  process.exit(1)
}

console.log('✅ Found POST /v2/droplets')
console.log('\n📋 Request Body Schema:')

const bodySchema = operation.requestBody?.content?.['application/json']?.schema

if (!bodySchema) {
  console.log('❌ No request body schema found')
  process.exit(1)
}

// Check if it's a reference
if ('$ref' in bodySchema) {
  console.log(`Reference: ${bodySchema.$ref}`)

  // Resolve the reference
  const refPath = bodySchema.$ref.replace('#/', '').split('/')
  let resolved = spec
  for (const part of refPath) {
    resolved = resolved[part]
  }

  console.log('\n📝 Resolved Schema:')
  console.log('Required fields:', resolved.required || [])
  console.log('\n🔧 Properties:')
  if (resolved.properties) {
    for (const [name, prop] of Object.entries(resolved.properties)) {
      const isRequired = (resolved.required || []).includes(name)
      const type = prop.type || '(complex)'
      console.log(`  ${isRequired ? '✓' : '○'} ${name}: ${type}`)
    }
  }
}
else {
  console.log('\n📝 Direct Schema:')

  // Check for oneOf
  if (bodySchema.oneOf) {
    console.log(`\n🔀 Schema has oneOf with ${bodySchema.oneOf.length} options:`)

    // Resolve first oneOf option (typically the single resource create)
    const firstOption = bodySchema.oneOf[0]
    if ('$ref' in firstOption) {
      console.log(`\n➡️  Using first option: ${firstOption.$ref}`)

      // Resolve the reference
      const refPath = firstOption.$ref.replace('#/', '').split('/')
      let resolved = spec
      for (const part of refPath) {
        resolved = resolved[part]
      }

      console.log('\n📝 Resolved Schema:')
      console.log('Has allOf:', !!resolved.allOf)
      console.log('Has properties:', !!resolved.properties)
      console.log('Required fields:', resolved.required || [])
      console.log('\nFull resolved schema:')
      console.log(JSON.stringify(resolved, null, 2).substring(0, 3000))
    }
  }
}
