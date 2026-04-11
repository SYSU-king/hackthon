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
    agent_count: int = Field(default=6, ge=3, le=12)  # configurable agent count


# ── Advice ──
class AdviceRequest(BaseModel):
    feedback: str = "satisfied"  # satisfied / unsatisfied


# ── Backtracking / Counterfactual ──
class BacktrackRequest(BaseModel):
    """Request to modify a node's parameters and re-derive from that point."""
    node_index: int = Field(ge=0, description="Index of the node in the path to modify from")
    path_id: str = Field(description="ID of the path to branch from")
    modifications: dict = Field(default_factory=dict, description="State overrides, e.g. {'education': 0.9, 'career': 0.2}")
    description: str = Field(default="", description="Natural language description of the change, e.g. '保研成功'")
    rounds: int = Field(default=6, ge=2, le=12, description="Number of rounds to simulate from this point")
