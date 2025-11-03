#!/usr/bin/env node
import { spawn } from 'node:child_process'

const server = spawn('node', ['dist/mcp-server.js'], {
  stdio: ['pipe', 'pipe', 'ignore'],
  env: { ...process.env, TOONFETCH_DEBUG: 'false' },
})

let buffer = ''

server.stdout.on('data', (data) => {
  buffer += data.toString()

  // Look for the code example in the response
  const lines = buffer.split('\n')
  for (const line of lines) {
    if (line.trim().startsWith('{')) {
      try {
        const response = JSON.parse(line)
        if (response.result?.usage_example?.code) {
          console.log('📝 Generated Code Example with Type Hints:\n')
          console.log(response.result.usage_example.code)
          console.log('')
          server.kill()
          process.exit(0)
        }
      }
      catch (e) {
        // Not valid JSON
      }
    }
  }
})

// Send initialize
setTimeout(() => {
  server.stdin.write(`${JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'test-client', version: '1.0.0' },
    },
  })}\n`)
}, 100)

// Get endpoint details for Hetzner Cloud /servers POST
setTimeout(() => {
  server.stdin.write(`${JSON.stringify({
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'get_endpoint_details',
      arguments: {
        api_name: 'hetzner/cloud',
        path: '/servers',
        method: 'POST',
      },
    },
  })}\n`)
}, 500)

// Timeout
setTimeout(() => {
  console.error('⏱️  Timeout!')
  server.kill()
  process.exit(1)
}, 5000)
