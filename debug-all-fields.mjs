#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { decode } from '@toon-format/toon'

const toonContent = readFileSync('./openapi-specs/digitalocean/api.toon', 'utf-8')
const spec = decode(toonContent, { strict: false })

const path = spec.paths['/v2/droplets']
const operation = path?.post
const bodySchema = operation.requestBody?.content?.['application/json']?.schema

// Resolve oneOf first option
const firstOption = bodySchema.oneOf[0]
const refPath = firstOption.$ref.replace('#/', '').split('/')
let singleCreate = spec
for (const part of refPath) {
  singleCreate = singleCreate[part]
}

console.log('🔍 Single Create Schema (droplet_single_create)')
console.log('Has allOf:', !!singleCreate.allOf)
console.log('\n')

// Collect all properties from allOf
const allProperties = {}
const allRequired = new Set()

if (singleCreate.allOf) {
  for (let i = 0; i < singleCreate.allOf.length; i++) {
    const subSchema = singleCreate.allOf[i]

    console.log(`\n📦 allOf[${i}]:`)

    if ('$ref' in subSchema) {
      console.log(`  Reference: ${subSchema.$ref}`)

      // Resolve
      const refPath = subSchema.$ref.replace('#/', '').split('/')
      let resolved = spec
      for (const part of refPath) {
        resolved = resolved[part]
      }

      if (resolved.properties) {
        console.log(`  Properties: ${Object.keys(resolved.properties).join(', ')}`)
        Object.assign(allProperties, resolved.properties)
      }

      if (resolved.required) {
        console.log(`  Required: ${resolved.required.join(', ')}`)
        resolved.required.forEach(f => allRequired.add(f))
      }
    } else {
      if (subSchema.properties) {
        console.log(`  Direct properties: ${Object.keys(subSchema.properties).join(', ')}`)
        Object.assign(allProperties, subSchema.properties)
      }

      if (subSchema.required) {
        console.log(`  Direct required: ${subSchema.required.join(', ')}`)
        subSchema.required.forEach(f => allRequired.add(f))
      }
    }
  }
}

console.log('\n\n✅ Final Combined Schema:')
console.log('Total properties:', Object.keys(allProperties).length)
console.log('Total required:', allRequired.size)
console.log('\nAll properties:', Object.keys(allProperties).sort().join(', '))
console.log('\nAll required:', Array.from(allRequired).sort().join(', '))

// Check for names specifically
console.log('\n\n🔎 Looking for "names":')
console.log('Has names:', 'names' in allProperties)
