from fastapi import APIRouter, UploadFile, File
from resume.parser import extract_text_from_pdf
from resume.cleaner import clean_text
from database.mongo import resume_collection

router = APIRouter(prefix="/resume", tags=["Resume"])

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    file_bytes = await file.read()
    raw_text = extract_text_from_pdf(file_bytes)
    cleaned_text = clean_text(raw_text)

    resume_collection.insert_one({
        "filename": file.filename,
        "raw_text": raw_text,
        "cleaned_text": cleaned_text
    })

    return {
        "filename": file.filename,
        "message": "Resume uploaded and processed successfully"
    }
