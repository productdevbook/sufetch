#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { parseSync } from 'oxc-parser'

const typesFile = './openapi-specs/digitalocean/types.d.ts'
const content = readFileSync(typesFile, 'utf-8')

// Find the DigitalOcean type helper
const helperMatch = content.match(/export type DigitalOcean<[^>]+>/s)
if (helperMatch) {
  console.log('Found DigitalOcean type helper')
}

// Search for /v2/droplets and post
const postDropletsIndex = content.indexOf("'/v2/droplets'")
if (postDropletsIndex !== -1) {
  // Get surrounding context
  const contextStart = Math.max(0, postDropletsIndex - 200)
  const contextEnd = Math.min(content.length, postDropletsIndex + 2000)
  const context = content.substring(contextStart, contextEnd)

  console.log('\n📍 Found /v2/droplets around index:', postDropletsIndex)
  console.log('\nContext:')
  console.log(context.substring(0, 1500))
}

// Try to find the response type structure
const responsePattern = /response:\s*(?:\{[^}]+\}|[a-zA-Z0-9_$]+)/g
const matches = content.match(responsePattern)
if (matches) {
  console.log('\n\nFound response patterns:', matches.slice(0, 10))
}
