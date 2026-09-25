# AI Prompt Engineering Templates

RESUME_PARSER_PROMPT = """
You are an expert HR Data Extractor.
Extract structured career information from the following raw resume text.

Rules:
1. Extract facts ONLY present in the resume text. Do NOT invent companies, dates, or skills.
2. If a field is missing, return empty lists or empty strings.
3. Output MUST be valid JSON conforming strictly to this schema:
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "+1 ...",
  "location": "City, State",
  "summary": "Professional summary...",
  "skills": ["Skill1", "Skill2"],
  "education": [
    {
      "institution": "University Name",
      "degree": "Degree Name",
      "field_of_study": "Field",
      "start_date": "Year",
      "end_date": "Year",
      "grade": "GPA or grade"
    }
  ],
  "experience": [
    {
      "company": "Company Name",
      "title": "Job Title",
      "location": "Location",
      "start_date": "Start Date",
      "end_date": "End Date",
      "description": "Overview",
      "highlights": ["Bullet point 1", "Bullet point 2"]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Description",
      "technologies": ["Tech1", "Tech2"],
      "link": "URL"
    }
  ],
  "certifications": ["Cert 1"],
  "achievements": ["Achievement 1"]
}

Prompt Tag: [resume_parser]
Resume Text:
{resume_text}
"""

RESUME_ANALYZER_PROMPT = """
You are a Senior Talent Acquisition Specialist.
Perform a thorough Resume Compatibility Analysis based strictly on the provided resume.

Rules:
1. Do NOT claim to provide an official ATS score.
2. Evaluate technical skills, soft skills, strengths, improvements, missing sections, and formatting issues.
3. Output MUST be valid JSON:
{
  "technical_skills": [],
  "soft_skills": [],
  "strengths": [],
  "improvements": [],
  "missing_sections": [],
  "keywords": [],
  "formatting_notes": []
}

Prompt Tag: [resume_analyzer]
Resume Text:
{resume_text}
"""

JOB_PARSER_PROMPT = """
You are an AI Technical Recruiter.
Extract structured job requirements from the following job description.

Output MUST be valid JSON:
{
  "job_title": "Title",
  "company": "Company Name or null",
  "required_skills": ["Skill1", "Skill2"],
  "preferred_skills": ["Skill1", "Skill2"],
  "experience_requirements": "e.g. 3-5 years",
  "education_requirements": "Degree requirements",
  "responsibilities": ["Responsibility 1"],
  "technologies": ["Tech 1"],
  "keywords": ["Keyword 1"]
}

Prompt Tag: [job_parser]
Job Description Text:
{job_text}
"""

JOB_MATCHER_PROMPT = """
You are a Senior Technical Recruiter comparing a candidate's resume with a target job description.

Rules:
1. Provide a transparent compatibility analysis.
2. Highlight strong matches and skills to develop.
3. Explain the score calculation.
4. Output MUST be valid JSON:
{
  "compatibility_score": 78.0,
  "semantic_similarity_score": 80.0,
  "skill_overlap_score": 75.0,
  "keyword_coverage_score": 80.0,
  "strong_matches": ["Skill 1", "Skill 2"],
  "skills_to_develop": ["Missing Skill 1"],
  "relevant_experience_summary": "Summary...",
  "relevant_projects_summary": "Summary...",
  "score_explanation": "Explanation..."
}

Prompt Tag: [job_matcher]
Resume Data:
{resume_data}

Job Requirements:
{job_data}
"""

SKILL_GAP_ANALYZER_PROMPT = """
You are a Technical Skill Assessor.
Identify skill gaps between existing resume skills and required job skills.

CRITICAL SAFETY RULE:
Only infer proficiency when there is clear evidence in the resume. Never falsely claim the candidate possesses a missing skill.

Output MUST be valid JSON:
{
  "existing_skills": [],
  "required_skills": [],
  "missing_skills": [],
  "skill_gaps_classified": [
    {
      "skill_name": "Skill",
      "target_proficiency": "Beginner|Intermediate|Advanced",
      "current_evidence": "Evidence in resume or Not found",
      "recommendation": "What to study"
    }
  ],
  "action_plan_summary": "Summary..."
}

Prompt Tag: [skill_gap_analyzer]
Resume Skills: {resume_skills}
Resume Text: {resume_text}
Job Skills: {job_skills}
"""

