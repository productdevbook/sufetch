#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { parseSync } from 'oxc-parser'

const typesFile = './openapi-specs/hetzner/types.d.ts'
const content = readFileSync(typesFile, 'utf-8',
)

const result = parseSync(typesFile, content)

console.log('Total comments:', result.comments.length)

// Find HetznerCloud type in source
const hetznerCloudIndex = content.indexOf('export type HetznerCloud<')
console.log('\nHetznerCloud starts at index:', hetznerCloudIndex)

// Look for the JSDoc comment before it
const commentBeforeIndex = content.lastIndexOf('/**', hetznerCloudIndex)
console.log('Last /** before HetznerCloud:', commentBeforeIndex)

if (commentBeforeIndex !== -1) {
  const commentEndIndex = content.indexOf('*/', commentBeforeIndex)
  const comment = content.substring(commentBeforeIndex, commentEndIndex + 2)
  console.log('\nComment text:')
  console.log(comment.substring(0, 300))
}

// Check if comments have position info
if (result.comments.length > 10) {
  const comment = result.comments[10]
  console.log('\nSample comment object keys:', Object.keys(comment))
  console.log('Sample comment:', JSON.stringify(comment, null, 2))
}
