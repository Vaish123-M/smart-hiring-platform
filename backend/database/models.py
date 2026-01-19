from datetime import datetime
from typing import List, Optional, Dict
from pydantic import BaseModel, EmailStr, Field
from bson import ObjectId


class PyObjectId(ObjectId):
    """Custom ObjectId type for Pydantic."""
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class UserModel(BaseModel):
    """User account model."""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    email: EmailStr
    username: str
    hashed_password: str
    full_name: Optional[str] = None
    is_active: bool = True
    is_verified: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class SkillModel(BaseModel):
    """Skill extracted from resume."""
    name: str
    frequency: int
    category: Optional[str] = None
    proficiency: Optional[str] = None  # beginner, intermediate, expert


class ResumeModel(BaseModel):
    """Resume document model."""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: Optional[PyObjectId] = None
    filename: str
    original_text: str
    parsed_data: Dict = {}
    
    # Extracted information
    skills: List[SkillModel] = []
    experience_years: Optional[float] = None
    education: List[Dict] = []
    projects: List[Dict] = []
    
    # Scores and analysis
    ats_score: Optional[float] = None
    ats_breakdown: Optional[Dict] = None
    job_role_matches: List[Dict] = []
    
    # Metadata
    file_size: int
    file_path: Optional[str] = None
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_deleted: bool = False
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str, datetime: lambda v: v.isoformat()}


class JobDescriptionModel(BaseModel):
    """Job description model."""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: Optional[PyObjectId] = None
    title: str
    company: Optional[str] = None
    description: str
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    experience_required: Optional[str] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None
    source_url: Optional[str] = None
    posted_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str, datetime: lambda v: v.isoformat()}


class MatchResultModel(BaseModel):
    """Resume-JD match result model."""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: Optional[PyObjectId] = None
    resume_id: PyObjectId
    jd_id: PyObjectId
    
    # Match metrics
    match_percentage: float
    ats_score: float
    matched_skills: List[str] = []
    missing_skills: List[str] = []
    skill_gap_analysis: Dict = {}
    
    # Recommendations
    recommendations: List[str] = []
    estimated_impact: str  # low, medium, high
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str, datetime: lambda v: v.isoformat()}


class AnalyticsEventModel(BaseModel):
    """Analytics event tracking model."""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: Optional[PyObjectId] = None
    event_type: str  # upload, analyze, export, match, compare
    entity_id: Optional[PyObjectId] = None
    metadata: Dict = {}
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str, datetime: lambda v: v.isoformat()}


class CoverLetterModel(BaseModel):
    """Generated cover letter model."""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: Optional[PyObjectId] = None
    resume_id: PyObjectId
    jd_id: Optional[PyObjectId] = None
    
    content: str
    tone: str  # professional, friendly, formal
    customization_level: str
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str, datetime: lambda v: v.isoformat()}
