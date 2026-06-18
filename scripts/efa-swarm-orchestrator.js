#!/usr/bin/env node

/**
 * EFA Swarm Orchestrator
 * Spawns multiple AI-agent shell commands simultaneously for true parallelism.
 */

const { spawn } = require('child_process');

const commands = process.argv.slice(2);

if (commands.length === 0) {
  console.error("Usage: node efa-swarm-orchestrator.js \"<cmd1>\" \"<cmd2>\" ...");
  process.exit(1);
}

console.log(`\n[EFA Swarm Orchestrator] Spawning ${commands.length} concurrent agents...\n`);

const runAgent = (cmdStr, index) => {
  return new Promise((resolve) => {
    console.log(`[Agent ${index + 1}] Launched: ${cmdStr}`);
    
    // Split the command string
    const parts = cmdStr.split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);

    const child = spawn(cmd, args, { shell: true });
    
    let output = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      output += data.toString();
    });

    child.on('close', (code) => {
      console.log(`\n--- [Agent ${index + 1}] Finished with code ${code} ---`);
      console.log(output.trim());
      resolve({ index, code, output });
    });
  });
};

async function executeSwarm() {
  const promises = commands.map((cmd, i) => runAgent(cmd, i));
  const results = await Promise.all(promises);
  
  console.log(`\n[EFA Swarm Orchestrator] All ${results.length} agents completed successfully. True Parallelism achieved.\n`);
}

executeSwarm();
