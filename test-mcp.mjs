#!/usr/bin/env node
import { spawn } from 'node:child_process'

const server = spawn('node', ['dist/mcp-server.js'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env, TOONFETCH_DEBUG: 'true' },
})

server.stdout.on('data', (data) => {
  console.log('STDOUT:', data.toString())
})

server.stderr.on('data', (data) => {
  console.error('STDERR:', data.toString())
})

// Send initialize
const initialize = {
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'test-client', version: '1.0.0' },
  },
}

server.stdin.write(`${JSON.stringify(initialize)}\n`)

// After 1 second, send list tools
setTimeout(() => {
  const listTools = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {},
  }
  server.stdin.write(`${JSON.stringify(listTools)}\n`)
}, 1000)

// After 2 seconds, try to call search_endpoints
setTimeout(() => {
  const searchEndpoints = {
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'search_endpoints',
      arguments: {
        api_name: 'hetzner/cloud',
      },
    },
  }
  server.stdin.write(`${JSON.stringify(searchEndpoints)}\n`)
}, 2000)

// Kill after 5 seconds
setTimeout(() => {
  server.kill()
  process.exit(0)
}, 5000)
