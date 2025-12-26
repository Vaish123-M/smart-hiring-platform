 # Response models
from pydantic import BaseModel
from typing import Dict, List

class SkillAnalytics(BaseModel):
    skill_counts: Dict[str, int]

class MatchDistribution(BaseModel):
    ranges: Dict[str, int]
