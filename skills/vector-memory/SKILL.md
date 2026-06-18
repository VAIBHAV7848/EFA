---
name: vector-memory
description: Grants EFA the ability to store and recall long-term persistent memory across projects.
version: 1.0.0
---

# EFA Vector Memory Engine

This skill gives you **Infinite Context**. You can store architectural decisions, API keys formats, and past bugs into a local semantic index, and recall them anytime without bloating your system prompt.

## How to Store Memory
When you learn a valuable rule or make a core architectural decision, store it immediately:
`node scripts/efa-memory-engine.js store "react, architecture, rules" "All React components must use inline CSS glassmorphism."`

## How to Recall Memory
When working on a file, if you are unsure about the project rules or need context on past bugs, recall it:
`node scripts/efa-memory-engine.js recall "react, rules"`

You must actively use this memory system to maintain consistency across the codebase.
