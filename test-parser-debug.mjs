#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { parseSync } from 'oxc-parser'

const typesFile = './openapi-specs/hetzner/types.d.ts'
const content = readFileSync(typesFile, 'utf-8')

const result = parseSync(typesFile, content)

console.log('Parse errors:', result.errors.length)
console.log('Comments:', result.comments?.length || 0)

// Check if comments are available
if (result.comments && result.comments.length > 0) {
  console.log('\n🔍 First few comments:')
  for (const comment of result.comments.slice(0, 3)) {
    console.log('Comment type:', comment.type)
    console.log('Comment value:', comment.value.substring(0, 100))
    console.log('---')
  }
}

// Look at module structure
for (const statement of result.program.body) {
  if (statement.type === 'TSModuleDeclaration') {
    console.log('\n📦 Found module:', statement.id?.value)

    if (statement.body?.body) {
      for (const moduleStatement of statement.body.body) {
        if (moduleStatement.type === 'ExportNamedDeclaration') {
          const decl = moduleStatement.declaration
          if (decl?.type === 'TSTypeAliasDeclaration') {
            console.log('\n🔹 Type alias:', decl.id?.name)
            console.log('  Has leadingComments:', !!decl.leadingComments)
            console.log('  Leading comments count:', decl.leadingComments?.length || 0)

            if (decl.leadingComments && decl.leadingComments.length > 0) {
              console.log('  First comment:', decl.leadingComments[0].value.substring(0, 100))
            }
          }
        }
      }
    }
  }
}
