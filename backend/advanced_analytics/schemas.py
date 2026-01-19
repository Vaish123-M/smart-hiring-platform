from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime

class SkillHeatmapData(BaseModel):
    skill: str
    frequency: int
    ats_correlation: float  # 0-1, correlation with ATS score
    role_relevance: float  # 0-1
    growth_trend: float  # -1 to 1, trend direction

class SkillHeatmapRequest(BaseModel):
    resumes_data: List[Dict]  # List of resume extracts with skills and ATS scores

class SkillHeatmapResponse(BaseModel):
    heatmap_data: List[SkillHeatmapData]
    top_skills: List[str]
    emerging_skills: List[str]
    declining_skills: List[str]
    recommendations: List[str]

class ResumeTrendPoint(BaseModel):
    date: str
    ats_score: float
    skill_count: int
    resume_id: str

class TrendAnalysisRequest(BaseModel):
    resumes_history: List[Dict]  # Historical resume data with dates

class TrendAnalysisResponse(BaseModel):
    trend_points: List[ResumeTrendPoint]
    average_ats_score: float
    best_ats_score: float
    improvement_rate: float  # % improvement per month
    recommendations: List[str]

class ResumeComparisonItem(BaseModel):
    aspect: str  # "skills", "experience", "keywords", "format"
    resume1_score: float
    resume2_score: float
    winner: str  # "resume1", "resume2", "tie"
    explanation: str

class ResumeComparisonRequest(BaseModel):
    resume1_text: str
    resume2_text: str
    job_description: Optional[str] = None

class ResumeComparisonResponse(BaseModel):
    comparisons: List[ResumeComparisonItem]
    overall_winner: str
    resume1_overall_score: float
    resume2_overall_score: float
    recommendations: List[str]
