from fastapi import APIRouter, HTTPException
from .schemas import (
    SkillHeatmapRequest, SkillHeatmapResponse, SkillHeatmapData,
    TrendAnalysisRequest, TrendAnalysisResponse, ResumeTrendPoint,
    ResumeComparisonRequest, ResumeComparisonResponse, ResumeComparisonItem
)
from .analyzer import analyze_skill_heatmap, analyze_trends, compare_resumes

router = APIRouter(prefix="/analytics-advanced", tags=["advanced-analytics"])


@router.post("/skill-heatmap", response_model=SkillHeatmapResponse)
async def get_skill_heatmap(request: SkillHeatmapRequest):
    """
    Generate skill heatmap from multiple resumes.
    
    Identifies top skills, emerging trends, and skill relevance patterns.
    """
    try:
        if not request.resumes_data or len(request.resumes_data) == 0:
            raise ValueError("At least one resume is required")
        
        heatmap, top_skills, emerging, declining, recommendations = analyze_skill_heatmap(
            request.resumes_data
        )
        
        heatmap_objects = [
            SkillHeatmapData(
                skill=h["skill"],
                frequency=h["frequency"],
                ats_correlation=h["ats_correlation"],
                role_relevance=h["role_relevance"],
                growth_trend=h["growth_trend"]
            )
            for h in heatmap
        ]
        
        return SkillHeatmapResponse(
            heatmap_data=heatmap_objects,
            top_skills=top_skills,
            emerging_skills=emerging,
            declining_skills=declining,
            recommendations=recommendations
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error generating heatmap: {str(e)}")


@router.post("/trends", response_model=TrendAnalysisResponse)
async def get_trend_analysis(request: TrendAnalysisRequest):
    """
    Analyze ATS score and skill trends over time.
    
    Shows improvement patterns and provides recommendations.
    """
    try:
        if not request.resumes_history or len(request.resumes_history) == 0:
            raise ValueError("Resume history is required")
        
        trend_points, avg_ats, best_ats, improvement_rate, recommendations = analyze_trends(
            request.resumes_history
        )
        
        trend_objects = [
            ResumeTrendPoint(
                date=t["date"],
                ats_score=t["ats_score"],
                skill_count=t["skill_count"],
                resume_id=t["resume_id"]
            )
            for t in trend_points
        ]
        
        return TrendAnalysisResponse(
            trend_points=trend_objects,
            average_ats_score=avg_ats,
            best_ats_score=best_ats,
            improvement_rate=improvement_rate,
            recommendations=recommendations
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error analyzing trends: {str(e)}")


@router.post("/compare", response_model=ResumeComparisonResponse)
async def compare_resumes_handler(request: ResumeComparisonRequest):
    """
    Compare two resumes across multiple dimensions.
    
    Analyzes skills, content, action verbs, and quantification.
    Provides detailed comparison and recommendations.
    """
    try:
        if not request.resume1_text or not request.resume2_text:
            raise ValueError("Both resumes are required")
        
        comparisons, winner, r1_score, r2_score, recommendations = compare_resumes(
            request.resume1_text,
            request.resume2_text,
            request.job_description
        )
        
        comparison_objects = [
            ResumeComparisonItem(
                aspect=c["aspect"],
                resume1_score=c["resume1_score"],
                resume2_score=c["resume2_score"],
                winner=c["winner"],
                explanation=c["explanation"]
            )
            for c in comparisons
        ]
        
        return ResumeComparisonResponse(
            comparisons=comparison_objects,
            overall_winner=winner,
            resume1_overall_score=r1_score,
            resume2_overall_score=r2_score,
            recommendations=recommendations
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error comparing resumes: {str(e)}")
