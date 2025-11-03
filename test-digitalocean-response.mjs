#!/usr/bin/env node
import { parseResponseStructure } from './src/type-parser.ts'

// Test parsing DigitalOcean POST /v2/droplets response structure
const typesPath = './openapi-specs/digitalocean/types.d.ts'
const path = '/v2/droplets'
const method = 'post'

console.log('🔍 Testing Response Structure Parser\n')
console.log(`API: digitalocean`)
console.log(`Endpoint: ${method.toUpperCase()} ${path}`)
console.log('---')

const result = parseResponseStructure(typesPath, path, method)

if (result) {
  console.log('\n✅ Response structure parsed successfully!\n')
  console.log('Is Union:', result.isUnion)
  console.log('Variants:', result.variants.length)

  result.variants.forEach((variant, index) => {
    console.log(`\nVariant ${index + 1}:`)
    console.log('  Properties:', variant.properties.join(', '))
    console.log('  Is Array Property:', variant.isArrayProperty)
  })
} else {
  console.log('\n❌ Failed to parse response structure')
}
