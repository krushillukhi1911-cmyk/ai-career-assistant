import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { User as UserIcon, LogOut, Bell } from 'lucide-react';

interface NavbarProps {
  user?: any;
}

export const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '24px',
        marginBottom: '24px',
        borderBottom: '1px solid var(--bg-card-border)',
      }}
    >
      <div>
        <h1 style={{ fontSize: '1.75rem' }}>Welcome back, Candidate 👋</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Analyze your resume, identify skill gaps, and supercharge your technical interview performance.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          className="btn-secondary"
          style={{ padding: '10px', borderRadius: '50%' }}
          title="Notifications"
        >
          <Bell size={18} />
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '6px 14px',
            borderRadius: '9999px',
            border: '1px solid var(--bg-card-border)',
          }}
        >
          <UserIcon size={18} color="#a5b4fc" />
          <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>
            {user?.email || 'User Account'}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="btn-secondary"
          style={{ padding: '8px 14px', fontSize: '0.85rem' }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
};
