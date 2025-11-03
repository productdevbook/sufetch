#!/usr/bin/env node
import { readFileSync } from 'node:fs'

const content = readFileSync('./openapi-specs/digitalocean/types.d.ts', 'utf-8')

// Find the responses section
const responsesIndex = content.indexOf('responses: {', 22000)
console.log('Responses section starts at:', responsesIndex)

// Find droplet_create response
const dropletCreateIndex = content.indexOf('droplet_create:', responsesIndex)
console.log('droplet_create response at:', dropletCreateIndex)

if (dropletCreateIndex !== -1) {
  // Get the next 1500 characters
  const responseContent = content.substring(dropletCreateIndex, dropletCreateIndex + 1500)
  console.log('\n📝 droplet_create Response:\n')
  console.log(responseContent)
}
