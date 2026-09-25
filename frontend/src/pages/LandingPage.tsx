import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  FileText,
  Briefcase,
  Target,
  BrainCircuit,
  Compass,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Star,
  Layers,
  ChevronRight,
  Check,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleGetStarted = () => {
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div
      className="landing-container"
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 60%, #090d16 100%)',
        color: 'var(--text-primary)',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Sticky Header / Navbar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 3rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(15, 23, 42, 0.75)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)',
            }}
          >
            <Sparkles size={24} color="#ffffff" />
          </div>
          <span
            style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            Career AI
          </span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <a href="#features" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>
            Features
          </a>
          <a href="#how-it-works" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>
            How it Works
          </a>
          <a href="#testimonials" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>
            Success Stories
          </a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {token ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem 1.6rem', fontSize: '0.95rem' }}
            >
              Go to Dashboard <ArrowRight size={18} />
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="btn-secondary"
                style={{ textDecoration: 'none', padding: '0.65rem 1.4rem', fontSize: '0.95rem' }}
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="btn-primary"
                style={{ textDecoration: 'none', padding: '0.65rem 1.6rem', fontSize: '0.95rem' }}
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '4rem 1.5rem 3rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: '3rem',
          alignItems: 'center',
        }}
      >
        {/* Left Column: Headline & Action */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.45rem 1.1rem',
              borderRadius: '50px',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#a5b4fc',
              fontSize: '0.88rem',
              fontWeight: 600,
              marginBottom: '1.75rem',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)',
            }}
          >
            <Zap size={16} /> Production-Ready AI Career Intelligence
          </div>

          <h1
            style={{
              fontSize: '3.6rem',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #ffffff 30%, #c7d2fe 70%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Supercharge Your Tech Career with AI Precision
          </h1>

          <p
            style={{
              fontSize: '1.2rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              marginBottom: '2.5rem',
            }}
          >
            Upload your resume, analyze transparent job compatibility scores (45% Skill Overlap + 35% Embeddings), practice interactive AI mock interviews, and follow custom 6-week roadmaps.
          </p>

          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={handleGetStarted}
              className="btn-primary"
              style={{
                fontSize: '1.1rem',
                padding: '0.95rem 2.4rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 0 25px rgba(99, 102, 241, 0.5)',
              }}
            >
              {token ? 'Go to Dashboard' : 'Start Free Analysis'} <ArrowRight size={20} />
            </button>
            <a
              href="#how-it-works"
              className="btn-secondary"
              style={{ fontSize: '1.1rem', padding: '0.95rem 2.2rem', textDecoration: 'none' }}
            >
              See How It Works
            </a>
          </div>

          {/* Key Bullet Highlights */}
          <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
              <CheckCircle2 size={18} color="#4ade80" /> 100% Privacy & Safety
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
              <CheckCircle2 size={18} color="#4ade80" /> RAG FAISS Vector Search
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
              <CheckCircle2 size={18} color="#4ade80" /> Zero Credit Card Required
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Glass Mockup */}
        <div
          className="glass-card"
          style={{
            padding: '2rem',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(99, 102, 241, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            position: 'relative',
          }}
        >
          {/* Mock Header Badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eab308' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }} />
            </div>
            <span className="badge badge-primary">Live Match Analysis</span>
          </div>

          {/* Score Gauge Preview */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '1.25rem',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Target Role: Senior Python Engineer</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#6ee7b7', marginTop: '4px' }}>82.5% Compatibility</div>
              <div style={{ fontSize: '0.75rem', color: '#a5b4fc', marginTop: '2px' }}>Skill Overlap: 100% | Semantic Fit: 72%</div>
            </div>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'conic-gradient(#10b981 0% 82.5%, rgba(255, 255, 255, 0.1) 82.5% 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  color: '#ffffff',
                }}
              >
                82%
              </div>
            </div>
          </div>

          {/* Extracted Skills Preview */}
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Extracted Candidate Skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Git', 'REST APIs', 'pytest', 'Redis'].map((s) => (
                <span key={s} className="badge badge-primary">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* AI Refined Bullet Point Sample */}
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              padding: '1rem',
              borderRadius: '12px',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              Built backend services using FastAPI.
            </div>
            <div style={{ fontSize: '0.88rem', color: '#6ee7b7', fontWeight: 600, marginTop: '4px' }}>
              ✓ Engineered high-throughput FastAPI microservices delivering 99.9% uptime for 100k+ daily users.
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(15, 23, 42, 0.5)', padding: '3rem 2rem' }}>
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#818cf8' }}>3-Way</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>Match Algorithm (45/35/20)</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#38bdf8' }}>384-Dim</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>FAISS Vector Store Embeddings</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#4ade80' }}>95/100</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>Average ATS Structure Score</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#facc15' }}>6-Week</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>Personalized Growth Roadmaps</div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" style={{ maxWidth: '1280px', margin: '0 auto', padding: '6rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="badge badge-primary" style={{ marginBottom: '12px' }}>
            Comprehensive AI Toolkit
          </div>
          <h2 style={{ fontSize: '2.6rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Everything You Need to Land Your Dream Job
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
            Powered by advanced RAG vector retrieval, structured NLP parsing, and automated technical evaluation engines.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '2rem',
          }}
        >
          <div className="glass-card" style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#818cf8',
              }}
            >
              <FileText size={28} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700 }}>AI Resume Extraction & Parsing</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Upload PDF, DOCX, or TXT resumes. Automatically extract technical skills, work history, education, and contact details with high precision.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'rgba(168, 85, 247, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#c084fc',
              }}
            >
              <Target size={28} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Transparent 3-Way Match Engine</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Calculate transparent job fit scores using 45% skill overlap, 35% semantic embedding similarity, and 20% key phrase coverage.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'rgba(34, 197, 94, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4ade80',
              }}
            >
              <BrainCircuit size={28} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700 }}>AI Mock Interview Simulator</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Simulate technical interview rounds tailored to your target job. Receive immediate evaluation on technical correctness and clarity.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'rgba(236, 72, 153, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f472b6',
              }}
            >
              <Compass size={28} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Personalized Growth Roadmaps</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Generate tailored 4-8 week study roadmaps broken down into weekly objectives, hands-on practice tasks, and capstone mini-projects.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
              }}
            >
              <MessageSquare size={28} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Contextual RAG Career Chatbot</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Chat with an AI career advisor backed by FAISS vector index search over your uploaded resumes and target job descriptions.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'rgba(234, 179, 8, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#facc15',
              }}
            >
              <ShieldCheck size={28} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Facts-vs-Assumptions Safety</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Strict verification guarantees AI never fabricates candidate experience or credentials, preserving 100% data integrity.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="badge badge-primary" style={{ marginBottom: '12px' }}>
            4 Simple Steps
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>How Career AI Works</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
          <div className="glass-card" style={{ padding: '1.75rem', position: 'relative' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#6366f1', marginBottom: '0.75rem' }}>01</div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Upload Resume</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Upload your resume in PDF or DOCX format or click ⚡ Load Sample Resume to populate test data.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem', position: 'relative' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#8b5cf6', marginBottom: '0.75rem' }}>02</div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Analyze Job Fit</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Paste target job descriptions to get instant 3-way matching scores and missing skill classifications.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem', position: 'relative' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ec4899', marginBottom: '0.75rem' }}>03</div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Practice Mock Interviews</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Simulate technical interview rounds and receive instant feedback on correctness and communication.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem', position: 'relative' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginBottom: '0.75rem' }}>04</div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Execute Growth Roadmap</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Follow weekly objectives, hands-on practice projects, and mini capstones to bridge any skill gaps.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="badge badge-primary" style={{ marginBottom: '12px' }}>
              Developer Testimonials
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Loved by Engineers & Developers</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '4px', color: '#facc15' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, fontStyle: 'italic' }}>
                "The ATS action bullet point improver transformed my resume. I got 3 callbacks within a week of updating my FastAPI experience highlights!"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  JD
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Jane Doe</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Senior Python Engineer</div>
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '4px', color: '#facc15' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, fontStyle: 'italic' }}>
                "The mock interview simulator asked the exact async Python and GIL questions that came up in my final technical interview!"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  AC
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Alex Chen</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fullstack React & Python Lead</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section style={{ maxWidth: '1100px', margin: '6rem auto', padding: '0 2rem' }}>
        <div
          className="glass-card"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.15) 100%)',
            borderColor: 'rgba(99, 102, 241, 0.4)',
            padding: '4rem 3rem',
            borderRadius: '28px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            boxShadow: '0 20px 60px rgba(99, 102, 241, 0.3)',
          }}
        >
          <h2 style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-0.02em', maxWidth: '750px' }} className="gradient-text">
            Ready to Supercharge Your Tech Career?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '650px' }}>
            Get instant transparent resume-to-job match scores, AI bullet point enhancements, and personalized study roadmaps right now.
          </p>
          <button
            onClick={handleGetStarted}
            className="btn-primary"
            style={{ fontSize: '1.15rem', padding: '1rem 2.6rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            {token ? 'Go to Dashboard' : 'Get Started Free'} <ArrowRight size={22} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '3rem 2rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          background: 'rgba(9, 13, 22, 0.8)',
        }}
      >
        <p>© 2026 AI Career Assistant. Built with FastAPI & React.</p>
      </footer>
    </div>
  );
};
