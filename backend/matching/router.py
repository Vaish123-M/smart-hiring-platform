from fastapi import APIRouter, UploadFile, File, HTTPException
from matching.schemas import ATSRequest, ATSResponse, JDMatchRequest, JDMatchResponse
from matching.ats_engine import calculate_ats_score
from matching.jd_matcher import calculate_match_percentage, extract_text_from_upload, fetch_text_from_url

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
