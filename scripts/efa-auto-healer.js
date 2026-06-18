#!/usr/bin/env node

/**
 * EFA Auto-Healer Execution Wrapper
 * This script runs a target command and catches any failures. 
 * If a failure occurs, it outputs a structured healing payload
 * for the EFA AI agent to automatically consume and repair the code.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const MAX_RETRIES = parseInt(process.env.EFA_HEAL_RETRIES || '3', 10);
const commandArgs = process.argv.slice(2);

if (commandArgs.length === 0) {
  console.error("Usage: node efa-auto-healer.js <command> [args...]");
  process.exit(1);
}

const commandStr = commandArgs.join(' ');
console.log(`\n[EFA God Mode] Initiating Auto-Healer for: ${commandStr}`);

function runCommand() {
  return new Promise((resolve, reject) => {
    let stdoutData = '';
    let stderrData = '';

    const child = spawn(commandArgs[0], commandArgs.slice(1), { 
      shell: true,
      stdio: ['inherit', 'pipe', 'pipe'] 
    });

    child.stdout.on('data', (data) => {
      process.stdout.write(data);
      stdoutData += data.toString();
    });

    child.stderr.on('data', (data) => {
      process.stderr.write(data);
      stderrData += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ code, stdoutData, stderrData });
      } else {
        reject({ code, stdoutData, stderrData });
      }
    });
  });
}

async function executeWithHealer() {
  const statePath = path.join(process.cwd(), '.efa-heal-state.json');
  let state = { attempts: 0 };
  
  if (fs.existsSync(statePath)) {
    state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
  }

  if (state.attempts >= MAX_RETRIES) {
    console.error(`\n[EFA God Mode] Max retries (${MAX_RETRIES}) reached. Auto-heal aborted.`);
    fs.unlinkSync(statePath);
    process.exit(1);
  }

  state.attempts++;
  fs.writeFileSync(statePath, JSON.stringify(state));

  try {
    console.log(`\n--- Attempt ${state.attempts}/${MAX_RETRIES} ---`);
    await runCommand();
    console.log(`\n[EFA God Mode] ✅ Command succeeded. Healing complete or not required.`);
    if (fs.existsSync(statePath)) fs.unlinkSync(statePath);
    process.exit(0);
  } catch (error) {
    console.error(`\n[EFA God Mode] ❌ Command failed with exit code ${error.code}.`);
    
    // Construct the payload for the AI
    const healPayload = {
      action: "EFA_AUTO_HEAL_REQUEST",
      failedCommand: commandStr,
      attempt: state.attempts,
      maxRetries: MAX_RETRIES,
      errorLog: error.stderrData || error.stdoutData
    };

    console.log("\n================ EFA HEAL PAYLOAD ================\n");
    console.log(JSON.stringify(healPayload, null, 2));
    console.log("\n==================================================\n");
    
    console.log("[EFA AI INSTRUCTION]: Please consume the payload above, fix the codebase, and run `npm run efa:heal` again.");
    process.exit(error.code);
  }
}

executeWithHealer();
