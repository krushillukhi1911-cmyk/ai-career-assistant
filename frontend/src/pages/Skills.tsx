import React, { useState, useEffect } from 'react';
import { resumeService, jobService, skillService } from '../services/api';
import { Resume, JobDescription, SkillGapAnalysis } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Layers, CheckCircle, AlertTriangle, ArrowUpRight } from 'lucide-react';

export const SkillsPage: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [gapData, setGapData] = useState<SkillGapAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [rList, jList] = await Promise.all([resumeService.list(), jobService.list()]);
        setResumes(rList);
        setJobs(jList);
        if (rList.length > 0) setSelectedResumeId(rList[0].id);
        if (jList.length > 0) setSelectedJobId(jList[0].id);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleRunGapAnalysis = async () => {
    if (!selectedResumeId || !selectedJobId) return;
    setAnalyzing(true);
    try {
      const data = await skillService.analyzeGap(selectedResumeId, selectedJobId);
      setGapData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading skill analyzer..." />;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div className="glass-card">
        <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>AI Skill Gap Classification</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Identifies existing skills vs required job skills, classifying proficiency gaps strictly from resume evidence.
        </p>
      </div>

      {/* Selectors */}
      <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '20px', alignItems: 'flex-end' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Resume</label>
          <select className="form-select" value={selectedResumeId} onChange={(e) => setSelectedResumeId(e.target.value)}>
            {resumes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.filename}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Target Job Role</label>
          <select className="form-select" value={selectedJobId} onChange={(e) => setSelectedJobId(e.target.value)}>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleRunGapAnalysis} disabled={analyzing} className="btn-primary" style={{ height: '46px', justifyContent: 'center' }}>
          <Layers size={18} /> {analyzing ? 'Analyzing Gaps...' : 'Analyze Skill Gap'}
        </button>
      </div>

      {/* Gap Matrix View */}
      {gapData ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Summary Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '20px' }}>
            <div className="glass-card">
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Existing Skills</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                {gapData.existing_skills.length}
              </div>
            </div>

            <div className="glass-card">
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Required Skills</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>
                {gapData.required_skills.length}
              </div>
            </div>

            <div className="glass-card">
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Missing Skill Gaps</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
                {gapData.missing_skills.length}
              </div>
            </div>
          </div>

          {/* Classified Gap Table */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Classified Skill Gap Recommendations</h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--bg-card-border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px' }}>Target Skill</th>
                    <th style={{ padding: '12px' }}>Required Level</th>
                    <th style={{ padding: '12px' }}>Current Evidence</th>
                    <th style={{ padding: '12px' }}>Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {gapData.skill_gaps_classified.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--bg-card-border)' }}>
                      <td style={{ padding: '14px', fontWeight: 600 }}>{item.skill_name}</td>
                      <td style={{ padding: '14px' }}>
                        <span
                          className={
                            item.target_proficiency === 'Advanced'
                              ? 'badge badge-danger'
                              : item.target_proficiency === 'Intermediate'
                              ? 'badge badge-warning'
                              : 'badge badge-primary'
                          }
                        >
                          {item.target_proficiency}
                        </span>
                      </td>
                      <td style={{ padding: '14px', color: 'var(--text-muted)' }}>{item.current_evidence}</td>
                      <td style={{ padding: '14px', color: '#a5b4fc' }}>{item.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Layers size={40} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
          <h3>No Skill Gap Analysis Generated</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Select resume & job posting above to trigger skill gap classification.
          </p>
        </div>
      )}
    </div>
  );
};
