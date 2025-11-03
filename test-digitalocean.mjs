#!/usr/bin/env node
import { spawn } from 'node:child_process'

const server = spawn('node', ['dist/mcp-server.js'], {
  stdio: ['pipe', 'pipe', 'ignore'],
})

let fullOutput = ''

server.stdout.on('data', (data) => {
  fullOutput += data.toString()
})

server.on('close', () => {
  const lines = fullOutput.split('\n')
  for (const line of lines) {
    if (line.trim() && line.includes('usage_example')) {
      try {
        const jsonResponse = JSON.parse(line)
        if (jsonResponse.result?.content?.[0]?.text) {
          const parsed = JSON.parse(jsonResponse.result.content[0].text)
          if (parsed.usage_example?.code) {
            console.log('📝 DigitalOcean API Code Example:\n')
            console.log(parsed.usage_example.code)
          }
        }
      }
      catch (e) {
        // Skip
      }
    }
  }
  process.exit(0)
})

// Send requests
server.stdin.write(`${JSON.stringify({
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'test', version: '1.0.0' },
  },
})}\n`)

server.stdin.write(`${JSON.stringify({
  jsonrpc: '2.0',
  id: 2,
  method: 'tools/call',
  params: {
    name: 'get_endpoint_details',
    arguments: {
      api_name: 'digitalocean/api',
      path: '/v2/droplets',
      method: 'POST',
    },
  },
})}\n`)

server.stdin.end()
