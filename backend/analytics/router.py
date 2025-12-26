 # Analytics APIs
from fastapi import APIRouter
from analytics.services import get_top_skills, get_match_distribution
from analytics.schemas import SkillAnalytics, MatchDistribution

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/top-skills", response_model=SkillAnalytics)
def top_skills():
    return {"skill_counts": get_top_skills()}

@router.get("/match-distribution", response_model=MatchDistribution)
def match_distribution():
    return {"ranges": get_match_distribution()}
