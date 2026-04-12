from __future__ import annotations

import json
from pathlib import Path

from .engine import build_default_state
from .models import DashboardState


ROOT = Path(__file__).resolve().parents[2]
STORAGE_DIR = ROOT / "storage"
STATE_PATH = STORAGE_DIR / "lifepath-state.json"


class FileStateStore:
    def __init__(self, path: Path = STATE_PATH) -> None:
        self.path = path
        self.path.parent.mkdir(parents=True, exist_ok=True)

    def load(self) -> DashboardState:
        if not self.path.exists():
            state = build_default_state()
            self.save(state)
            return state

        payload = json.loads(self.path.read_text(encoding="utf-8"))
        return DashboardState.model_validate(payload)

    def save(self, state: DashboardState) -> None:
        self.path.write_text(
            json.dumps(state.model_dump(mode="json"), ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
