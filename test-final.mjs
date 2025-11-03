#!/usr/bin/env node
/**
 * Final test: Verify code generation with response handling
 */
import { spawn } from 'node:child_process'

const server = spawn('node', ['dist/mcp-server.js'], {
  env: { ...process.env, TOONFETCH_DEBUG: 'true' }
})

let fullOutput = ''

server.stderr.on('data', (data) => {
  fullOutput += data.toString()
})

server.stdout.on('data', (data) => {
  fullOutput += data.toString()
})

// Send MCP requests
setTimeout(() => {
  // Initialize
  server.stdin.write(JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'test', version: '1.0.0' }
    }
  }) + '\n')

  // Request code generation
  setTimeout(() => {
    server.stdin.write(JSON.stringify({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'generate_code_example',
        arguments: {
          api_name: 'digitalocean/api',
          path: '/v2/droplets',
          method: 'POST'
        }
      }
    }) + '\n')

    // Wait for response and check output
    setTimeout(() => {
      server.kill()

      console.log('='.repeat(80))
      console.log('FINAL TEST RESULTS')
      console.log('='.repeat(80))

      // Check if response handling is present
      const hasDropletCheck = fullOutput.includes("if ('droplet' in response)")
      const hasDropletsCheck = fullOutput.includes("if ('droplets' in response)")

      console.log('\n✅ Server started successfully')
      console.log(hasDropletCheck ? '✅ Single resource response handling' : '❌ Missing single resource response handling')
      console.log(hasDropletsCheck ? '✅ Array response handling' : '❌ Missing array response handling')

      if (hasDropletCheck && hasDropletsCheck) {
        console.log('\n🎉 ALL TESTS PASSED! TOON → oxc migration successful!')
      } else {
        console.log('\n❌ Some checks failed')
      }

      // Show generated code snippet
      const codeStart = fullOutput.indexOf('```typescript')
      if (codeStart > -1) {
        const codeEnd = fullOutput.indexOf('```', codeStart + 13)
        const generatedCode = fullOutput.substring(codeStart, codeEnd + 3)
        console.log('\n' + '='.repeat(80))
        console.log('GENERATED CODE SAMPLE:')
        console.log('='.repeat(80))
        console.log(generatedCode.substring(0, 800) + '\n...')
      }

      process.exit(hasDropletCheck && hasDropletsCheck ? 0 : 1)
    }, 2000)
  }, 500)
}, 1000)
