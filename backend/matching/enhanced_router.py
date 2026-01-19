"""
Enhanced matching router with JD comparison and ATS scoring
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from matching.ats_engine import calculate_ats_score
from matching.jd_matcher import calculate_match_percentage
from matching.skills import TECH_SKILLS

router = APIRouter(prefix="/matching", tags=["Matching"])

class JDMatchRequest(BaseModel):
    resume_text: str
    job_description: str

class MatchResponse(BaseModel):
    match_percentage: float
    ats_score: float
    matched_skills: list
    missing_skills: list
    resume_skills: dict

@router.post("/jd-match")
def match_resume_to_jd(data: JDMatchRequest):
    """Match resume to job description with detailed analysis"""
    try:
        # Calculate basic match percentage
        match_percentage = calculate_match_percentage(
            resume_text=data.resume_text,
            job_description=data.job_description
        )
        
        # Calculate ATS score
        ats_score = calculate_ats_score(
            resume_text=data.resume_text,
            job_description=data.job_description
        )
        
        # Extract skills from resume
        resume_text_lower = data.resume_text.lower()
        resume_skills = {}
        for skill in TECH_SKILLS:
            count = resume_text_lower.count(skill.lower())
            if count > 0:
                resume_skills[skill] = count
        
        # Extract skills from JD
        jd_lower = data.job_description.lower()
        jd_skills = set()
        for skill in TECH_SKILLS:
            if skill.lower() in jd_lower:
                jd_skills.add(skill)
        
        # Find matched and missing skills
        matched_skills = [s for s in resume_skills.keys() if s in jd_skills]
        missing_skills = list(jd_skills - set(resume_skills.keys()))
        
        return {
            "match_percentage": match_percentage if isinstance(match_percentage, (int, float)) else match_percentage.get("match_percentage", 0),
            "ats_score": ats_score.get("ats_score", 0) if isinstance(ats_score, dict) else 0,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "resume_skills": resume_skills
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/filter-skills")
def filter_and_sort_skills(
    skills: dict,
    min_count: int = 0,
    sort_by: str = "frequency",
    order: str = "desc"
):
    """Filter and sort skills by various criteria"""
    try:
        # Filter by minimum count
        filtered = {k: v for k, v in skills.items() if v >= min_count}
        
        # Sort
        if sort_by == "frequency":
            sorted_skills = sorted(
                filtered.items(),
                key=lambda x: x[1],
                reverse=(order == "desc")
            )
        else:  # sort by name
            sorted_skills = sorted(
                filtered.items(),
                key=lambda x: x[0],
                reverse=(order == "desc")
            )
        
        return dict(sorted_skills)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
