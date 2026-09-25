import React, { useState, useEffect } from 'react';
import { resumeService, jobService, matchingService } from '../services/api';
import { Resume, JobDescription, MatchingResult } from '../types';
import { ScoreGauge } from '../components/ScoreGauge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { GitCompare, Sparkles, CheckCircle, AlertCircle, Info } from 'lucide-react';

export const MatchPage: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [matchResult, setMatchResult] = useState<MatchingResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);

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

  const handleRunMatch = async () => {
    if (!selectedResumeId || !selectedJobId) return;
    setMatching(true);
    try {
      const result = await matchingService.analyze(selectedResumeId, selectedJobId);
      setMatchResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setMatching(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading match engine data..." />;

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="page-header-card">
        <div>
          <h2 style={{ fontSize: '1.65rem', marginBottom: '4px' }}>Resume vs Job Matching Engine</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Uses SentenceTransformers vector embeddings and keyword coverage to compute a transparent compatibility score.
          </p>
        </div>
      </div>

      {/* Selectors */}
      <div className="glass-card responsive-flex-stack" style={{ display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">Select Uploaded Resume</label>
          <select
            className="form-select"
            value={selectedResumeId}
            onChange={(e) => setSelectedResumeId(e.target.value)}
          >
            {resumes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.filename} ({r.structured_data?.name || 'Candidate'})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">Select Target Job Posting</label>
          <select
            className="form-select"
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} ({j.company || 'Role'})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleRunMatch}
          disabled={matching || !selectedResumeId || !selectedJobId}
          className="btn-primary responsive-btn-full"
          style={{ height: '44px' }}
        >
          <GitCompare size={18} /> {matching ? 'Calculating Fit...' : 'Calculate Fit'}
        </button>
      </div>

      {/* Result Display */}
      {matchResult ? (
        <div className="grid-2col">
          {/* Column 1: Score & Breakdown */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px' }}>
            <ScoreGauge score={matchResult.compatibility_score} label="Resume Compatibility" size={160} />

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>Skill Overlap (45% weight)</span>
                  <span style={{ fontWeight: 700 }}>{matchResult.skill_overlap_score}%</span>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.1)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ background: 'var(--primary)', width: `${matchResult.skill_overlap_score}%`, height: '100%' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>Semantic Vector Similarity (35% weight)</span>
                  <span style={{ fontWeight: 700 }}>{matchResult.semantic_similarity_score}%</span>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.1)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ background: 'var(--accent-cyan)', width: `${matchResult.semantic_similarity_score}%`, height: '100%' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>Job Keyword Coverage (20% weight)</span>
                  <span style={{ fontWeight: 700 }}>{matchResult.keyword_coverage_score}%</span>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.1)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ background: 'var(--secondary)', width: `${matchResult.keyword_coverage_score}%`, height: '100%' }} />
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '14px', borderRadius: '10px', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#a5b4fc', marginBottom: '4px' }}>
                <Info size={16} /> Transparent Score Calculation
              </div>
              {matchResult.score_explanation}
            </div>
          </div>

          {/* Column 2: Strong Matches vs Skills to Develop */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontSize: '1.15rem', marginBottom: '12px' }}>
                <CheckCircle size={20} /> Strong Skill Matches
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {matchResult.strong_matches.map((s) => (
                  <span key={s} className="badge badge-success">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)', fontSize: '1.15rem', marginBottom: '12px' }}>
                <AlertCircle size={20} /> Skills to Develop
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {matchResult.skills_to_develop.map((s) => (
                  <span key={s} className="badge badge-warning">
                    • {s}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--bg-card-border)', paddingTop: '16px' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Relevant Experience Assessment</h4>
              <p style={{ fontSize: '0.88rem' }}>{matchResult.relevant_experience_summary}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <GitCompare size={40} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
          <h3>No Match Analysis Generated Yet</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Select a resume and job description above and click "Calculate Fit".
          </p>
        </div>
      )}
    </div>
  );
};
