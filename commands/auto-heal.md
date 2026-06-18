---
name: auto-heal
description: Triggers the EFA God Mode execution loop for a command.
version: 1.0.0
---

# `/auto-heal` Command

**Usage:** `/auto-heal <your-build-or-test-command>`

When the user types `/auto-heal`, you must immediately invoke the `auto-healing-loop` skill.

1. Ensure `scripts/efa-auto-healer.js` exists.
2. Tell the user you are entering **EFA God Mode**.
3. Execute the target command through the healer wrapper: `node scripts/efa-auto-healer.js <your-build-or-test-command>`
4. Continuously fix and rerun autonomously if you detect an `EFA HEAL PAYLOAD` in the output.
