from pydantic import BaseModel

class ResumeResponse(BaseModel):
    filename: str
    extracted_text: str
