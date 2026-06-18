---
name: sandbox-execution
description: Grants EFA the ability to test complex, multi-language, or unsafe code in an isolated Docker container.
version: 1.0.0
---

# EFA Docker Sandbox Execution

This skill upgrades EFA's testing capabilities by providing an isolated containerized environment.

## How It Works
If you are writing highly destructive scripts (like `rm -rf`, file system mutations, or chaotic tests), you must not run them locally. 
Instead, wrap the execution in the EFA Sandbox. 

## Usage
`node scripts/efa-docker-sandbox.js "npm run test"`
`node scripts/efa-docker-sandbox.js "python3 unsafe_script.py"`

The script will mount the current directory into a temporary Docker container, run the command, and destroy the container afterward. This guarantees that your host environment is never compromised.
