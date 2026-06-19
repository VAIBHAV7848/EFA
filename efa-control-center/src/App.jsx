import React from 'react';
import './index.css';
import efaData from './data/efa-data.json';

const TerminalMockup = ({ code, lines }) => (
  <div className="terminal-window" style={{ maxWidth: '600px', margin: '0 auto' }}>
    <div className="terminal-header">
      <div className="terminal-dot" style={{ background: '#ef4444' }}></div>
      <div className="terminal-dot" style={{ background: '#eab308' }}></div>
      <div className="terminal-dot" style={{ background: '#22c55e' }}></div>
    </div>
    <div className="terminal-body">
      {code ? (
        <pre style={{ margin: 0 }}><code style={{ color: '#fbbf24' }}>$ {code}</code></pre>
      ) : (
        lines.map((l, i) => (
          <div key={i} style={{ color: l.color || 'inherit', marginBottom: '8px' }}>
            {l.text}
          </div>
        ))
      )}
    </div>
  </div>
);

function App() {
  const { agents, skills, rules, shield } = efaData;

  const shieldChecks = [
    { q: "Is CLAUDE.md present?", a: shield.claudeMdPresent },
    { q: "Are hooks using eval()?", a: shield.hooksUseEval },
    { q: "Are MCP tokens hardcoded?", a: shield.mcpTokensHardcoded },
    { q: "Does .gitignore cover memory file?", a: shield.memoryInGitignore },
    { q: "No secrets in skills?", a: shield.noSecretsInSkills }
  ];

  return (
    <div>
      {/* Sticky Navigation */}
      <nav className="sticky-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: 'var(--accent-color)', fontWeight: 700, fontSize: '1.2rem' }}>EFA</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Open Agent Harness System</div>
        </div>
        <div className="nav-links">
          <a href="#skills" className="nav-link">Skills & Agents</a>
          <a href="#security" className="nav-link">Security</a>
          <a href="#rules" className="nav-link">Rules Engine</a>
          <a href="https://github.com/VAIBHAV7848/EFA" target="_blank" rel="noreferrer" className="nav-link">GitHub</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success-color)', boxShadow: '0 0 10px var(--success-color)' }}></div>
            <span style={{ fontSize: '0.85rem', color: 'var(--success-color)' }}>System Online</span>
          </div>
          <button className="premium-btn" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => window.open('https://github.com/VAIBHAV7848/EFA', '_blank')}>
            Install EFA
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '8rem 2rem', textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
        <h1 className="heading-hero">
          Skills, agents,<br/>
          <span className="text-gradient">and security</span><br/>
          for your coding agent.
        </h1>
        <p className="subheading" style={{ marginBottom: '3rem' }}>
          Pick a profile, install the skills and agents your team needs. AgentShield scans every session. The EFA app turns repo history into reusable defaults.
        </p>

        <TerminalMockup 
          lines={[
            { text: '$ efa --install', color: '#fbbf24' },
            { text: 'Fetching packages...', color: 'var(--text-muted)' },
            { text: `✓ ${agents.length} agents configured`, color: 'var(--success-color)' },
            { text: `✓ ${skills.length} skills loaded`, color: 'var(--success-color)' },
            { text: 'EFA v2.0.0 installed successfully!', color: 'var(--success-color)' }
          ]} 
        />

        <div style={{ marginTop: '3rem', display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button className="premium-btn" onClick={() => window.open('https://github.com/VAIBHAV7848/EFA', '_blank')}>
            Install GitHub App
          </button>
          <button className="secondary-btn" onClick={() => window.open('https://github.com/VAIBHAV7848/EFA/discussions', '_blank')}>
            Join Discussions
          </button>
        </div>
        <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Works across Claude Code, Cursor, and OpenCode. Fully Open Source.
        </p>
      </section>

      {/* Stats Row */}
      <section style={{ borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.4)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
          <div className="stat-box reveal-on-scroll">
            <div className="stat-number">{agents.length}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Agents</div>
          </div>
          <div className="stat-box reveal-on-scroll">
            <div className="stat-number">{rules.length}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security Rules</div>
          </div>
          <div className="stat-box reveal-on-scroll">
            <div className="stat-number">{skills.length}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Workflow Skills</div>
          </div>
          <div className="stat-box reveal-on-scroll">
            <div className="stat-number">2.6k+</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Passing Tests</div>
          </div>
        </div>
      </section>

      {/* The Three Layers */}
      <section style={{ padding: '8rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="section-marker">Three Layers</div>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>EFA is not one repo. It is a system with three layers.</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '4rem', fontSize: '1.1rem' }}>
          The repo drives distribution, AgentShield provides protection, and EFA Control Center is the operator layer that sits above individual harnesses.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="glass-panel interactive-card reveal-on-scroll" style={{ padding: '2.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '1rem' }}>DISTRIBUTION LAYER</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#fff' }}>Open-source harness toolkit</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)' }}>
              <li>✓ The repo stays MIT-licensed</li>
              <li>✓ Cross-harness coverage across Claude Code, Cursor, and OpenCode</li>
              <li>✓ Repo gravity and content distribution feed the rest of the system</li>
            </ul>
          </div>
          <div className="glass-panel interactive-card reveal-on-scroll" style={{ padding: '2.5rem', border: '1px solid rgba(249, 115, 22, 0.3)', background: 'rgba(234, 88, 12, 0.05)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-color)', letterSpacing: '0.1em', marginBottom: '1rem' }}>PROTECTION LAYER</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#fff' }}>AgentShield and policy</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)' }}>
              <li>✓ Protection lives beside distribution, not behind it</li>
              <li>✓ GitHub App automation for PR scanning and context review</li>
              <li>✓ Open-source scanner for auditable trust</li>
            </ul>
          </div>
          <div className="glass-panel interactive-card reveal-on-scroll" style={{ padding: '2.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '1rem' }}>CONTROL-PLANE LAYER</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#fff' }}>EFA Control operator surface</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)' }}>
              <li>✓ Local-first control plane for observability and orchestration</li>
              <li>✓ Session and task visibility across multiple harnesses</li>
              <li>✓ Shipped with the EFA 2.0.0 stable release</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Skills & Tools */}
      <section id="skills" style={{ padding: '6rem 2rem', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="section-marker">Skills & Tools</div>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Start with the skills and tools teams actually reuse</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '4rem', maxWidth: '800px', margin: '0 auto 4rem auto' }}>
            The GitHub App is the conversion surface, but these are the workflows that make the EFA ecosystem sticky. Battle-tested skills, agents, security tools, and automation helpers you can adopt in minutes.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
            {agents.slice(0, 2).map((item, i) => (
              <div key={`agent-${i}`} className="glass-panel interactive-card reveal-on-scroll" style={{ padding: '24px' }}>
                <span style={{ display: 'inline-block', padding: '4px 10px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Agent</span>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>{item.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>{item.description}</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
                  <code style={{ color: 'var(--accent-color)' }}>{item.command}</code>
                </div>
              </div>
            ))}
            {skills.slice(0, 4).map((item, i) => (
              <div key={`skill-${i}`} className="glass-panel interactive-card reveal-on-scroll" style={{ padding: '24px' }}>
                <span style={{ display: 'inline-block', padding: '4px 10px', background: 'rgba(234, 88, 12, 0.1)', color: 'var(--accent-color)', border: '1px solid rgba(234, 88, 12, 0.2)', borderRadius: '4px', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Skill</span>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>{item.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>{item.description}</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
                  <code style={{ color: 'var(--accent-color)' }}>{item.command}</code>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button className="secondary-btn" onClick={() => window.open('https://github.com/VAIBHAV7848/EFA', '_blank')}>
              Explore {skills.length} Skills & {agents.length} Agents
            </button>
          </div>
        </div>
      </section>

      {/* AgentShield */}
      <section id="security" style={{ padding: '8rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div className="section-marker">AgentShield</div>
        <div className="glass-panel reveal-on-scroll" style={{ border: '1px solid rgba(16, 185, 129, 0.3)', overflow: 'hidden' }}>
          <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#10b981' }}>🛡️</div>
            <div>
              <h3 style={{ fontSize: '1.5rem' }}>AgentShield</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Open-source security reviewer for AI agent configs. Use it locally, or as the foundation for enterprise reporting.</p>
            </div>
          </div>
          <div style={{ padding: '2rem', background: '#000', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <div style={{ color: '#10b981', marginBottom: '1rem' }}>$ npx efa-agentshield scan ./CLAUDE.md</div>
            {shieldChecks.map((check, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px dashed rgba(255,255,255,0.1)' }}>
                <span>{check.q}</span>
                <span style={{ color: check.a === '✅' ? '#10b981' : '#ef4444' }}>{check.a === '✅' ? 'PASS' : 'FAIL'}</span>
              </div>
            ))}
            <div style={{ marginTop: '1.5rem', color: '#10b981' }}>
              Security Score: {Math.round((shieldChecks.filter(c => c.a === '✅').length / shieldChecks.length) * 100)}%
            </div>
          </div>
        </div>
      </section>

      {/* Rules Engine */}
      <section id="rules" style={{ padding: '6rem 2rem', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="section-marker">Rules Ecosystem</div>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '4rem', letterSpacing: '-0.02em' }}>The OS layer that makes the GitHub App sticky</h2>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
            {rules.map((rule, i) => (
              <div key={i} className="glass-panel interactive-card reveal-on-scroll" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigator.clipboard.writeText(`efa --rule ${rule.language}`)}>
                <span style={{ color: 'var(--accent-color)' }}>🌐</span>
                <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{rule.language}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '10px' }}>{rule.files.length}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '4rem 2rem', textAlign: 'center', borderTop: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <p style={{ marginBottom: '1rem' }}>Built by <strong>VAIBHAV7848</strong>. Open source under MIT license.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <a href="https://github.com/VAIBHAV7848/EFA" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>GitHub</a>
          <span>•</span>
          <a href="https://github.com/VAIBHAV7848/EFA/discussions" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Discussions</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
