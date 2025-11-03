#!/usr/bin/env node
import { spawn } from 'node:child_process'

const server = spawn('node', ['dist/mcp-server.js'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env, TOONFETCH_DEBUG: 'false' },
})

let responseCount = 0

server.stdout.on('data', (data) => {
  responseCount++

  if (responseCount === 3) {
    // Parse the get_endpoint_details response
    try {
      const response = JSON.parse(data.toString())
      if (response.result?.usage_example?.code) {
        console.log('\n📝 Generated Code Example:\n')
        console.log(response.result.usage_example.code)
        console.log('\n')
        server.kill()
        process.exit(0)
      }
    }
    catch (e) {
      // Not JSON, skip
    }
  }
})

server.stderr.on('data', (data) => {
  // Ignore stderr
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

// Kill after 3 seconds
setTimeout(() => {
  console.error('Timeout!')
  server.kill()
  process.exit(1)
}, 3000)
