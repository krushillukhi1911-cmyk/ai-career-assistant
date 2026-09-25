import React, { useState, useEffect } from 'react';
import { interviewService, resumeService, jobService } from '../services/api';
import { Resume, JobDescription, QuestionItem, MockInterviewNextStep } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { HelpCircle, Sparkles, Send, Play, CheckCircle, Award } from 'lucide-react';

const defaultFallbackQuestions: QuestionItem[] = [
  {
    id: "q1",
    category: "Python",
    difficulty: "Medium",
    question: "Explain the difference between sync and async handlers in FastAPI, and how Python GIL handles async I/O operations.",
    model_answer: "FastAPI async def endpoints run on the main asyncio event loop. For non-blocking I/O operations (like database calls with asyncpg), async endpoints allow concurrent execution. Sync def endpoints run in an external thread pool.",
    explanation: "Tests deep understanding of Python asyncio and FastAPI performance execution model.",
    referenced_project_or_skill: "FastAPI"
  },
  {
    id: "q2",
    category: "Backend",
    difficulty: "Hard",
    question: "How do you optimize slow PostgreSQL queries in an async SQLAlchemy application?",
    model_answer: "Analyze execution plans using EXPLAIN ANALYZE, add index coverage, select only required columns, use joinedload/selectinload to eliminate N+1 queries, and utilize async connection pooling.",
    explanation: "Evaluates database tuning skills.",
    referenced_project_or_skill: "PostgreSQL"
  },
  {
    id: "q3",
    category: "AI/ML",
    difficulty: "Medium",
    question: "How does vector similarity search with FAISS work when performing RAG document retrieval?",
    model_answer: "Document text chunks are converted to dense vector embeddings using models like SentenceTransformers. FAISS indexing (e.g. Cosine distance) calculates vector proximity to locate relevant context chunks.",
    explanation: "Tests knowledge of RAG architecture.",
    referenced_project_or_skill: "FAISS & RAG"
  },
  {
    id: "q4",
    category: "Project-specific",
    difficulty: "Medium",
    question: "In your recent backend projects, how did you handle structured input validation and exception error handling?",
    model_answer: "Used Pydantic v2 schemas for strong type validation and custom FastAPI HTTP exception handlers to sanitize production error responses.",
    explanation: "Evaluates clean code and API design standards.",
    referenced_project_or_skill: "FastAPI & Pydantic"
  }
];

