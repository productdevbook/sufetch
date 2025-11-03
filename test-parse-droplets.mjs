#!/usr/bin/env node
import { parseApiSpec } from './src/type-parser.ts'

const typesPath = './openapi-specs/digitalocean/types.d.ts'
const spec = parseApiSpec(typesPath, 'digitalocean')

if (!spec) {
  console.log('❌ Failed to parse API spec')
  process.exit(1)
}

console.log('✅ Parsed API spec successfully!\n')
console.log(`Total paths: ${spec.paths.size}`)

// Find /v2/droplets
const dropletsPath = spec.paths.get('/v2/droplets')
if (!dropletsPath) {
  console.log('❌ /v2/droplets not found')
  process.exit(1)
}

console.log('\n📍 /v2/droplets')
console.log(`  Available methods: ${Array.from(dropletsPath.methods.keys()).join(', ')}`)

// Check POST method
const postMethod = dropletsPath.methods.get('post')
if (!postMethod) {
  console.log('❌ POST method not found')
  process.exit(1)
}

console.log('\n  POST method:')
console.log(`    Description: ${postMethod.description.substring(0, 150)}...`)
console.log(`    Has response: ${!!postMethod.response}`)

if (postMethod.response) {
  console.log(`    Response is union: ${postMethod.response.isUnion}`)
  console.log(`    Response variants: ${postMethod.response.variants.length}`)
  postMethod.response.variants.forEach((v, i) => {
    console.log(`      Variant ${i + 1}:`)
    console.log(`        Properties: ${v.properties.join(', ')}`)
    console.log(`        Is array: ${v.isArrayProperty}`)
  })
  console.log('\n✅ Response structure parsed correctly!')
} else {
  console.log('❌ Response structure not found')
}
