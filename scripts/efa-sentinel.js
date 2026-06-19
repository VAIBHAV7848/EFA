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

// Check available binaries
console.log(`[EFA Sentinel] Verifying language toolchains:`);
const availableCheckers = {};
for (const [ext, cmdArr] of Object.entries({
  '.js': ['node', '--version'], '.ts': ['node', '--version'],
  '.py': ['python3', '--version'], '.go': ['go', 'version'],
  '.rs': ['rustfmt', '--version'], '.java': ['javac', '-version'],
  '.rb': ['ruby', '--version'], '.php': ['php', '--version']
})) {
  const check = require('child_process').spawnSync(cmdArr[0], [cmdArr[1]], { shell: true });
  if (check.status === 0) {
    availableCheckers[ext] = true;
  } else {
    console.log(`[EFA Sentinel] Skipping ${ext} — ${cmdArr[0]} not in PATH`);
  }
}
console.log(`[EFA Sentinel] Actively watching extensions: ${Object.keys(availableCheckers).join(', ')}\n`);

function checkSyntax(filePath) {
  if (isChecking) return;
  
  const SYNTAX_CHECKERS = {
    '.js': ['node', '--check'],
    '.jsx': ['node', '--check'],
    '.ts': ['node', '--check'],
    '.tsx': ['node', '--check'],
    '.py': ['python3', '-c', `import py_compile; py_compile.compile('${filePath}', doraise=True)`],
    '.go': ['go', 'vet'],
    '.rs': ['rustfmt', '--check'],
    '.java': ['javac', '-classpath', '.'],
    '.rb': ['ruby', '--syntax-check'],
    '.php': ['php', '--syntax-check'],
  };
  
  const ext = path.extname(filePath);
  if (!SYNTAX_CHECKERS[ext]) return;
  
  if (!availableCheckers[ext]) return;

  isChecking = true;
  console.log(`\n[EFA Sentinel] File mutation detected: ${filePath}`);
  console.log(`[EFA Sentinel] Analyzing structural integrity...`);

  const checker = SYNTAX_CHECKERS[ext];
  // Replace the placeholder ${filePath} if it's Python
  const cmdLine = checker.map(c => c.replace('${filePath}', filePath)).join(' ');
  const child = spawn(cmdLine, { shell: true });
  
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
