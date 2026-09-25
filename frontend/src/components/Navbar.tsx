import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { User as UserIcon, LogOut, Bell, Menu } from 'lucide-react';

interface NavbarProps {
  user?: any;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onToggleMobileMenu }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Top Navigation Header */}
      <div className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onToggleMobileMenu}
            className="btn-secondary"
            style={{ padding: '8px', borderRadius: '10px' }}
            aria-label="Toggle navigation menu"
          >
            <Menu size={22} color="#a5b4fc" />
          </button>
          <h2 style={{ fontSize: '1.1rem' }} className="gradient-text">
            Career AI
          </h2>
        </div>
        <button
          onClick={handleLogout}
          className="btn-secondary"
          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>

      <header
        className="responsive-flex-stack"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '24px',
          marginBottom: '24px',
          borderBottom: '1px solid var(--bg-card-border)',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem' }}>Welcome back, Candidate 👋</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Analyze your resume, identify skill gaps, and supercharge your technical interview performance.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            className="btn-secondary"
            style={{ width: '42px', height: '42px', padding: 0, borderRadius: '50%', flexShrink: 0 }}
            title="Notifications"
          >
            <Bell size={18} color="#a5b4fc" />
          </button>

          <div
            className="navbar-user-info"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '0 16px',
              height: '42px',
              borderRadius: '9999px',
              border: '1px solid var(--bg-card-border)',
            }}
          >
            <UserIcon size={18} color="#a5b4fc" />
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)' }}>
              {user?.email || 'demo@example.com'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="btn-secondary"
            style={{ height: '42px', padding: '0 16px', fontSize: '0.85rem' }}
          >
            <LogOut size={16} />
            <span className="navbar-logout-text">Logout</span>
          </button>
        </div>
      </header>
    </>
  );
};
