import io
import re
from typing import List, Dict

import pdfplumber
from docx import Document

from matching.ats_engine import calculate_ats_score


def extract_experience_years(text: str) -> int:
    """Extract years of experience from text"""
    patterns = [
        r'(\d+)\+?\s*years?\s+(?:of\s+)?experience',
        r'experience[:\s]+(\d+)\+?\s*years?',
        r'(\d+)\+?\s*yrs?\s+(?:of\s+)?experience'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text.lower())
        if match:
            return int(match.group(1))
    
    return 0


def _simple_recommendations(missing_skills: List[str], matched_skills: List[str]) -> List[str]:
    if not missing_skills:
        return ["Great match! Your skills align well with the JD."]
    recs = ["Focus on these missing skills to improve your match: " + ", ".join(missing_skills[:5])]
    if len(matched_skills) < 5:
        recs.append("Add more of the JD's required technologies to boost your score.")
    return recs


def calculate_match_percentage(resume_text: str, job_description: str):
    """Use the shared ATS pipeline to produce match stats for the existing endpoint."""
    print(f"\n🔍 DEBUG: calculate_match_percentage called")
    print(f"📄 Resume length: {len(resume_text)}")
    print(f"📋 JD length: {len(job_description)}")
    
    # Ensure both texts go through identical cleaning and skill extraction
    ats_result = calculate_ats_score(resume_text=resume_text, job_description=job_description)
    
    print(f"📊 ATS Result: {ats_result}")

    matched_skills = ats_result["matched_skills"]
    missing_skills = ats_result["missing_skills"]
    total_jd_skills = ats_result["total_jd_skills"]

    # Experience analysis retained (lightweight)
    resume_exp = extract_experience_years(resume_text)
    jd_exp = extract_experience_years(job_description)
    exp_match = jd_exp == 0 or resume_exp >= jd_exp
    exp_gap = 0 if exp_match else max(0, jd_exp - resume_exp)

    # Basic skill gap analysis aligned to new scoring
    skill_gap_analysis = {
        "total_required_skills": total_jd_skills,
        "matched_count": len(matched_skills),
        "missing_count": len(missing_skills),
        "match_ratio": ats_result["ats_score"],
        "categories": {},
    }

    experience_match = {
        "resume_years": resume_exp,
        "required_years": jd_exp,
        "meets_requirement": exp_match,
        "gap_years": exp_gap,
    }

    return {
        # Preserve existing field name for UI while aligning with ATS score
        "match_percentage": ats_result["ats_score"],
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "recommendations": _simple_recommendations(missing_skills, matched_skills),
        "skill_gap_analysis": skill_gap_analysis,
        "experience_match": experience_match,
    }


def _extract_text_from_bytes(content: bytes, filename: str) -> str:
    """Extract text from raw bytes for PDF, DOCX, or TXT."""
    lower_name = filename.lower()

    if lower_name.endswith('.txt'):
        try:
            return content.decode('utf-8', errors='ignore')
        except Exception:
            return content.decode('latin-1', errors='ignore')

    if lower_name.endswith('.pdf'):
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            pages = [page.extract_text() or '' for page in pdf.pages]
            return '\n'.join(pages)

    if lower_name.endswith('.docx'):
        document = Document(io.BytesIO(content))
        return '\n'.join([p.text for p in document.paragraphs])

    raise ValueError('Unsupported file type. Please upload PDF, DOCX, or TXT.')


def extract_text_from_upload(file) -> str:
    """Extract text from an uploaded JD file (PDF/DOCX/TXT)."""
    content = file.file.read()
    return _extract_text_from_bytes(content, file.filename)


def extract_text_from_resume_upload(file) -> str:
    """Extract text from an uploaded resume file (PDF/DOCX/TXT)."""
    content = file.file.read()
    return _extract_text_from_bytes(content, file.filename)


def fetch_text_from_url(url: str) -> str:
    """Fetch JD text from a URL (basic HTTP GET)."""
    import urllib.request

    with urllib.request.urlopen(url) as response:
        if response.status != 200:
            raise ValueError('Could not fetch job description from URL')
        data = response.read()
        try:
            return data.decode('utf-8', errors='ignore')
        except Exception:
            return data.decode('latin-1', errors='ignore')
