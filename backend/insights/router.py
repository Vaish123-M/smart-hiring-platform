from fastapi import APIRouter, HTTPException
from typing import Optional, List
from .schemas import (
    KeywordGapRequest, KeywordGapAnalysis,
    JobRoleMatchRequest, JobRoleMatchResponse,
    CareerPathRequest, CareerPathResponse,
    KeywordGap, JobRole, CareerPath
)
from .analyzer import analyze_keyword_gaps, match_job_roles, suggest_career_paths

router = APIRouter(prefix="/insights", tags=["insights"])


@router.post("/keyword-gaps", response_model=KeywordGapAnalysis)
async def analyze_gaps(request: KeywordGapRequest):
    """
    Analyze keyword gaps between resume and job description.
    
    Identifies missing technical skills, soft skills, and domain knowledge.
    Provides importance scoring and recommendations.
    """
    try:
        if not request.resume_text or not request.job_description:
            raise ValueError("Resume text and job description are required")
        
        missing_keywords, gap_score, critical_gaps, recommendations = analyze_keyword_gaps(
            request.resume_text,
            request.job_description
        )
        
        gap_objects = [
            KeywordGap(
                keyword=kw["keyword"],
                category=kw["category"],
                importance=kw["importance"],
                frequency_in_jd=kw["frequency_in_jd"]
            )
            for kw in missing_keywords[:15]  # Top 15 gaps
        ]
        
        return KeywordGapAnalysis(
            missing_keywords=gap_objects,
            total_gap_score=gap_score,
            critical_gaps=critical_gaps,
            recommendations=recommendations
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error analyzing keyword gaps: {str(e)}")


@router.post("/job-role-match", response_model=JobRoleMatchResponse)
async def get_job_role_matches(request: JobRoleMatchRequest):
    """
    Match resume to relevant job roles based on skills and experience.
    
    Returns top matching roles with skill overlap and experience level assessment.
    """
    try:
        if not request.resume_text:
            raise ValueError("Resume text is required")
        
        top_roles, current_level, confidence = match_job_roles(
            request.resume_text,
            request.skills_extracted
        )
        
        role_objects = [
            JobRole(
                title=role["title"],
                match_score=role["match_score"],
                required_skills=role["required_skills"],
                your_skills=role["your_skills"],
                skill_overlap=role["skill_overlap"]
            )
            for role in top_roles
        ]
        
        return JobRoleMatchResponse(
            top_roles=role_objects,
            current_level=current_level,
            confidence=confidence
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error matching job roles: {str(e)}")


@router.post("/career-paths", response_model=CareerPathResponse)
async def get_career_suggestions(request: CareerPathRequest):
    """
    Suggest career progression paths based on current resume and experience.
    
    Provides skill development plan and next career moves with resources.
    """
    try:
        if not request.resume_text:
            raise ValueError("Resume text is required")
        
        current_trajectory, recommended_paths, skill_plan = suggest_career_paths(
            request.resume_text,
            request.skills_extracted,
            request.experience_years
        )
        
        path_objects = [
            CareerPath(
                current_role=path["current_role"],
                next_role=path["next_role"],
                skill_gaps=path["skill_gaps"],
                experience_needed=path["experience_needed"],
                learning_resources=path["learning_resources"]
            )
            for path in recommended_paths
        ]
        
        return CareerPathResponse(
            current_trajectory=current_trajectory,
            recommended_paths=path_objects,
            skill_development_plan=skill_plan
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error suggesting career paths: {str(e)}")
