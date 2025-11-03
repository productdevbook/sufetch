#!/usr/bin/env node
import { parseTypesFile } from './src/type-parser.ts'

const typesFile = './openapi-specs/hetzner/types.d.ts'

console.log('🔍 Parsing types file:', typesFile)
console.log('')

const typeHelpers = parseTypesFile(typesFile)

console.log(`✅ Found ${typeHelpers.length} type helpers:`)
console.log('')

for (const helper of typeHelpers) {
  console.log(`📦 ${helper.name}`)
  console.log(`   Description: ${helper.description.substring(0, 100)}...`)
  console.log(`   Examples: ${helper.examples.length}`)
  console.log(`   Properties: ${helper.properties.length}`)

  if (helper.properties.length > 0) {
    console.log('   Property names:')
    for (const prop of helper.properties) {
      console.log(`     - ${prop.name}: ${prop.description.substring(0, 60)}...`)
    }
  }

  console.log('')
}
