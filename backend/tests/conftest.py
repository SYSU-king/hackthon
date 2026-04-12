"""Shared test fixtures."""

import os
import sys
import shutil
import pytest

# Ensure app can be imported
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

# Override DATA_DIR before importing app
TEST_DATA_DIR = os.path.join(os.path.dirname(__file__), "test_data")
os.environ["DATA_DIR"] = TEST_DATA_DIR

from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings


@pytest.fixture(autouse=True)
def clean_test_data():
    """Create and clean test data directory for each test."""
    settings.DATA_DIR = TEST_DATA_DIR
    os.makedirs(os.path.join(TEST_DATA_DIR, "projects"), exist_ok=True)
    yield
    if os.path.exists(TEST_DATA_DIR):
        shutil.rmtree(TEST_DATA_DIR)


@pytest.fixture
def client():
    return TestClient(app)
