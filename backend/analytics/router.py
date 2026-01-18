 # Analytics APIs
from fastapi import APIRouter
from pydantic import BaseModel
from analytics.services import get_top_skills, get_match_distribution, extract_skills_from_text
from analytics.schemas import SkillAnalytics, MatchDistribution

router = APIRouter(prefix="/analytics", tags=["Analytics"])

class ResumeText(BaseModel):
    resume_text: str

@router.get("/top-skills", response_model=SkillAnalytics)
def top_skills():
    return {"skill_counts": get_top_skills()}

@router.get("/match-distribution", response_model=MatchDistribution)
def match_distribution():
    return {"ranges": get_match_distribution()}

@router.post("/extract-skills")
def extract_skills(data: ResumeText):
    """Extract skills from resume text"""
    skills = extract_skills_from_text(data.resume_text)
    return skills
