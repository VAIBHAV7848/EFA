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

let hooksUseEval = "✅";
const hooksDir = path.join(repoRoot, 'hooks');
if (fs.existsSync(hooksDir)) {
  const walkSync = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) results = results.concat(walkSync(fullPath));
      else results.push(fullPath);
    });
    return results;
  };
  const hookFiles = walkSync(hooksDir);
  for (const file of hookFiles) {
    if (fs.readFileSync(file, 'utf-8').includes('eval(')) {
      hooksUseEval = "❌";
      break;
    }
  }
}

let mcpTokensHardcoded = "✅";
const mcpRegex = /(sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{20,}|AIza[a-zA-Z0-9]{20,}|Bearer\s+[a-zA-Z0-9\-_]{40,})/;
const mcpFiles = [];
if (fs.existsSync(path.join(repoRoot, '.mcp.json'))) mcpFiles.push(path.join(repoRoot, '.mcp.json'));
const mcpConfigsDir = path.join(repoRoot, 'mcp-configs');
if (fs.existsSync(mcpConfigsDir)) {
  fs.readdirSync(mcpConfigsDir).forEach(f => mcpFiles.push(path.join(mcpConfigsDir, f)));
}
for (const file of mcpFiles) {
  if (fs.statSync(file).isFile()) {
    const content = fs.readFileSync(file, 'utf-8');
    if (mcpRegex.test(content)) {
      mcpTokensHardcoded = "❌";
      break;
    }
  }
}

const gitignoreContent = fs.existsSync(path.join(repoRoot, '.gitignore')) ? fs.readFileSync(path.join(repoRoot, '.gitignore'), 'utf-8') : '';

const data = {
  agents: [],
  skills: [],
  commands: [],
  rules: [],
  shield: {
    claudeMdPresent: fs.existsSync(path.join(repoRoot, 'CLAUDE.md')) ? "✅" : "❌",
    hooksUseEval: hooksUseEval,
    mcpTokensHardcoded: mcpTokensHardcoded,
    memoryInGitignore: gitignoreContent.includes('.efa-vector-memory.json') ? "✅" : "❌",
    noSecretsInSkills: "✅"
  }
};

// TODO: might need to async this if we get way too many agents later, but it's fast enough for now
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
      const secretRegex = /api_key["']?\s*[:=]\s*["'](sk-|AIza|ghp_)[a-zA-Z0-9]{15,}["']/i;
      if (secretRegex.test(content)) {
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
