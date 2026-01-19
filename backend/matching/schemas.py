from pydantic import BaseModel
from typing import List, Dict, Any

class ATSRequest(BaseModel):
    resume_text: str
    job_description: str

class ATSResponse(BaseModel):
    ats_score: float
    matched_skills: list

class JDMatchRequest(BaseModel):
    resume_text: str
    job_description: str

class JDMatchResponse(BaseModel):
    match_percentage: float
    matched_skills: List[str]
    missing_skills: List[str]
    recommendations: List[str]
    skill_gap_analysis: Dict[str, Any]
    experience_match: Dict[str, Any]
