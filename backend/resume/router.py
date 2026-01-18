from fastapi import APIRouter, UploadFile, File, HTTPException
from database.mongo import resume_collection
from resume.parser import extract_text_from_pdf
from resume.cleaner import clean_text
from io import BytesIO
import traceback

router = APIRouter(prefix="/resume", tags=["Resume"])


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    """
    Upload and process a PDF resume.
    
    - Validates PDF file format
    - Extracts text using pdfplumber
    - Cleans text (lowercase, remove stopwords)
    - Stores both raw and cleaned text in MongoDB
    
    Returns:
        Success message with processing details
    """
    # Validate file type
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400, 
            detail="Only PDF files are allowed. Please upload a .pdf file."
        )

    try:
        # Read file bytes
        file_bytes = await file.read()
        
        if not file_bytes:
            raise HTTPException(
                status_code=400,
                detail="Empty file received. Please upload a valid PDF."
            )

        # Extract text using parser
        try:
            raw_text = extract_text_from_pdf(BytesIO(file_bytes))
        except Exception as parse_error:
            print(f"PDF Parsing Error: {parse_error}")
            raise HTTPException(
                status_code=400,
                detail=f"Failed to parse PDF: {str(parse_error)}"
            )

        # Validate extracted text
        if not raw_text or not raw_text.strip():
            raise HTTPException(
                status_code=400,
                detail="No text could be extracted from the PDF. The file may be scanned or empty."
            )

        # Clean the extracted text
        cleaned_text = clean_text(raw_text)
        
        if not cleaned_text:
            # If cleaning removes everything, at least keep raw text
            cleaned_text = raw_text.lower()

        # Store in MongoDB
        try:
            if resume_collection is None:
                raise HTTPException(
                    status_code=503,
                    detail="MongoDB is not available. Please start MongoDB service."
                )
                
            result = resume_collection.insert_one({
                "filename": file.filename,
                "resume_text": raw_text,
                "cleaned_text": cleaned_text,
                "text_length": len(raw_text),
                "cleaned_length": len(cleaned_text)
            })
            
            return {
                "message": "Resume uploaded and parsed successfully",
                "filename": file.filename,
                "resume_id": str(result.inserted_id),
                "resume_text": raw_text,
                "text_length": len(raw_text),
                "cleaned_length": len(cleaned_text)
            }
            
        except HTTPException:
            raise
        except Exception as db_error:
            error_msg = f"Database Error: {type(db_error).__name__}: {str(db_error)}"
            print(error_msg)
            print(traceback.format_exc())
            raise HTTPException(
                status_code=500,
                detail=f"Failed to store resume in database: {str(db_error)}"
            )

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
        
    except Exception as e:
        # Log unexpected errors with full traceback
        print("UNEXPECTED ERROR:")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=f"Resume processing failed: {str(e)}"
        )
