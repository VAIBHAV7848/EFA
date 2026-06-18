---
name: swarm
description: Triggers the EFA Swarm Orchestrator to execute multiple agents in parallel.
version: 1.0.0
---

# `/swarm` Command

**Usage:** `/swarm <task description>`

When the user types `/swarm`, you must immediately invoke the `agent-swarm` skill.

1. Break the user's task into multiple independent shell commands or agent calls.
2. Execute them using the Node wrapper: `node scripts/efa-swarm-orchestrator.js "<cmd1>" "<cmd2>"`
3. Present the combined parallel output to the user.
