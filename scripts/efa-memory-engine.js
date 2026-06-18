#!/usr/bin/env node

/**
 * EFA Vector Memory Engine (Lightweight Semantic JSON Store)
 * This engine allows EFA to store, tag, and recall persistent memory
 * across sessions without bloating the context window.
 */

const fs = require('fs');
const path = require('path');

const MEMORY_FILE = path.join(process.cwd(), '.efa-vector-memory.json');

// Initialize store if missing
if (!fs.existsSync(MEMORY_FILE)) {
  fs.writeFileSync(MEMORY_FILE, JSON.stringify({ index: [] }, null, 2));
}

function loadMemory() {
  return JSON.parse(fs.readFileSync(MEMORY_FILE, 'utf8'));
}

function saveMemory(data) {
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(data, null, 2));
}

const command = process.argv[2];
const args = process.argv.slice(3);

if (command === 'store') {
  const [tagsStr, ...contentArr] = args;
  const content = contentArr.join(' ');
  const tags = tagsStr.split(',').map(t => t.trim().toLowerCase());
  
  const memory = loadMemory();
  memory.index.push({
    id: Date.now().toString(),
    tags,
    content,
    timestamp: new Date().toISOString()
  });
  
  saveMemory(memory);
  console.log(`[EFA Memory] Successfully stored memory with tags: [${tags.join(', ')}]`);
} 
else if (command === 'recall') {
  const queryTags = args[0].split(',').map(t => t.trim().toLowerCase());
  const memory = loadMemory();
  
  // Simple TF-IDF / Jaccard similarity mock (match count)
  const results = memory.index.map(item => {
    const matchCount = queryTags.filter(tag => item.tags.includes(tag)).length;
    return { ...item, score: matchCount };
  })
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score);

  if (results.length === 0) {
    console.log(`[EFA Memory] No memories found for tags: [${queryTags.join(', ')}]`);
  } else {
    console.log(`\n================ EFA RECALLED MEMORY ================`);
    results.slice(0, 3).forEach(res => {
      console.log(`\n[Tags: ${res.tags.join(', ')}] (Score: ${res.score})`);
      console.log(`Data: ${res.content}`);
    });
    console.log(`\n======================================================\n`);
  }
} else {
  console.error("Usage:");
  console.error("  node efa-memory-engine.js store <tags,comma,separated> <content string>");
  console.error("  node efa-memory-engine.js recall <query,tags>");
}
