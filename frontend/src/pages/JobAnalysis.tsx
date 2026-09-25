import React, { useState, useEffect } from 'react';
import { jobService, demoService } from '../services/api';
import { JobDescription } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Briefcase, Sparkles, Plus, CheckCircle, Code, Layers } from 'lucide-react';

export const JobAnalysisPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobDescription | null>(null);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      let list = await jobService.list();
      if (list.length === 0) {
        await demoService.seed();
        list = await jobService.list();
      }
      setJobs(list);
      if (list.length > 0) {
        setSelectedJob(list[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setAnalyzing(true);
    try {
      const newJob = await jobService.analyze(description, title, company);
      setJobs([newJob, ...jobs]);
      setSelectedJob(newJob);
      setDescription('');
      setTitle('');
      setCompany('');
    } catch (err: any) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading job descriptions..." />;

  const jData = selectedJob?.structured_data;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div className="glass-card">
        <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Job Description Analyzer</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Paste target job postings to automatically extract required skills, preferred qualifications, and core responsibilities.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '24px' }}>
        {/* Form Column */}
        <div className="glass-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem', marginBottom: '16px' }}>
            <Plus size={20} color="var(--primary)" /> Analyze New Job Description
          </h3>

          <form onSubmit={handleAnalyze}>
            <div className="form-group">
              <label className="form-label">Job Title (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Senior Python Developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Company Name (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. CloudTech Solutions"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job Description Text</label>
              <textarea
                required
                rows={8}
                className="form-textarea"
                placeholder="Paste full job posting description text here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button type="submit" disabled={analyzing} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Sparkles size={18} /> {analyzing ? 'Extracting Requirements...' : 'Analyze Job Description'}
            </button>
          </form>
        </div>

        {/* Results Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {jobs.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {jobs.map((j) => (
                <button
                  key={j.id}
                  onClick={() => setSelectedJob(j)}
                  className={selectedJob?.id === j.id ? 'btn-primary' : 'btn-secondary'}
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                >
                  <Briefcase size={14} /> {j.title}
                </button>
              ))}
            </div>
          )}

          {selectedJob ? (
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem' }}>{selectedJob.title}</h3>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {selectedJob.company || 'Target Job Role'}
                </span>
              </div>

              <div>
                <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>
                  Required Skills
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(jData?.required_skills || []).map((s) => (
                    <span key={s} className="badge badge-primary">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              {jData?.preferred_skills && jData.preferred_skills.length > 0 && (
                <div>
                  <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>
                    Preferred Skills
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {jData.preferred_skills.map((s) => (
                      <span key={s} className="badge badge-warning">
                        + {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {jData?.experience_requirements && (
                <div>
                  <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Experience Required</h4>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{jData.experience_requirements}</div>
                </div>
              )}

              {jData?.responsibilities && jData.responsibilities.length > 0 && (
                <div>
                  <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '6px' }}>
                    Core Responsibilities
                  </h4>
                  <ul style={{ paddingLeft: '20px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    {jData.responsibilities.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Briefcase size={40} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
              <h3>No Job Description Analyzed</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                Paste job text on the left to extract skills and requirements.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
