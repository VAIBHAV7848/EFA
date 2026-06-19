import React, { useState, useEffect } from 'react';
import './index.css';
import efaData from './data/efa-data.json';

const SidebarItem = ({ icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    style={{
      padding: '12px 16px',
      margin: '8px 0',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      background: active ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
      borderLeft: active ? '3px solid var(--accent-color)' : '3px solid transparent',
      color: active ? '#fff' : 'var(--text-muted)',
      transition: 'all 0.2s ease'
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
    <span style={{ fontSize: '1.2rem' }}>{icon}</span>
    <span style={{ fontWeight: 500 }}>{label}</span>
  </div>
);

const StatCard = ({ title, value, icon, trend }) => (
  <div className="glass-panel" style={{ padding: '24px', flex: '1', minWidth: '200px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 500 }}>{title}</h3>
        <div className="heading-display" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff' }}>{value}</div>
      </div>
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.1)', 
        padding: '12px', 
        borderRadius: '12px',
        fontSize: '1.5rem'
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
  const [activeTab, setActiveTab] = useState('Overview');
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
  const score = Math.round((passed / shieldChecks.length) * 100);
  const scoreColor = score >= 80 ? 'var(--success-color)' 
                   : score >= 60 ? '#f59e0b' 
                   : 'var(--error-color)';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', padding: '20px', gap: '20px' }}>
      {/* Sidebar */}
      <nav className="glass-panel" style={{ width: '280px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            background: 'linear-gradient(135deg, var(--accent-color), #8b5cf6)', 
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1.2rem'
          }}>
            AI
          </div>
          <h1 className="heading-display" style={{ fontSize: '1.5rem' }}>EFA Control</h1>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '12px', paddingLeft: '16px' }}>Core</div>
          <SidebarItem icon="📊" label="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
          <SidebarItem icon="🤖" label={`Agents (${agents.length})`} active={activeTab === 'Agents'} onClick={() => setActiveTab('Agents')} />
          <SidebarItem icon="⚡" label={`Skills (${skills.length})`} active={activeTab === 'Skills'} onClick={() => setActiveTab('Skills')} />
          
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', marginTop: '32px', marginBottom: '12px', paddingLeft: '16px' }}>Security</div>
          <SidebarItem icon="🛡️" label="AgentShield" active={activeTab === 'AgentShield'} onClick={() => setActiveTab('AgentShield')} />
          <SidebarItem icon="⚙️" label="Rules Engine" active={activeTab === 'Rules'} onClick={() => setActiveTab('Rules')} />
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success-color)', boxShadow: '0 0 10px var(--success-color)' }}></div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>System Online</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <header className="glass-panel" style={{ padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="heading-display" style={{ fontSize: '1.8rem' }}>Welcome to EFA</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>The Universal Agent Harness Operating System</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ 
              background: 'var(--bg-card)', 
              border: '1px solid var(--border-glass)', 
              color: '#fff', 
              padding: '10px 20px', 
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'var(--bg-card)'}
            >
              Docs
            </button>
            <button style={{ 
              background: 'var(--accent-color)', 
              border: 'none', 
              color: '#fff', 
              padding: '10px 20px', 
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              boxShadow: '0 0 20px var(--primary-glow)'
            }}>
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
              <StatCard title="Security Score" value="100%" icon="🛡️" trend="AgentShield Active" />
              <StatCard title="Test Coverage" value="84%" icon="✅" trend="Passing TDD Rule" />
            </div>

            {/* Health Monitor */}
            <div className="glass-panel" style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column' }}>
              <h2 className="heading-display" style={{ marginBottom: '24px' }}>System Health Monitor</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { name: 'Immutability Rules', status: 'Enforced', color: 'var(--success-color)' },
                  { name: 'TDD Workflow Engine', status: 'Active', color: 'var(--success-color)' },
                  { name: 'Security Reviewer', status: 'Standing By', color: 'var(--accent-color)' },
                  { name: 'Legacy Dashboard (Tkinter)', status: 'Deprecated', color: 'var(--danger-color)' }
                ].map((item, i) => (
                  <div key={i} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '16px',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <span style={{ fontWeight: 500 }}>{item.name}</span>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '0.85rem',
                      background: `rgba(${item.color === 'var(--danger-color)' ? '239, 68, 68' : item.color === 'var(--success-color)' ? '16, 185, 129' : '59, 130, 246'}, 0.1)`,
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 className="heading-display">Agents Directory</h2>
              <input 
                type="text" 
                placeholder="Search agents..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: '#fff' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px', overflowY: 'auto', flex: 1 }}>
              {filteredAgents.map((agent, i) => (
                <div key={i} style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{agent.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>{agent.description}</p>
                  <button 
                    onClick={() => navigator.clipboard.writeText(agent.command)}
                    style={{ background: 'var(--accent-color)', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
                    Copy {agent.command}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Skills' && (
          <div className="glass-panel" style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 className="heading-display">Skills Library</h2>
              <input 
                type="text" 
                placeholder="Search skills..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: '#fff' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', overflowY: 'auto', flex: 1 }}>
              {filteredSkills.map((skill, i) => (
                <div key={i} style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{skill.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>{skill.description}</p>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <code>{skill.command}</code>
                    <button onClick={() => navigator.clipboard.writeText(skill.command)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-color)', cursor: 'pointer' }}>Copy</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'AgentShield' && (
          <div className="glass-panel" style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
              <h2 className="heading-display" style={{ color: scoreColor, fontSize: '3rem' }}>{score}/100</h2>
              <p style={{ color: 'var(--text-muted)' }}>Overall Threat Score</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
              {shieldChecks.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                  <span style={{ fontWeight: 500 }}>{item.q}</span>
                  <span>{item.a}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Rules' && (
          <div className="glass-panel" style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column' }}>
            <h2 className="heading-display" style={{ marginBottom: '24px' }}>Language Rules Engine</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {rules.map((rule, i) => (
                <div key={i} style={{ padding: '20px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-glass)', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🌐</div>
                  <h3 style={{ textTransform: 'capitalize', marginBottom: '8px' }}>{rule.language}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rule.files.length} rule files</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