export const InterviewPage: React.FC = () => {
  const [roleTitle, setRoleTitle] = useState('Senior Python Developer');
  const [questions, setQuestions] = useState<QuestionItem[]>(defaultFallbackQuestions);
  const [activeTab, setActiveTab] = useState<'practice' | 'mock'>('practice');

  // Mock Interview Interactive State
  const [mockSession, setMockSession] = useState<MockInterviewNextStep | null>(null);
  const [answerInput, setAnswerInput] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    initQuestions();
  }, []);

  const initQuestions = async () => {
    try {
      const qData = await interviewService.generateQuestions(roleTitle);
      if (qData?.questions && qData.questions.length > 0) {
        setQuestions(qData.questions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    setGenerating(true);
    try {
      const qData = await interviewService.generateQuestions(roleTitle);
      if (qData?.questions && qData.questions.length > 0) {
        setQuestions(qData.questions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleStartMock = async () => {
    setLoading(true);
    try {
      const step = await interviewService.startMock(roleTitle);
      setMockSession(step);
      setActiveTab('mock');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mockSession || !answerInput.trim()) return;
    setSubmittingAnswer(true);
    try {
      const nextStep = await interviewService.submitAnswer(mockSession.session_id, answerInput);
      setMockSession(nextStep);
      setAnswerInput('');
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  if (loading) return <LoadingSpinner message="Generating AI interview questions..." />;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div className="glass-card responsive-flex-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>AI Technical Interview Simulator</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Generate tailored Python, Backend, & AI/ML questions or run an interactive mock interview.
          </p>
        </div>

        <div className="responsive-flex-stack" style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveTab('practice')}
            className={activeTab === 'practice' ? 'btn-primary responsive-btn-full' : 'btn-secondary responsive-btn-full'}
          >
            Question Bank
          </button>
          <button
            onClick={handleStartMock}
            className={activeTab === 'mock' ? 'btn-primary responsive-btn-full' : 'btn-secondary responsive-btn-full'}
          >
            <Play size={16} /> Start Interactive Mock
          </button>
        </div>
      </div>

      {activeTab === 'practice' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card responsive-flex-stack" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <input
              type="text"
              className="form-input"
              style={{ flex: 1 }}
              placeholder="Target Role (e.g. Senior Python Developer)"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
            />
            <button onClick={handleGenerateQuestions} disabled={generating} className="btn-primary responsive-btn-full">
              <Sparkles size={18} /> {generating ? 'Generating...' : 'Regenerate Questions'}
            </button>
          </div>

          {generating ? (
            <LoadingSpinner message="Formulating role-specific technical questions..." />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '20px' }}>
              {questions.map((q, idx) => (
                <div key={q.id || idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-primary">{q.category}</span>
                    <span
                      className={
                        q.difficulty === 'Hard'
                          ? 'badge badge-danger'
                          : q.difficulty === 'Medium'
                          ? 'badge badge-warning'
                          : 'badge badge-success'
                      }
                    >
                      {q.difficulty}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', lineHeight: '1.4' }}>{q.question}</h4>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '8px', fontSize: '0.88rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '4px' }}>Model Answer Point:</div>
                    <div style={{ color: 'var(--text-muted)' }}>{q.model_answer}</div>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    {q.explanation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Interactive Mock Interview Session Widget */
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {mockSession?.status === 'completed' ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px', padding: '20px' }}>
              <Award size={64} color="var(--accent-emerald)" />
              <h2 style={{ fontSize: '1.8rem' }} className="gradient-text">
                Mock Interview Completed!
              </h2>

              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                {mockSession.final_scorecard?.overall_score}%
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', width: '100%', maxWidth: '700px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Technical Correctness</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{mockSession.final_scorecard?.technical_correctness}%</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Relevance</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{mockSession.final_scorecard?.relevance}%</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Completeness</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{mockSession.final_scorecard?.completeness}%</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Communication</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{mockSession.final_scorecard?.communication}%</div>
                </div>
              </div>

              <button onClick={handleStartMock} className="btn-primary" style={{ marginTop: '12px' }}>
                Start Another Session
              </button>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span className="badge badge-primary">
                  Question {mockSession?.question_number} of {mockSession?.total_questions}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Interactive Interviewer
                </span>
              </div>

              {/* Current Question */}
              <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#a5b4fc' }}>
                  {mockSession?.current_question?.question}
                </h3>
              </div>

              {/* Last Evaluation Feedback if available */}
              {mockSession?.last_evaluation && (
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '16px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.88rem' }}>
                  <div style={{ fontWeight: 700, color: '#6ee7b7', marginBottom: '4px' }}>AI Feedback on Previous Answer:</div>
                  <div>{mockSession.last_evaluation.feedback_summary}</div>
                  <div style={{ marginTop: '6px', color: 'var(--text-muted)' }}>
                    Scores: Technical {mockSession.last_evaluation.technical_correctness}% | Relevance {mockSession.last_evaluation.relevance}%
                  </div>
                </div>
              )}

              {/* Answer Input */}
              <form onSubmit={handleSubmitAnswer} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <textarea
                  rows={5}
                  required
                  className="form-textarea"
                  placeholder="Type your technical answer here..."
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                />
                <button type="submit" disabled={submittingAnswer || !answerInput.trim()} className="btn-primary" style={{ alignSelf: 'flex-end' }}>
                  <Send size={18} /> {submittingAnswer ? 'Evaluating...' : 'Submit Answer'}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
