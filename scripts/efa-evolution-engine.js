#!/usr/bin/env node

/**
 * EFA Evolution Engine (Self-Modifying Core)
 * This script allows EFA to permanently rewrite its own SKILL.md files 
 * when it learns a new coding pattern, fixing past mistakes autonomously.
 */

const fs = require('fs');
const path = require('path');

const [skillName, ...lessonParts] = process.argv.slice(2);
const lesson = lessonParts.join(' ');

if (!skillName || !lesson) {
  console.error("Usage: node efa-evolution-engine.js <skill-folder-name> \"<new-rule-to-learn>\"");
  process.exit(1);
}

const skillPath = path.join(process.cwd(), 'skills', skillName, 'SKILL.md');

if (!fs.existsSync(skillPath)) {
  console.error(`[EFA Evolution Engine] ❌ Target skill not found: ${skillPath}`);
  console.error(`[EFA Evolution Engine] Use the generic memory engine instead if no specific skill exists.`);
  process.exit(1);
}

console.log(`\n[EFA Evolution Engine] 🧬 Initiating Self-Modification Protocol...`);
console.log(`[EFA Evolution Engine] Target Brain Area: ${skillName}`);
console.log(`[EFA Evolution Engine] Uploading new neural pathway: "${lesson}"`);

let fileContent = fs.readFileSync(skillPath, 'utf8');

const evolutionTag = "\n\n## 🧬 Evolutionary Memory (Self-Learned Rules)\n";

if (!fileContent.includes("## 🧬 Evolutionary Memory")) {
  fileContent += evolutionTag;
}

const timestamp = new Date().toISOString().split('T')[0];
fileContent += `- **[Learned ${timestamp}]:** ${lesson}\n`;

fs.writeFileSync(skillPath, fileContent);

console.log(`\n[EFA Evolution Engine] ✅ Modification Complete. EFA has officially evolved and will never forget this pattern.\n`);
