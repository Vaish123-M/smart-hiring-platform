from pydantic import BaseModel
from typing import List, Dict, Optional

class KeywordGapRequest(BaseModel):
    resume_text: str
    job_description: str

class KeywordGap(BaseModel):
    keyword: str
    category: str  # technical, soft, domain
    importance: float  # 0-1 scale
    frequency_in_jd: int

class KeywordGapAnalysis(BaseModel):
    missing_keywords: List[KeywordGap]
    total_gap_score: float  # 0-100
    critical_gaps: List[str]
    recommendations: List[str]

class JobRole(BaseModel):
    title: str
    match_score: float  # 0-100
    required_skills: List[str]
    your_skills: List[str]
    skill_overlap: float
    experience_match: str  # "junior", "mid", "senior"

class JobRoleMatchRequest(BaseModel):
    resume_text: str
    skills_extracted: Optional[List[str]] = None

class JobRoleMatchResponse(BaseModel):
    top_roles: List[JobRole]
    current_level: str  # junior, mid-level, senior
    confidence: float  # 0-1

class CareerPath(BaseModel):
    current_role: str
    next_role: str
    skill_gaps: List[str]
    experience_needed: str
    learning_resources: List[Dict[str, str]]  # name, url, type

class CareerPathRequest(BaseModel):
    resume_text: str
    skills_extracted: Optional[List[str]] = None
    experience_years: Optional[float] = None

class CareerPathResponse(BaseModel):
    current_trajectory: str
    recommended_paths: List[CareerPath]
    skill_development_plan: List[str]
