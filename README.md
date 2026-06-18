# EFA — Everything For Ai

**The harness-native operator system for agentic work. Built from real-world multi-harness engineering workflows.**

[![Stars](https://img.shields.io/github/stars/VAIBHAV7848/EFA?style=flat&color=3178C6)](https://github.com/VAIBHAV7848/EFA/stargazers)
[![Forks](https://img.shields.io/github/forks/VAIBHAV7848/EFA?style=flat&color=4EAA25)](https://github.com/VAIBHAV7848/EFA/network/members)
[![Contributors](https://img.shields.io/github/contributors/VAIBHAV7848/EFA?style=flat&color=00ADD8)](https://github.com/VAIBHAV7848/EFA/graphs/contributors)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Shell](https://img.shields.io/badge/-Shell-4EAA25?logo=gnu-bash&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/-Python-3776AB?logo=python&logoColor=white)
![Go](https://img.shields.io/badge/-Go-00ADD8?logo=go&logoColor=white)
![Markdown](https://img.shields.io/badge/-Markdown-000000?logo=markdown&logoColor=white)

> [!WARNING]
> **Official sources only.** Install EFA only from verified channels: the GitHub repository [github.com/VAIBHAV7848/EFA](https://github.com/VAIBHAV7848/EFA) and your local configuration environment. Unofficial mirrors are not reviewed and may contain outdated logic.

Not just configs. EFA is a complete framework for **all AI coding agents**: providing unified skills, instincts, memory persistence, continuous learning, security scanning, and research-first development. EFA contains production-ready agents, skills, hooks, rules, and configurations compatible with any modern AI agent harness.

Works natively across **Claude Code**, **Cursor**, **Codex**, **OpenCode**, **Gemini**, **Zed**, **GitHub Copilot**, **Qwen**, and other AI agent environments.

---

## 📖 The Guides

This repository contains the raw framework assets. Explore the guides below to get started:

| Guide Name | Target Audience | Key Takeaway |
| :--- | :--- | :--- |
| [**The Shorthand Guide**](./docs/the-shortform-guide.md) | Setup, foundations, philosophy. | **Read this first** to understand how EFA configures hooks and commands. |
| [**The Longform Guide**](./docs/the-longform-guide.md) | Token optimization, memory persistence, evals. | Learn how to optimize context window budgets and persist state across sessions. |
| [**The Security Guide**](./docs/the-security-guide.md) | Attack vectors, sandboxing, AgentShield. | Keep your environment secure and analyze vulnerability vectors. |

---

## 🚀 Quick Start

Get up and running in under 2 minutes:

### 1. Low-Context / No-Hooks Path
If hooks feel too global or you only want EFA's rules, agents, commands, and core workflow skills, use the minimal manual profile:

```bash
./install.sh --profile minimal --target claude
```

### 2. Manual Installation
Clone this repository to install custom agent tools manually:

```bash
git clone https://github.com/VAIBHAV7848/EFA.git
cd EFA
npm install
./install.sh --profile full
```

### 3. Start Using Commands
Once installed, trigger rebranding commands directly inside your agent console:

```text
/plan "Add user authentication"
/efa-guide
/security-scan
```

---

## 🛠️ Repository Architecture

EFA is structured modularly so you can import and install only the workflows you need:

```text
EFA/
├── hooks/            # Memory-persistence and tool-monitoring hooks
├── mcp/              # Custom Model Context Protocol (MCP) server definitions
├── rules/            # Custom system prompt rules (Common, TypeScript, Python, etc.)
├── skills/           # Reusable skills and playbooks for development and operations
│   ├── configure-efa/    # Guided EFA installer wizard
│   ├── terminal-ops/     # Robust CLI terminal execution playbooks
│   └── tdd-workflow/     # TDD execution guide
└── workflows/        # Markdown-based slash command definitions (e.g. /plan, /review)
```

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
