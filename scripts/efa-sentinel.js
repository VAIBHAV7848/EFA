#!/usr/bin/env node

/**
 * EFA Sentinel: Real-Time Background Watcher
 * This daemon runs continuously in the background. When any file is saved,
 * it instantly runs a syntax and structural check. If it detects a failure,
 * it triggers an EFA Auto-Heal Payload.
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const watchDir = process.cwd();
const IGNORE_DIRS = ['node_modules', '.git', 'dist', 'build', '.gemini', '.efa-heal-state.json'];

console.log(`\n[EFA Sentinel] 👁️  Initializing real-time file watcher on: ${watchDir}`);
console.log(`[EFA Sentinel] Sentinel is active. Watching for structural mutations...\n`);

let isChecking = false;

function checkSyntax(filePath) {
  if (isChecking) return;
  
  const ext = path.extname(filePath);
  if (!['.js', '.jsx', '.ts', '.tsx'].includes(ext)) return;
  
  isChecking = true;
  console.log(`\n[EFA Sentinel] File mutation detected: ${filePath}`);
  console.log(`[EFA Sentinel] Analyzing structural integrity...`);

  // Basic syntax check using Node.js built-in AST compilation test
  const child = spawn('node', ['--check', filePath], { shell: true });
  
  let stderrData = '';
  
  child.stderr.on('data', (data) => {
    stderrData += data.toString();
  });

  child.on('close', (code) => {
    isChecking = false;
    if (code === 0) {
      console.log(`[EFA Sentinel] ✅ Integrity verified. Code is structurally sound.\n`);
    } else {
      console.error(`[EFA Sentinel] ❌ Syntax Error intercepted!`);
      
      const healPayload = {
        action: "EFA_AUTO_HEAL_REQUEST",
        failedCommand: `node --check ${filePath}`,
        attempt: 1,
        maxRetries: 3,
        errorLog: stderrData
      };

      console.log("\n================ EFA HEAL PAYLOAD ================\n");
      console.log(JSON.stringify(healPayload, null, 2));
      console.log("\n==================================================\n");
      console.log("[EFA AI INSTRUCTION]: Please consume the payload above, fix the codebase, and wait for the next Sentinel pulse.");
    }
  });
}

fs.watch(watchDir, { recursive: true }, (eventType, filename) => {
  if (!filename) return;
  
  // Ignore specified directories
  if (IGNORE_DIRS.some(dir => filename.includes(dir))) return;

  const fullPath = path.join(watchDir, filename);
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    checkSyntax(fullPath);
  }
});
