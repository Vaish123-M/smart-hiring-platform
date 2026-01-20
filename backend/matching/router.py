from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from matching.schemas import ATSRequest, ATSResponse, JDMatchRequest, JDMatchResponse
from matching.ats_engine import calculate_ats_score
from matching.jd_matcher import (
    calculate_match_percentage,
    extract_text_from_upload,
    extract_text_from_resume_upload,
    fetch_text_from_url,
)

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


@router.post("/jd-upload")
async def jd_upload(file: UploadFile = File(...)):
    try:
        text = extract_text_from_upload(file)
        return {"job_description": text}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to process job description file")


@router.post("/jd-fetch")
async def jd_fetch(payload: dict):
    url = payload.get("url", "")
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")
    try:
        text = fetch_text_from_url(url)
        return {"job_description": text}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch job description")


@router.post("/job-match-analyze", response_model=JDMatchResponse)
async def job_match_analyze(
    jd_text: str = Form(None),
    resume_text: str = Form(None),
    jd_file: UploadFile = File(None),
    resume_file: UploadFile = File(None),
):
    """Analyze JD and resume to compute ATS match and insights."""
    if not jd_text and jd_file is None:
        raise HTTPException(status_code=400, detail="Job description is required (text or file)")
    if not resume_text and resume_file is None:
        raise HTTPException(status_code=400, detail="Resume is required (text or file)")

    try:
        if jd_file:
            jd_text = extract_text_from_upload(jd_file)
        if resume_file:
            resume_text = extract_text_from_resume_upload(resume_file)

        if not jd_text or not jd_text.strip():
            raise HTTPException(status_code=400, detail="Job description is empty after parsing")
        if not resume_text or not resume_text.strip():
            raise HTTPException(status_code=400, detail="Resume text is empty after parsing")

        return calculate_match_percentage(
            resume_text=resume_text,
            job_description=jd_text,
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to analyze job match")
