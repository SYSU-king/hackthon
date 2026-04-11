"""
Domain models — pure Pydantic, no ORM dependency.
All data is serialized to/from JSON files.
"""

import uuid
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


def gen_id() -> str:
    return str(uuid.uuid4())[:8]


class LifeStateSnapshot(BaseModel):
    education: float = 0.5
    career: float = 0.0
    finance: float = 0.3
    health: float = 0.8
    mental: float = 0.6
    relationship: float = 0.5
    family_support: float = 0.7
    social_capital: float = 0.4
    optionality: float = 0.8
    goal_alignment: float = 0.5


class AgentAction(BaseModel):
    """A single action taken by an Agent in a simulation round."""
    agent_id: str = ""
    agent_type: str = ""
    action_type: str = "DO_NOTHING"  # MAKE_DECISION / PROVIDE_OPPORTUNITY / APPLY_PRESSURE / GIVE_SUPPORT / WITHDRAW_SUPPORT / CHANGE_CONDITION / TRIGGER_RISK / REFLECT / DO_NOTHING
    target_agent: str = "self"
    payload: dict = Field(default_factory=dict)
    narrative: str = ""


class SimulationRound(BaseModel):
    """One round of simulation."""
    round_num: int = 0
    time_label: str = ""
    actions: list[AgentAction] = Field(default_factory=list)
    state_after: Optional[LifeStateSnapshot] = None
    events_summary: str = ""
    branch_triggered: bool = False


class Agent(BaseModel):
    """An Agent participating in the simulation."""
    agent_id: str = Field(default_factory=gen_id)
    agent_type: str = "Self"  # Self / Family / Mentor / Partner / School / Employer / City / Industry / Risk / Director
    name: str = ""
    persona: str = ""  # LLM-generated persona description
    stance: str = ""   # 立场
    resources: str = ""  # 资源
    influence: float = 0.5  # 影响力 0-1
    active: bool = True


class PathNode(BaseModel):
    node_id: str = Field(default_factory=gen_id)
    node_type: str = "decision"  # decision / opportunity / result / cascade / risk / reflection
    title: str = ""
    description: str = ""
    time_label: str = ""
    trigger_reason: str = ""
    state_snapshot: Optional[LifeStateSnapshot] = None
    agent_actions: list[AgentAction] = Field(default_factory=list)


class LifePath(BaseModel):
    id: str = Field(default_factory=gen_id)
    name: str = ""
    path_type: str = "balanced"  # optimal / conservative / risk / balanced
    summary: str = ""
    risk_level: str = "medium"  # low / medium / high
    satisfaction_score: float = 0.5
    final_state: LifeStateSnapshot = Field(default_factory=LifeStateSnapshot)
    nodes: list[PathNode] = Field(default_factory=list)
    rounds: list[SimulationRound] = Field(default_factory=list)
    advice: dict = Field(default_factory=dict)


class ConcernParameter(BaseModel):
    id: str = Field(default_factory=gen_id)
    name: str
    description: str = ""
    priority: str = "primary"  # primary / secondary / constraint
    weight: float = 1.0


class UserProfile(BaseModel):
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


class Project(BaseModel):
    id: str = Field(default_factory=gen_id)
    title: str = "Untitled Project"
    status: str = "created"  # created / profiled / configured / simulating / completed
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    profile: Optional[UserProfile] = None
    parameters: list[ConcernParameter] = Field(default_factory=list)
    agents: list[Agent] = Field(default_factory=list)
    graph_data: Optional[dict] = None  # Knowledge graph nodes & edges
    expanded_factors: Optional[dict] = None  # LLM-expanded influence factors
    paths: list[LifePath] = Field(default_factory=list)
