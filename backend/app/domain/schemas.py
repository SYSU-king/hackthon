from pydantic import BaseModel, Field
from typing import Optional


# ── Project ──
class ProjectCreate(BaseModel):
    title: str = "Untitled Project"


class ProjectOut(BaseModel):
    id: str
    title: str
    status: str
    created_at: str


# ── UserProfile ──
class UserProfileCreate(BaseModel):
    personality_type: str = ""
    education_stage: str = ""
    school: str = ""
    major: str = ""
    gpa_range: str = ""
    family_economy: str = ""
    family_expectation: str = ""
    city_preference: str = ""
    career_preference: str = ""
    risk_preference: str = "balanced"
    current_concern: str = ""


# ── Parameters ──
class ParameterCreate(BaseModel):
    name: str
    description: str = ""
    priority: str = "primary"
    weight: float = 1.0


class ParametersSubmit(BaseModel):
    parameters: list[ParameterCreate]


# ── Simulation ──
class SimulationStart(BaseModel):
    rounds: int = Field(default=12, ge=4, le=20)
    time_unit: str = "quarter"  # month / quarter / semester / year


# ── Advice ──
class AdviceRequest(BaseModel):
    feedback: str = "satisfied"  # satisfied / unsatisfied
