import axios from 'axios';
import {
  User,
  Resume,
  JobDescription,
  MatchingResult,
  SkillGapAnalysis,
  ResumeImprovement,
  QuestionItem,
  MockInterviewNextStep,
  Roadmap,
  ChatMessage,
} from '../types';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || ''}/api/v1`;

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Authorization header interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: async (email: string, password: string) => {
    const resp = await api.post('/auth/register', { email, password });
    if (resp.data.access_token) {
      localStorage.setItem('token', resp.data.access_token);
    }
    return resp.data;
  },
  login: async (email: string, password: string) => {
    const resp = await api.post('/auth/login/json', { email, password });
    if (resp.data.access_token) {
      localStorage.setItem('token', resp.data.access_token);
    }
    return resp.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
  getMe: async (): Promise<User> => {
    const resp = await api.get('/auth/me');
    return resp.data;
  },
};

export const resumeService = {
  upload: async (file: File): Promise<Resume> => {
    const formData = new FormData();
    formData.append('file', file);
    const resp = await api.post('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return resp.data;
  },
  list: async (): Promise<Resume[]> => {
    const resp = await api.get('/resumes');
    return resp.data;
  },
  get: async (id: string): Promise<Resume> => {
    const resp = await api.get(`/resumes/${id}`);
    return resp.data;
  },
  improve: async (resumeId: string, jobId?: string): Promise<ResumeImprovement> => {
    const resp = await api.post('/resume/improve', { resume_id: resumeId, job_id: jobId });
    return resp.data;
  },
};

export const jobService = {
  analyze: async (description: string, title?: string, company?: string): Promise<JobDescription> => {
    const resp = await api.post('/jobs/analyze', { description, title, company });
    return resp.data;
  },
  list: async (): Promise<JobDescription[]> => {
    const resp = await api.get('/jobs');
    return resp.data;
  },
  get: async (id: string): Promise<JobDescription> => {
    const resp = await api.get(`/jobs/${id}`);
    return resp.data;
  },
};

export const matchingService = {
  analyze: async (resumeId: string, jobId: string): Promise<MatchingResult> => {
    const resp = await api.post('/matching/analyze', { resume_id: resumeId, job_id: jobId });
    return resp.data;
  },
};

export const skillService = {
  analyzeGap: async (resumeId: string, jobId: string): Promise<SkillGapAnalysis> => {
    const resp = await api.post('/skills/gap-analysis', { resume_id: resumeId, job_id: jobId });
    return resp.data;
  },
};

export const interviewService = {
  generateQuestions: async (
    roleTitle: string,
    resumeId?: string,
    jobId?: string,
    category: string = 'all'
  ): Promise<{ role_title: string; total_questions: number; questions: QuestionItem[] }> => {
    const resp = await api.post('/interview/questions', {
      role_title: roleTitle,
      resume_id: resumeId,
      job_id: jobId,
      category,
    });
    return resp.data;
  },
  startMock: async (
    roleTitle: string,
    resumeId?: string,
    jobId?: string
  ): Promise<MockInterviewNextStep> => {
    const resp = await api.post('/interview/start', {
      role_title: roleTitle,
      resume_id: resumeId,
      job_id: jobId,
    });
    return resp.data;
  },
  submitAnswer: async (sessionId: string, answerText: string): Promise<MockInterviewNextStep> => {
    const resp = await api.post('/interview/answer', {
      session_id: sessionId,
      answer_text: answerText,
    });
    return resp.data;
  },
};

export const roadmapService = {
  generate: async (
    targetRole: string,
    resumeId?: string,
    jobId?: string,
    weeks: number = 6
  ): Promise<Roadmap> => {
    const resp = await api.post('/roadmap/generate', {
      target_role: targetRole,
      resume_id: resumeId,
      job_id: jobId,
      weeks,
    });
    return resp.data;
  },
};

export const chatService = {
  sendMessage: async (
    message: string,
    resumeId?: string,
    jobId?: string
  ): Promise<{ answer: string; context_sources: any[] }> => {
    const resp = await api.post('/chat', {
      message,
      resume_id: resumeId,
      job_id: jobId,
    });
    return resp.data;
  },
};

export const demoService = {
  seed: async (): Promise<{ message: string; resume_id: string; job_id: string }> => {
    const resp = await api.post('/seed/seed-demo-data');
    return resp.data;
  },
};

