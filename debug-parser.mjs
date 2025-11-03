#!/usr/bin/env node
import { readFileSync } from 'node:fs'

const content = readFileSync('./openapi-specs/digitalocean/types.d.ts', 'utf-8')
const path = '/v2/droplets'
const method = 'post'

console.log('Step 1: Finding path definition')
// Find the path first
const pathIndex = content.indexOf(`"${path}":`)
console.log('Path found at index:', pathIndex)

if (pathIndex === -1) {
  console.log('✗ Path not found')
  process.exit(1)
}

// Find the method within the next 3000 characters
const searchArea = content.substring(pathIndex, pathIndex + 3000)
console.log('\nSearching for method pattern in:')
console.log('Characters 0-500:', searchArea.substring(0, 500))
console.log('\nCharacters 900-1100:', searchArea.substring(900, 1100))

const methodPattern = new RegExp(`${method}:\\s*operations\\["([^"]+)"\\]`)
const pathMatch = searchArea.match(methodPattern)

console.log('Pattern:', methodPattern)
console.log('Match result:', pathMatch)

if (pathMatch) {
  console.log('✓ Found operation name:', pathMatch[1])
  const operationName = pathMatch[1]

  console.log('\nStep 2: Finding operation definition')
  const operationPattern = new RegExp(`${operationName}:\\s*\\{[\\s\\S]*?responses:\\s*\\{[\\s\\S]*?\\}\\s*\\}\\s*;`)
  const operationMatch = content.match(operationPattern)

  if (operationMatch) {
    console.log('✓ Found operation definition')
    console.log('First 500 chars:', operationMatch[0].substring(0, 500))

    console.log('\nStep 3: Finding status code')
    const statusPattern = /(200|201|202|203|204):\s*components\["responses"\]\["([^"]+)"\]/
    const statusMatch = operationMatch[0].match(statusPattern)

    if (statusMatch) {
      console.log('✓ Found status code:', statusMatch[1])
      console.log('✓ Response name:', statusMatch[2])

      const responseName = statusMatch[2]

      console.log('\nStep 4: Finding response definition in components')
      const responsePattern = new RegExp(`${responseName}:\\s*\\{[\\s\\S]*?content:\\s*\\{[\\s\\S]*?"application/json":\\s*([\\s\\S]*?)\\}\\s*;\\s*\\}`)
      const responseMatch = content.match(responsePattern)

      if (responseMatch) {
        console.log('✓ Found response definition')
        console.log('Response content:', responseMatch[1])
      } else {
        console.log('✗ Response definition not found')
      }
    } else {
      console.log('✗ Status code not found')
    }
  } else {
    console.log('✗ Operation definition not found')
  }
} else {
  console.log('✗ Path definition not found')
}
