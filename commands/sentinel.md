---
name: sentinel
description: Triggers the EFA Sentinel to watch the filesystem and auto-heal errors in real-time.
version: 1.0.0
---

# `/sentinel` Command

**Usage:** `/sentinel`

When the user types `/sentinel`, you must start the daemon in the background using the task system.

1. Ensure `scripts/efa-sentinel.js` exists.
2. Run `node scripts/efa-sentinel.js` as an asynchronous background task.
3. Inform the user that **EFA Sentinel** is now active and watching their codebase.
4. If the Sentinel detects an error and emits an `EFA HEAL PAYLOAD`, you must autonomously intercept it, fix the file, and inform the user you have healed their code.
