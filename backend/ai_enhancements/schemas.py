from pydantic import BaseModel
from typing import List, Dict, Optional

class SuggestionItem(BaseModel):
    original: str
    suggested: str
    reason: str
    improvement_type: str  # "action_verb", "quantification", "clarity", "keywords"

class ResumeSuggestion(BaseModel):
    section: str  # "summary", "experience", "skills", "education"
    line_number: int
    suggestions: List[SuggestionItem]
    confidence: float  # 0-1

class ResumeBulletSuggestion(BaseModel):
    improvement: str
    category: str  # "action_verb", "metrics", "impact", "keywords"
    example: str

class ResumeImprovementRequest(BaseModel):
    resume_text: str
    job_description: Optional[str] = None
    focus_area: Optional[str] = None  # "summary", "experience", "all"

class ResumeImprovementResponse(BaseModel):
    suggestions: List[ResumeSuggestion]
    overall_score: float  # 0-100 (improvement potential)
    top_improvements: List[str]
    estimated_impact: str  # "low", "medium", "high"

class CoverLetterRequest(BaseModel):
    resume_text: str
    job_description: str
    company_name: str
    position_title: str
    tone: Optional[str] = "professional"  # professional, friendly, formal

class CoverLetterResponse(BaseModel):
    cover_letter: str
    sections: Dict[str, str]  # opening, body, closing
    key_highlights: List[str]
    customization_level: str

class InterviewQuestion(BaseModel):
    question: str
    category: str  # "behavioral", "technical", "situational"
    topic: str
    suggested_approach: str

class InterviewPrepRequest(BaseModel):
    resume_text: str
    job_description: Optional[str] = None
    focus_areas: Optional[List[str]] = None

class InterviewPrepResponse(BaseModel):
    questions: List[InterviewQuestion]
    key_talking_points: List[str]
    skills_to_highlight: List[str]
    common_questions: List[InterviewQuestion]
