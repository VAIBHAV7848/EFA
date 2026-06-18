/**
 * EFA Plugin for OpenCode
 *
 * This package provides the published EFA OpenCode plugin module:
 * - Plugin hooks (auto-format, TypeScript check, console.log warning, env injection, etc.)
 * - Custom tools (run-tests, check-coverage, security-audit, format-code, lint-check, git-summary)
 * - Bundled reference config/assets for the wider EFA OpenCode setup
 *
 * Usage:
 *
 * Option 1: Install via npm
 * ```bash
 * npm install efa-universal
 * ```
 *
 * Then add to your opencode.json:
 * ```json
 * {
 *   "plugin": ["efa-universal"]
 * }
 * ```
 *
 * That enables the published plugin module only. For EFA commands, agents,
 * prompts, and instructions, use this repository's `.opencode/opencode.json`
 * as a base or copy the bundled `.opencode/` assets into your project.
 *
 * Option 2: Clone and use directly
 * ```bash
 * git clone https://github.com/VAIBHAV7848/EFA
 * cd EFA
 * opencode
 * ```
 *
 * @packageDocumentation
 */
export { ECCHooksPlugin, default } from "./plugins/index.js";
export * from "./plugins/index.js";
export declare const VERSION = "1.6.0";
export declare const metadata: {
    name: string;
    version: string;
    description: string;
    author: string;
    features: {
        agents: number;
        commands: number;
        skills: number;
        configAssets: boolean;
        hookEvents: string[];
        customTools: string[];
    };
};
//# sourceMappingURL=index.d.ts.map