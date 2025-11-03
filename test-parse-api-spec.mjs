#!/usr/bin/env node
import { parseApiSpec } from './src/type-parser.ts'

const typesPath = './openapi-specs/digitalocean/types.d.ts'
const spec = parseApiSpec(typesPath, 'digitalocean')

if (!spec) {
  console.log('❌ Failed to parse API spec')
  process.exit(1)
}

console.log('✅ Parsed API spec successfully!\n')
console.log(`API: ${spec.name}`)
console.log(`Total paths: ${spec.paths.size}`)

// Show first 5 paths
let count = 0
for (const [path, pathInfo] of spec.paths) {
  if (count++ >= 5) break

  console.log(`\n📍 ${path}`)
  console.log(`  Methods: ${Array.from(pathInfo.methods.keys()).join(', ')}`)

  // Show details for POST /v2/droplets
  if (path === '/v2/droplets') {
    const postMethod = pathInfo.methods.get('post')
    if (postMethod) {
      console.log(`\n  POST method:`)
      console.log(`    Description: ${postMethod.description.substring(0, 100)}...`)
      console.log(`    Has response: ${!!postMethod.response}`)
      if (postMethod.response) {
        console.log(`    Response is union: ${postMethod.response.isUnion}`)
        console.log(`    Response variants: ${postMethod.response.variants.length}`)
        postMethod.response.variants.forEach((v, i) => {
          console.log(`      Variant ${i + 1}: ${v.properties.join(', ')} (array: ${v.isArrayProperty})`)
        })
      }
    }
  }
}
