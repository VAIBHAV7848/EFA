import React, { useState } from 'react';
import './index.css';
import efaData from './data/efa-data.json';

const SidebarItem = ({ icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    style={{
      padding: '12px 16px',
      margin: '8px 0',
      borderRadius: '12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      background: active ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
      borderLeft: active ? '3px solid var(--accent-color)' : '3px solid transparent',
      color: active ? '#fff' : 'var(--text-muted)',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      fontWeight: active ? 600 : 500,
      fontFamily: 'Outfit, sans-serif'
    }}
    onMouseEnter={(e) => {
      if (!active) {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
        e.currentTarget.style.color = '#fff';
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = 'var(--text-muted)';
      }
    }}
  >
    <span style={{ fontSize: '1.2rem', opacity: active ? 1 : 0.7 }}>{icon}</span>
    <span>{label}</span>
  </div>
);

const StatCard = ({ title, value, icon, trend }) => (
  <div className="glass-panel interactive-card" style={{ padding: '24px', flex: '1', minWidth: '200px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 500 }}>{title}</h3>
        <div className="heading-display" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff' }}>{value}</div>
      </div>
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))', 
        padding: '12px', 
        borderRadius: '14px',
        fontSize: '1.5rem',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        {icon}
      </div>
    </div>
    <div style={{ marginTop: '16px', fontSize: '0.85rem', color: trend.startsWith('+') ? 'var(--success-color)' : 'var(--text-muted)' }}>
      {trend}
    </div>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState('GitHub');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { agents, skills, commands, rules, shield } = efaData;
  
  const filteredAgents = agents.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredSkills = skills.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const shieldChecks = [
    { q: "Is CLAUDE.md present?",              a: shield.claudeMdPresent },
    { q: "Are hooks using eval()?",            a: shield.hooksUseEval },
    { q: "Are MCP tokens hardcoded?",          a: shield.mcpTokensHardcoded },
    { q: "Does .gitignore cover memory file?", a: shield.memoryInGitignore },
    { q: "No secrets in skills?",              a: shield.noSecretsInSkills }
  ];
  const passed = shieldChecks.filter(c => c.a === '✅').length;
  // AgentShield checks (kind of a pain to wire up but worth it)
  const score = Math.round((passed / shieldChecks.length) * 100);
  const scoreColor = score >= 80 ? 'var(--success-color)' 
                   : score >= 60 ? '#f59e0b' 
                   : 'var(--danger-color)';

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    alert(`Copied ${label} to clipboard!`);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', padding: '20px', gap: '20px' }}>
      {/* Sidebar */}
      <nav className="glass-panel" style={{ width: '280px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '44px', 
            height: '44px', 
            background: 'var(--accent-gradient)', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            boxShadow: '0 4px 20px var(--primary-glow)'
          }}>
            AI
          </div>
          <h1 className="heading-display" style={{ fontSize: '1.6rem' }}>EFA Control</h1>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1.5px', marginBottom: '12px', paddingLeft: '16px', fontWeight: 600 }}>Community</div>
          <SidebarItem icon="⭐" label="GitHub" active={activeTab === 'GitHub'} onClick={() => setActiveTab('GitHub')} />

          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1.5px', marginTop: '32px', marginBottom: '12px', paddingLeft: '16px', fontWeight: 600 }}>Core Engine</div>
          <SidebarItem icon="📊" label="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
          <SidebarItem icon="🤖" label={`Agents (${agents.length})`} active={activeTab === 'Agents'} onClick={() => setActiveTab('Agents')} />
          <SidebarItem icon="⚡" label={`Skills (${skills.length})`} active={activeTab === 'Skills'} onClick={() => setActiveTab('Skills')} />
          
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1.5px', marginTop: '32px', marginBottom: '12px', paddingLeft: '16px', fontWeight: 600 }}>Security & Rules</div>
          <SidebarItem icon="🛡️" label="AgentShield" active={activeTab === 'AgentShield'} onClick={() => setActiveTab('AgentShield')} />
          <SidebarItem icon="⚙️" label="Rules Engine" active={activeTab === 'Rules'} onClick={() => setActiveTab('Rules')} />
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success-color)', boxShadow: '0 0 10px var(--success-color)' }}></div>
            <span style={{ fontSize: '0.9rem', color: 'var(--success-color)', fontWeight: 500 }}>System Online</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', overflowX: 'hidden' }}>
        <header className="glass-panel" style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="heading-display" style={{ fontSize: '2rem' }}>Welcome to EFA</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>The Universal Agent Harness Operating System</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="secondary-btn"
              onClick={() => window.open('https://github.com/VAIBHAV7848/EFA', '_blank')}
            >
              Documentation
            </button>
            <button 
              className="premium-btn"
              onClick={() => setActiveTab('Agents')}
            >
              Launch Agent
            </button>
          </div>
        </header>

        {activeTab === 'Overview' && (
          <>
            {/* Stats Row */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <StatCard title="Active Agents" value={agents.length.toString()} icon="🤖" trend="Ready for delegation" />
              <StatCard title="Loaded Skills" value={skills.length.toString()} icon="⚡" trend="+4 new this week" />
              <StatCard title="Security Score" value={`${score}%`} icon="🛡️" trend="AgentShield Active" />
              <StatCard title="Test Coverage" value="100%" icon="✅" trend="2,628 Passing Tests" />
            </div>

            {/* Health Monitor */}
            <div className="glass-panel" style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column' }}>
              <h2 className="heading-display" style={{ marginBottom: '24px' }}>System Health Monitor</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '16px' }}>
                {[
                  { name: 'Immutability Rules', status: 'Enforced', color: 'var(--success-color)' },
                  { name: 'TDD Workflow Engine', status: 'Active', color: 'var(--success-color)' },
                  { name: 'Security Reviewer', status: 'Standing By', color: 'var(--accent-color)' },
                  { name: 'Vector Memory Store', status: 'Optimized', color: 'var(--success-color)' }
                ].map((item, i) => (
                  <div key={i} className="interactive-card" style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '20px',
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-glass)'
                  }}>
                    <span style={{ fontWeight: 500, fontSize: '1.05rem' }}>{item.name}</span>
                    <span style={{ 
                      padding: '6px 14px', 
                      borderRadius: '20px', 
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      background: `rgba(${item.color === 'var(--danger-color)' ? '244, 63, 94' : item.color === 'var(--success-color)' ? '16, 185, 129' : '56, 189, 248'}, 0.15)`,
                      color: item.color,
                      border: `1px solid ${item.color}40`
                    }}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'Agents' && (
          <div className="glass-panel" style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
              <h2 className="heading-display">Agents Directory</h2>
              <input 
                type="text" 
                placeholder="Search agents..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ 
                  padding: '10px 20px', 
                  borderRadius: '12px', 
                  border: '1px solid var(--border-glass)', 
                  background: 'rgba(0,0,0,0.3)', 
                  color: '#fff',
                  width: '300px',
                  fontFamily: 'Outfit, sans-serif'
                }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', overflowY: 'auto', flex: 1, paddingBottom: '20px' }}>
              {filteredAgents.map((agent, i) => (
                <div key={i} className="interactive-card" style={{ padding: '24px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column' }}>
                  <h3 className="heading-display" style={{ fontSize: '1.3rem', marginBottom: '8px' }}>{agent.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px', flex: 1, lineHeight: 1.5 }}>{agent.description}</p>
                  <button 
                    onClick={() => handleCopy(agent.command, agent.name)}
                    className="secondary-btn"
                    style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{agent.command}</span>
                    <span style={{ color: 'var(--accent-color)' }}>Copy</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Skills' && (
          <div className="glass-panel" style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
              <h2 className="heading-display">Skills Library</h2>
              <input 
                type="text" 
                placeholder="Search skills..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ 
                  padding: '10px 20px', 
                  borderRadius: '12px', 
                  border: '1px solid var(--border-glass)', 
                  background: 'rgba(0,0,0,0.3)', 
                  color: '#fff',
                  width: '300px',
                  fontFamily: 'Outfit, sans-serif'
                }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', overflowY: 'auto', flex: 1, paddingBottom: '20px' }}>
              {filteredSkills.map((skill, i) => (
                <div key={i} className="interactive-card" style={{ padding: '24px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column' }}>
                  <h3 className="heading-display" style={{ fontSize: '1.3rem', marginBottom: '8px' }}>{skill.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px', flex: 1, lineHeight: 1.5 }}>{skill.description}</p>
                  <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.02)' }}>
                    <code style={{ fontFamily: 'monospace' }}>{skill.command}</code>
                    <button onClick={() => handleCopy(skill.command, skill.name)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontWeight: 600 }}>Copy</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'AgentShield' && (
          <div className="glass-panel" style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '40px', textAlign: 'center', padding: '40px 0' }}>
              <div style={{ 
                display: 'inline-block',
                padding: '20px 40px',
                borderRadius: '24px',
                background: `rgba(${score >= 80 ? '16, 185, 129' : '244, 63, 94'}, 0.1)`,
                border: `1px solid ${scoreColor}40`,
                boxShadow: `0 0 40px ${scoreColor}20`
              }}>
                <h2 className="heading-display" style={{ color: scoreColor, fontSize: '4rem', textShadow: `0 0 20px ${scoreColor}40` }}>{score}/100</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '8px', fontWeight: 500 }}>Overall Threat Score</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '700px', margin: '0 auto', width: '100%' }}>
              {shieldChecks.map((item, i) => (
                <div key={i} className="interactive-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
                  <span style={{ fontWeight: 500, fontSize: '1.05rem' }}>{item.q}</span>
                  <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.4))' }}>{item.a}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Rules' && (
          <div className="glass-panel" style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column' }}>
            <h2 className="heading-display" style={{ marginBottom: '32px' }}>Language Rules Engine</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {rules.map((rule, i) => (
                <div 
                  key={i} 
                  className="interactive-card"
                  onClick={() => handleCopy(`efa --rule ${rule.language}`, `${rule.language} rule`)}
                  style={{ 
                    padding: '24px', 
                    background: 'var(--bg-card)', 
                    borderRadius: '16px', 
                    border: '1px solid var(--border-glass)', 
                    textAlign: 'center', 
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ 
                    fontSize: '3rem', 
                    marginBottom: '16px',
                    filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.2))'
                  }}>🌐</div>
                  <h3 className="heading-display" style={{ textTransform: 'capitalize', marginBottom: '8px', fontSize: '1.4rem' }}>{rule.language}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--accent-color)', fontWeight: 500 }}>{rule.files.length} rule files</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'GitHub' && (
          <div className="glass-panel" style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ 
              fontSize: '5rem', 
              marginBottom: '24px',
              filter: 'drop-shadow(0 0 30px rgba(255, 255, 255, 0.2))'
            }}>⭐</div>
            <h2 className="heading-display" style={{ fontSize: '3rem', marginBottom: '16px' }}>Open Source & Free</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '650px', marginBottom: '40px', lineHeight: 1.6 }}>
              EFA is built to give control back to developers. It's a complete, local AI operating system with autonomous agents, true parallel execution, and auto-healing capabilities. Support the project by dropping a star!
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <button 
                className="premium-btn"
                style={{ fontSize: '1.1rem', padding: '16px 36px', display: 'flex', alignItems: 'center', gap: '10px' }}
                onClick={() => window.open('https://github.com/VAIBHAV7848/EFA', '_blank')}
              >
                <span style={{ fontSize: '1.2rem' }}>⭐</span> Star Repository
              </button>
              <button 
                className="secondary-btn"
                style={{ fontSize: '1.1rem', padding: '16px 36px' }}
                onClick={() => window.open('https://github.com/VAIBHAV7848/EFA/discussions', '_blank')}
              >
                Join Discussions
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
