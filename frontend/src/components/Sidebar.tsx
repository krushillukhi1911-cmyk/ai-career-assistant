import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  GitCompare,
  Layers,
  HelpCircle,
  Map,
  MessageSquare,
  User,
  Sparkles,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/resume', label: 'Resume Analyzer', icon: FileText },
    { to: '/job-analysis', label: 'Job Analysis', icon: Briefcase },
    { to: '/match', label: 'Match Engine', icon: GitCompare },
    { to: '/skills', label: 'Skill Gap Analysis', icon: Layers },
    { to: '/interview', label: 'Mock Interview', icon: HelpCircle },
    { to: '/roadmap', label: 'Learning Roadmap', icon: Map },
    { to: '/chat', label: 'RAG Career Chat', icon: MessageSquare },
    { to: '/profile', label: 'Profile & History', icon: User },
  ];

  return (
    <aside className="sidebar">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px 32px 8px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)',
            }}
          >
            <Sparkles size={22} color="#fff" />
          </div>
          <div className="nav-label">
            <h2 style={{ fontSize: '1.2rem', lineHeight: '1.2' }} className="gradient-text">
              Career AI
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Production Assistant</span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  background: isActive
                    ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)'
                    : 'transparent',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                })}
              >
                <Icon size={20} color={item.to === window.location.pathname ? '#a5b4fc' : 'currentColor'} />
                <span className="nav-label">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="nav-label" style={{ padding: '16px 8px', borderTop: '1px solid var(--bg-card-border)' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>AI Career Assistant v1.0</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Powered by FastAPI & RAG</div>
      </div>
    </aside>
  );
};
