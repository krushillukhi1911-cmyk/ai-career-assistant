export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface StructuredResumeData {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  skills: string[];
  education: Array<{
    institution?: string;
    degree?: string;
    field_of_study?: string;
    start_date?: string;
    end_date?: string;
    grade?: string;
  }>;
  experience: Array<{
    company?: string;
    title?: string;
    location?: string;
    start_date?: string;
    end_date?: string;
    description?: string;
    highlights: string[];
  }>;
  projects: Array<{
    name?: string;
    description?: string;
    technologies: string[];
    link?: string;
  }>;
  certifications: string[];
  achievements: string[];
}

export interface ResumeAnalysis {
  technical_skills: string[];
  soft_skills: string[];
  strengths: string[];
  improvements: string[];
  missing_sections: string[];
  keywords: string[];
  formatting_notes: string[];
}

export interface Resume {
  id: string;
  user_id: string;
  filename: string;
  file_type: string;
  extracted_text: string;
  structured_data?: StructuredResumeData;
  analysis?: ResumeAnalysis;
  created_at: string;
}

export interface StructuredJobData {
  job_title: string;
  company?: string;
  required_skills: string[];
  preferred_skills: string[];
  experience_requirements?: string;
  education_requirements?: string;
  responsibilities: string[];
  technologies: string[];
  keywords: string[];
}

export interface JobDescription {
  id: string;
  user_id: string;
  title: string;
  company?: string;
  description: string;
  structured_data?: StructuredJobData;
  created_at: string;
}

export interface MatchingResult {
  id?: string;
  resume_id: string;
  job_id: string;
  compatibility_score: number;
  semantic_similarity_score: number;
  skill_overlap_score: number;
  keyword_coverage_score: number;
  strong_matches: string[];
  skills_to_develop: string[];
  relevant_experience_summary: string;
  relevant_projects_summary: string;
  score_explanation: string;
  created_at?: string;
}

export interface SkillGapItem {
  skill_name: string;
  target_proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
  current_evidence: string;
  recommendation: string;
}

export interface SkillGapAnalysis {
  existing_skills: string[];
  required_skills: string[];
  missing_skills: string[];
  skill_gaps_classified: SkillGapItem[];
  action_plan_summary: string;
}

export interface ResumeImprovement {
  improved_summary: string;
  refined_bullet_points: Array<{ original: string; improved: string }>;
  recommended_action_verbs: string[];
  missing_keywords: string[];
  project_enhancements: Array<{ project_name: string; suggested_description: string }>;
  safety_disclaimer: string;
}

export interface QuestionItem {
  id: string;
  category: string;
  difficulty: string;
  question: string;
  model_answer: string;
  explanation: string;
  referenced_project_or_skill?: string;
}

export interface QuestionEvaluation {
  technical_correctness: number;
  relevance: number;
  completeness: number;
  communication: number;
  strengths: string[];
  missing_concepts: string[];
  feedback_summary: string;
  ideal_answer_points: string[];
}

export interface MockInterviewNextStep {
  session_id: string;
  status: 'in_progress' | 'completed';
  question_number: number;
  total_questions: number;
  current_question?: QuestionItem;
  last_evaluation?: QuestionEvaluation;
  final_scorecard?: {
    overall_score: number;
    technical_correctness: number;
    relevance: number;
    completeness: number;
    communication: number;
    summary: string;
  };
}

export interface RoadmapWeekItem {
  week_number: number;
  topic: string;
  why_it_matters: string;
  learning_objectives: string[];
  practice_task: string;
  mini_project: string;
  estimated_difficulty: string;
}

export interface Roadmap {
  id?: string;
  target_role: string;
  total_weeks: number;
  weekly_plan: RoadmapWeekItem[];
  created_at?: string;
}

export interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  sources?: Array<{ source_type: string; content_snippet: string; relevance_score: number }>;
}
