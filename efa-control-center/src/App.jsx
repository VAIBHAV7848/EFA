import React, { useState } from 'react';
import './index.css';

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
          <SidebarItem icon="🤖" label="Agents (67)" active={activeTab === 'Agents'} onClick={() => setActiveTab('Agents')} />
          <SidebarItem icon="⚡" label="Skills (271)" active={activeTab === 'Skills'} onClick={() => setActiveTab('Skills')} />
          
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
              <StatCard title="Active Agents" value="67" icon="🤖" trend="Ready for delegation" />
              <StatCard title="Loaded Skills" value="271" icon="⚡" trend="+4 new this week" />
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
        
        {activeTab !== 'Overview' && (
          <div className="glass-panel" style={{ flex: 1, padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🚧</div>
              <h2 className="heading-display" style={{ color: '#fff', marginBottom: '8px' }}>{activeTab} Module</h2>
              <p>This module is currently being built in Phase 2 of the EFA OS update.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
