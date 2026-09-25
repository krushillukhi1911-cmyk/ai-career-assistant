import React, { useState, useEffect } from 'react';
import { authService, resumeService, jobService } from '../services/api';
import { User as UserType, Resume, JobDescription } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { User as UserIcon, Mail, ShieldCheck, Clock, FileText, Briefcase } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [uData, rList, jList] = await Promise.all([
          authService.getMe(),
          resumeService.list(),
          jobService.list(),
        ]);
        setUser(uData);
        setResumes(rList);
        setJobs(jList);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner message="Loading user profile..." />;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
          }}
        >
          <UserIcon size={32} color="#fff" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.6rem' }}>{user?.email}</h2>
          <span className="badge badge-success">Active Account</span>
        </div>
      </div>

      {/* History Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Uploaded Resumes */}
        <div className="glass-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', marginBottom: '16px' }}>
            <FileText size={20} color="var(--primary)" /> Resume History ({resumes.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {resumes.map((r) => (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.filename}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Uploaded {new Date(r.created_at).toLocaleDateString()}
                  </div>
                </div>
                <span className="badge badge-primary">{r.file_type.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Target Jobs */}
        <div className="glass-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', marginBottom: '16px' }}>
            <Briefcase size={20} color="var(--accent-cyan)" /> Target Job Descriptions ({jobs.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {jobs.map((j) => (
              <div key={j.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{j.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{j.company || 'Role'}</div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(j.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
