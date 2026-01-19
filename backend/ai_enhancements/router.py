from fastapi import APIRouter, HTTPException
from .schemas import (
    ResumeImprovementRequest, ResumeImprovementResponse,
    CoverLetterRequest, CoverLetterResponse,
    InterviewPrepRequest, InterviewPrepResponse,
    ResumeSuggestion, SuggestionItem, InterviewQuestion
)
from .generator import analyze_resume_for_improvements, generate_cover_letter, generate_interview_prep

router = APIRouter(prefix="/ai", tags=["ai-enhancements"])


@router.post("/resume-improvements", response_model=ResumeImprovementResponse)
async def get_resume_improvements(request: ResumeImprovementRequest):
    """
    Analyze resume and provide AI-powered improvement suggestions.
    
    Identifies weak action verbs, missing metrics, formatting issues,
    and suggests specific improvements to increase ATS score and impact.
    """
    try:
        if not request.resume_text:
            raise ValueError("Resume text is required")
        
        suggestions, improvement_potential, top_improvements, estimated_impact = analyze_resume_for_improvements(
            request.resume_text,
            request.job_description
        )
        
        suggestion_objects = [
            ResumeSuggestion(
                section=s["section"],
                line_number=s["line_number"],
                suggestions=[
                    SuggestionItem(
                        original=item["original"],
                        suggested=item["suggested"],
                        reason=item["reason"],
                        improvement_type=item["improvement_type"]
                    )
                    for item in s["suggestions"]
                ],
                confidence=s["confidence"]
            )
            for s in suggestions
        ]
        
        return ResumeImprovementResponse(
            suggestions=suggestion_objects,
            overall_score=improvement_potential,
            top_improvements=top_improvements,
            estimated_impact=estimated_impact
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error analyzing resume: {str(e)}")


@router.post("/cover-letter", response_model=CoverLetterResponse)
async def generate_cover_letter_handler(request: CoverLetterRequest):
    """
    Generate a customized, AI-powered cover letter based on resume and job description.
    
    Tailors content to position, company, and highlights relevant skills
    and achievements from the provided resume.
    """
    try:
        if not request.resume_text or not request.job_description:
            raise ValueError("Resume text and job description are required")
        
        if not request.company_name or not request.position_title:
            raise ValueError("Company name and position title are required")
        
        cover_letter, sections, key_highlights, customization = generate_cover_letter(
            request.resume_text,
            request.job_description,
            request.company_name,
            request.position_title,
            request.tone
        )
        
        return CoverLetterResponse(
            cover_letter=cover_letter,
            sections=sections,
            key_highlights=key_highlights,
            customization_level=customization
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error generating cover letter: {str(e)}")


@router.post("/interview-prep", response_model=InterviewPrepResponse)
async def get_interview_prep(request: InterviewPrepRequest):
    """
    Generate interview preparation materials including likely questions,
    talking points, and strategies based on resume and job description.
    """
    try:
        if not request.resume_text:
            raise ValueError("Resume text is required")
        
        questions, talking_points, skills_to_highlight, common_questions = generate_interview_prep(
            request.resume_text,
            request.job_description,
            request.focus_areas
        )
        
        question_objects = [
            InterviewQuestion(
                question=q["question"],
                category=q["category"],
                topic=q["topic"],
                suggested_approach=q["suggested_approach"]
            )
            for q in questions
        ]
        
        common_q_objects = [
            InterviewQuestion(
                question=q["question"],
                category=q["category"],
                topic=q["topic"],
                suggested_approach=q["suggested_approach"]
            )
            for q in common_questions
        ]
        
        return InterviewPrepResponse(
            questions=question_objects,
            key_talking_points=talking_points,
            skills_to_highlight=skills_to_highlight,
            common_questions=common_q_objects
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error preparing interview materials: {str(e)}")
