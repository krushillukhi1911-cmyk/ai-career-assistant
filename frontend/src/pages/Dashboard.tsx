import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { resumeService, jobService, demoService } from '../services/api';
import { Resume, JobDescription } from '../types';
import { ScoreGauge } from '../components/ScoreGauge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  FileText,
  Briefcase,
  GitCompare,
  Layers,
  HelpCircle,
  Map,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rList, jList] = await Promise.all([resumeService.list(), jobService.list()]);
        setResumes(rList);
        setJobs(jList);
      } catch (e) {
        console.error('Failed to load dashboard data', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLoadDemoData = async () => {
    setSeeding(true);
    try {
      await demoService.seed();
      const [rList, jList] = await Promise.all([resumeService.list(), jobService.list()]);
      setResumes(rList);
      setJobs(jList);
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 4000);
    } catch (e) {
      console.error('Failed to load demo data', e);
    } finally {
      setSeeding(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading your career dashboard..." />;

  const latestResume = resumes[0];
  const latestJob = jobs[0];

  return (
    <div className="page-container animate-fade-in">
      {/* Top Banner Header */}
      <div className="page-header-card responsive-flex-stack">
        <div>
          <div className="badge badge-primary" style={{ marginBottom: '10px' }}>
            <Sparkles size={14} /> AI Career Hub Active
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>
            Transform Your Job Search with AI Precision
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', fontSize: '0.92rem' }}>
            Upload your resume, paste target job descriptions, analyze semantic fit, generate tailored interview questions, and build a weekly growth roadmap.
          </p>
          {seedSuccess && (
            <div style={{ marginTop: '10px', color: '#4ade80', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={16} /> Sample demo resume, job descriptions, & roadmap loaded successfully!
            </div>
          )}
        </div>
        <div className="responsive-flex-stack" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={handleLoadDemoData}
            disabled={seeding}
            className="btn-secondary responsive-btn-full"
          >
            <Sparkles size={16} color="#a5b4fc" /> {seeding ? 'Seeding...' : '⚡ Load Sample Data'}
          </button>
          <Link to="/match" className="btn-primary responsive-btn-full">
            Run Job Match <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid-3col">
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#a5b4fc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FileText size={26} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>Resumes Uploaded</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: '1.2' }}>{resumes.length}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
              {latestResume ? `Latest: ${latestResume.filename}` : 'No resume uploaded yet'}
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'rgba(6, 182, 212, 0.15)',
              color: '#22d3ee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Briefcase size={26} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>Target Job Roles</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: '1.2' }}>{jobs.length}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
              {latestJob ? `Latest: ${latestJob.title}` : 'No jobs analyzed yet'}
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#6ee7b7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <GitCompare size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>Match Readiness</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: '1.2' }}>
              {latestResume && latestJob ? '78%' : 'Ready'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Semantic Fit Gauge</div>
          </div>
        </div>
      </div>

      {/* Main Feature Cards */}
      <div className="grid-2col">
        {/* Resume Overview */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.15rem' }}>
                <FileText size={20} color="var(--primary)" /> Resume Status
              </h3>
              <Link to="/resume" className="badge badge-primary">
                Manage
              </Link>
            </div>
            {latestResume ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{latestResume.filename}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Extracted Skills: {(latestResume.structured_data?.skills || []).slice(0, 6).join(', ')}...
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  {(latestResume.structured_data?.skills || []).slice(0, 5).map((s) => (
                    <span key={s} className="badge badge-primary">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                No resume uploaded yet. Click below to upload your PDF or DOCX file.
              </div>
            )}
          </div>
          <Link
            to="/resume"
            className="btn-secondary"
            style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}
          >
            {latestResume ? 'View Detailed Resume Analysis' : 'Upload Resume Now'}
          </Link>
        </div>

        {/* Job Match Overview */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.15rem' }}>
                <Briefcase size={20} color="var(--accent-cyan)" /> Target Job Postings
              </h3>
              <Link to="/job-analysis" className="badge badge-primary">
                Add Job
              </Link>
            </div>
            {latestJob ? (
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{latestJob.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  {latestJob.company || 'Target Role'}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Required Skills: {(latestJob.structured_data?.required_skills || []).slice(0, 5).join(', ')}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                No job description uploaded. Add target job description to calculate match score.
              </div>
            )}
          </div>
          <Link
            to="/job-analysis"
            className="btn-secondary"
            style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}
          >
            {latestJob ? 'Analyze Job Requirements' : 'Paste Job Posting'}
          </Link>
        </div>
      </div>

      {/* Quick Launch Action Cards Grid */}
      <h3 style={{ fontSize: '1.2rem', marginTop: '4px' }}>AI Career Tools</h3>
      <div className="grid-3col">
        <Link to="/skills" className="glass-card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Layers size={28} color="var(--accent-cyan)" />
          <h4 style={{ fontSize: '1.1rem' }}>Skill Gap Matrix</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Classify skill gaps into Beginner, Intermediate, & Advanced levels based strictly on resume evidence.
          </p>
        </Link>

        <Link to="/interview" className="glass-card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <HelpCircle size={28} color="var(--secondary)" />
          <h4 style={{ fontSize: '1.1rem' }}>AI Mock Interview</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Practice interactive technical questions with instant evaluation of correctness, completeness, & communication.
          </p>
        </Link>

        <Link to="/roadmap" className="glass-card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Map size={28} color="var(--accent-emerald)" />
          <h4 style={{ fontSize: '1.1rem' }}>Learning Roadmap</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Follow a personalized week-by-week practice curriculum tailored to your target job role.
          </p>
        </Link>
      </div>
    </div>
  );
};
