from fastapi import APIRouter
from matching.schemas import ATSRequest, ATSResponse, JDMatchRequest, JDMatchResponse
from matching.ats_engine import calculate_ats_score
from matching.jd_matcher import calculate_match_percentage

router = APIRouter(prefix="/ats", tags=["ATS Scoring"])

@router.post("/score", response_model=ATSResponse)
def ats_score(data: ATSRequest):
    return calculate_ats_score(
        resume_text=data.resume_text,
        job_description=data.job_description
    )

@router.post("/match", response_model=JDMatchResponse)
def jd_resume_match(data: JDMatchRequest):
    return calculate_match_percentage(
        resume_text=data.resume_text,
        job_description=data.job_description
    )
