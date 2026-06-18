/**
 * EFA Plugins for OpenCode
 *
 * This module exports all EFA plugins for OpenCode integration.
 * Plugins provide hook-based automation that mirrors Claude Code's hook system
 * while taking advantage of OpenCode's more sophisticated 20+ event types.
 */
export { ECCHooksPlugin, default } from "./efa-hooks.js";
// Re-export for named imports
export * from "./efa-hooks.js";
//# sourceMappingURL=index.js.map