#!/usr/bin/env node
import { McpClient } from '@modelcontextprotocol/sdk/client/mcp.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

const client = new McpClient({
  name: 'test-client',
  version: '1.0.0'
}, {
  capabilities: {}
})

const transport = new StdioClientTransport({
  command: 'node',
  args: ['dist/mcp-server.js']
})

await client.connect(transport)

console.log('🔌 Connected to MCP server\n')

// Call generate_code_example for DigitalOcean POST /v2/droplets
console.log('📝 Generating code for: POST /v2/droplets\n')

const result = await client.callTool({
  name: 'generate_code_example',
  arguments: {
    api_name: 'digitalocean/api',
    path: '/v2/droplets',
    method: 'POST'
  }
})

if (result.content && result.content[0]?.text) {
  const text = result.content[0].text
  console.log('Generated Code:')
  console.log('================')
  console.log(text)
}

await client.close()
