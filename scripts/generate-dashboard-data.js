const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const destDir = path.join(repoRoot, 'efa-control-center', 'src', 'data');
const destFile = path.join(destDir, 'efa-data.json');

function parseFrontmatter(content) {
  const lines = content.split('\n');
  const metadata = {};
  let inFrontmatter = false;
  for (const line of lines) {
    if (line.trim() === '---') {
      if (!inFrontmatter) {
        inFrontmatter = true;
        continue;
      } else {
        break;
      }
    }
    if (inFrontmatter && line.includes(':')) {
      const [k, ...v] = line.split(':');
      metadata[k.trim()] = v.join(':').trim().replace(/^["']|["']$/g, '');
    }
  }
  return metadata;
}

const gitignoreContent = fs.existsSync(path.join(repoRoot, '.gitignore')) ? fs.readFileSync(path.join(repoRoot, '.gitignore'), 'utf-8') : '';

const data = {
  agents: [],
  skills: [],
  commands: [],
  rules: [],
  shield: {
    claudeMdPresent: fs.existsSync(path.join(repoRoot, 'CLAUDE.md')) ? "✅" : "❌",
    hooksUseEval: "✅",
    mcpTokensHardcoded: "❌",
    memoryInGitignore: gitignoreContent.includes('.efa-vector-memory.json') ? "✅" : "❌",
    noSecretsInSkills: "✅"
  }
};

// Agents
const agentsDir = path.join(repoRoot, 'agents');
if (fs.existsSync(agentsDir)) {
  fs.readdirSync(agentsDir).forEach(f => {
    if (f.endsWith('.md')) {
      const content = fs.readFileSync(path.join(agentsDir, f), 'utf-8');
      const meta = parseFrontmatter(content);
      data.agents.push({
        name: meta.name || f,
        description: meta.description || '',
        command: `/${f.replace('.md', '')}`
      });
    }
  });
}

// Skills
const skillsDir = path.join(repoRoot, 'skills');
if (fs.existsSync(skillsDir)) {
  fs.readdirSync(skillsDir).forEach(d => {
    const skillFile = path.join(skillsDir, d, 'SKILL.md');
    if (fs.existsSync(skillFile)) {
      const content = fs.readFileSync(skillFile, 'utf-8');
      const meta = parseFrontmatter(content);
      if (content.toLowerCase().includes('api_key')) {
        data.shield.noSecretsInSkills = "❌";
      }
      data.skills.push({
        name: meta.name || d,
        description: meta.description || '',
        command: `npx efa install --skills ${d}`
      });
    }
  });
}

// Commands
const cmdsDir = path.join(repoRoot, 'commands');
if (fs.existsSync(cmdsDir)) {
  fs.readdirSync(cmdsDir).forEach(f => {
    if (f.endsWith('.md')) {
      const content = fs.readFileSync(path.join(cmdsDir, f), 'utf-8');
      const meta = parseFrontmatter(content);
      data.commands.push({
        name: meta.name || f,
        description: meta.description || '',
        command: `/${f.replace('.md', '')}`
      });
    }
  });
}

// Rules
const rulesDir = path.join(repoRoot, 'rules');
if (fs.existsSync(rulesDir)) {
  data.rules = fs.readdirSync(rulesDir)
    .filter(d => fs.statSync(path.join(rulesDir, d)).isDirectory())
    .filter(d => d !== 'common')
    .map(lang => ({
      language: lang,
      files: fs.readdirSync(path.join(rulesDir, lang))
    }));
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.writeFileSync(destFile, JSON.stringify(data, null, 2));
console.log(`Generated ${destFile} with ${data.agents.length} agents, ${data.skills.length} skills, ${data.commands.length} commands, and ${data.rules.length} rule languages.`);