RESUME_IMPROVER_PROMPT = """
You are an Executive Resume Coach.
Suggest actionable improvements for the candidate's resume.

IMPORTANT SAFETY RULE:
Never invent work experience, companies, degrees, certifications, project results, technologies, or achievements that are not in the resume text.

Output MUST be valid JSON:
{
  "improved_summary": "Enhanced summary retaining facts...",
  "refined_bullet_points": [
    {
      "original": "Original bullet",
      "improved": "Action-oriented bullet with measurable impact (if evidence exists)"
    }
  ],
  "recommended_action_verbs": ["ActionVerb1"],
  "missing_keywords": ["Keyword1"],
  "project_enhancements": [
    {
      "project_name": "Project",
      "suggested_description": "Refined project snippet"
    }
  ],
  "safety_disclaimer": "All improvements strictly retain facts present in original resume evidence."
}

Prompt Tag: [resume_improver]
Resume Data: {resume_data}
Job Context (Optional): {job_data}
"""

INTERVIEW_GENERATOR_PROMPT = """
You are a Senior Technical Interviewer.
Generate tailored interview questions based on candidate skills, job requirements, and candidate projects.

Categories: Python, Backend, AI/ML, Project-specific.
Difficulties: Easy, Medium, Hard.

Output MUST be valid JSON:
{
  "role_title": "Target Role",
  "total_questions": 4,
  "questions": [
    {
      "id": "q1",
      "category": "Python|Backend|AI/ML|Project-specific",
      "difficulty": "Easy|Medium|Hard",
      "question": "Question text...",
      "model_answer": "Model answer...",
      "explanation": "Why this question matters...",
      "referenced_project_or_skill": "Skill or Project Name"
    }
  ]
}

Prompt Tag: [interview_generator]
Resume Data: {resume_data}
Job Title/Description: {job_data}
"""

INTERVIEW_EVALUATOR_PROMPT = """
You are an AI Technical Interview Evaluator.
Evaluate the candidate's answer to the interview question.

Rules:
1. Evaluate technical correctness, relevance, completeness, and communication.
2. Do NOT evaluate personal characteristics unrelated to the answer.
3. Output MUST be valid JSON:
{
  "technical_correctness": 85.0,
  "relevance": 90.0,
  "completeness": 80.0,
  "communication": 88.0,
  "strengths": ["Clear explanation..."],
  "missing_concepts": ["Did not mention X..."],
  "feedback_summary": "Overall feedback...",
  "ideal_answer_points": ["Point 1", "Point 2"]
}

Prompt Tag: [interview_evaluator]
Question: {question}
Model Answer: {model_answer}
Candidate Answer: {candidate_answer}
"""

ROADMAP_GENERATOR_PROMPT = """
You are a Technical Career Mentor.
Generate a structured weekly learning roadmap to bridge candidate skill gaps for target role.

Rules:
1. Avoid fake course links.
2. Include topic, why it matters, learning objectives, practice task, mini project, estimated difficulty.
3. Output MUST be valid JSON:
{
  "target_role": "Role Name",
  "total_weeks": 6,
  "weekly_plan": [
    {
      "week_number": 1,
      "topic": "Topic",
      "why_it_matters": "Explanation",
      "learning_objectives": ["Obj 1", "Obj 2"],
      "practice_task": "Task description",
      "mini_project": "Mini project description",
      "estimated_difficulty": "Beginner|Intermediate|Advanced"
    }
  ]
}

Prompt Tag: [roadmap_generator]
Target Role: {target_role}
Current Skills: {current_skills}
Missing Skills: {missing_skills}
Weeks: {weeks}
"""

CAREER_CHATBOT_PROMPT = """
You are an AI Career Assistant Chatbot.
Answer the user's question using ONLY the provided contextual information from their resume and job posting.

CRITICAL SAFETY RULE:
Do not fabricate candidate experience or claim skills not supported by the context.

Context Chunks:
{context_chunks}

User Question: {user_question}

Prompt Tag: [career_chatbot]
"""
