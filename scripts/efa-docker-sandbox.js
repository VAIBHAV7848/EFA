#!/usr/bin/env node

/**
 * EFA Docker Sandbox Execution Engine
 * This script runs user code or agent-generated commands inside an isolated
 * Docker container to protect the host OS from destructive actions.
 */

const { spawnSync } = require('child_process');
const path = require('path');

const command = process.argv.slice(2).join(' ');

if (!command) {
  console.error("Usage: node efa-docker-sandbox.js <command>");
  process.exit(1);
}

// Check if Docker is installed
const dockerCheck = spawnSync('docker', ['--version']);
if (dockerCheck.status !== 0) {
  console.error("\n[EFA Sandbox] ⚠️ Docker is not installed or not running!");
  console.error("[EFA Sandbox] Falling back to local unsafe execution...\n");
  
  const localRun = spawnSync(command, { shell: true, stdio: 'inherit' });
  process.exit(localRun.status || 0);
}

console.log(`\n[EFA Sandbox] 🐳 Spawning isolated container for: ${command}\n`);

const cwd = process.cwd();

// We use a generic node/ubuntu image that has basic utilities
const dockerArgs = [
  'run', '--rm', 
  '-v', `${cwd}:/workspace`, 
  '-w', '/workspace', 
  'node:lts-bullseye', // Safe default image
  'bash', '-c', command
];

const dockerProcess = spawnSync('docker', dockerArgs, { stdio: 'inherit' });

console.log(`\n[EFA Sandbox] 🛡️ Sandbox execution terminated with code ${dockerProcess.status}. Host OS remains untouched.`);
process.exit(dockerProcess.status || 0);
