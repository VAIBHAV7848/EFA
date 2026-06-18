---
name: agent-swarm
description: The EFA true parallelism orchestrator for spawning multiple sub-agents simultaneously.
version: 1.0.0
---

# EFA Agent Swarm

This skill upgrades EFA from sequential execution to parallel Swarm Execution.

## How It Works
When the user triggers `/swarm [task]`, you must break the task down into 2 or 3 independent sub-tasks (e.g. backend, frontend, security).
Instead of executing them one by one, use the `scripts/efa-swarm-orchestrator.js` to execute them simultaneously in the background.

## Usage
`node scripts/efa-swarm-orchestrator.js "echo 'Agent 1 doing frontend'" "echo 'Agent 2 doing backend'"`

Replace the `echo` commands with actual CLI tasks, scripts, or local agent invocations. Wait for the orchestrator to return the combined outputs, and then summarize the results for the user.
