#!/usr/bin/env node
import { spawn } from 'node:child_process'

const server = spawn('node', ['dist/mcp-server.js'], {
  env: { ...process.env, TOONFETCH_DEBUG: 'true' }
})

let output = ''

server.stderr.on('data', (data) => {
  const text = data.toString()
  output += text
  console.log('STDERR:', text)
})

server.stdout.on('data', (data) => {
  console.log('STDOUT:', data.toString())
})

// Kill after 3 seconds
setTimeout(() => {
  server.kill()
  console.log('\n✅ Server started successfully, captured output:')
  console.log(output)
  process.exit(0)
}, 3000)
