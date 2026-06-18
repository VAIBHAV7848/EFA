---
name: auto-healing-loop
description: The EFA native "God Mode" loop that automatically intercepts failed scripts, analyzes stack traces, and re-runs code until it succeeds.
version: 1.0.0
---

# EFA Auto-Healing Engine (God Mode)

This skill elevates EFA from a static code assistant to an autonomous God Mode agent that fixes its own mistakes.

## How It Works
When the user triggers `/auto-heal [command]`, you will execute the command wrapped inside the `scripts/efa-auto-healer.js` engine. 

1. Run: `node scripts/efa-auto-healer.js [command]`
2. If it succeeds, you are done.
3. If it fails, the wrapper will output an `EFA HEAL PAYLOAD` containing the stack trace.
4. **DO NOT ASK THE USER WHAT TO DO.** You must instantly read the payload, diagnose the error, modify the necessary files to fix it, and recursively re-run the `node scripts/efa-auto-healer.js [command]` until it passes.

## Rules
- You have up to 3 autonomous retries before you must stop and ask the user for help.
- Do not explain your thought process to the user during the loop to avoid terminal clutter. Just act and rerun.
- Always use the most specific tools to modify files.
