import { readdirSync, statSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { join, relative } from 'node:path'

/**
 * Automatically convert all JSON files in openapi-specs to TOON format
 */

function findJsonFiles(dir: string, files: string[] = []): string[] {
  const entries = readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      findJsonFiles(fullPath, files)
    }
    else if (entry.name.endsWith('.json')) {
      files.push(fullPath)
    }
  }

  return files
}

const specsDir = 'openapi-specs'
const jsonFiles = findJsonFiles(specsDir)

if (jsonFiles.length === 0) {
  console.log('No JSON files found in openapi-specs')
  process.exit(0)
}

console.log(`📦 Converting ${jsonFiles.length} JSON file(s) to TOON format...\n`)

let totalSaved = 0

for (const jsonPath of jsonFiles) {
  const toonPath = jsonPath.replace('.json', '.toon')
  const relativePath = relative(process.cwd(), jsonPath)

  try {
    // Run the CLI conversion with stats
    const output = execSync(
      `npx @toon-format/cli "${jsonPath}" --stats -o "${toonPath}"`,
      { encoding: 'utf-8' },
    )

    console.log(`✓ ${relativePath}`)

    // Extract token savings from output
    const match = output.match(/Saved ~(\d+) tokens/)
    if (match) {
      const saved = Number.parseInt(match[1], 10)
      totalSaved += saved
      console.log(`  ${output.split('\n').filter((l: string) => l.includes('Token')).join('\n  ')}`)
    }

    console.log()
  }
  catch (error) {
    console.error(`✗ Failed to convert ${relativePath}:`, error)
  }
}

console.log(`✅ Conversion complete! Total tokens saved: ~${totalSaved.toLocaleString()}`)
