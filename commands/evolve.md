---
name: evolve
description: Triggers the EFA Evolution Engine to permanently rewrite its own SKILL.md brain files with newly learned lessons.
version: 1.0.0
---

# `/evolve` Command

**Usage:** `/evolve <skill-name> <lesson>`

When the user types `/evolve` (or when you independently fix a complex bug and learn a lesson), you must mathematically rewrite your own skill files so you never make that mistake again.

1. Ensure the target skill folder exists in `skills/`.
2. Run `node scripts/efa-evolution-engine.js <skill-name> "<your detailed lesson>"`
3. Present the user with a confirmation that EFA has successfully evolved its own structural brain.
