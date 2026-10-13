import os
import json
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/model-report", tags=["Model Evaluation Report"])

@router.get("")
def get_model_report():
    """Returns classification accuracy, per-class F1 metrics, and failure logs."""
    metrics_path = "ml/reports/metrics.json"
    failures_path = "ml/reports/failures.json"

    metrics = {}
    failures = []

    if os.path.exists(metrics_path):
        with open(metrics_path, "r", encoding="utf-8") as f:
            metrics = json.load(f)

    if os.path.exists(failures_path):
        with open(failures_path, "r", encoding="utf-8") as f:
            failures = json.load(f)

    return {
        "metrics": metrics,
        "failures": failures,
        "model_architecture": "TF-IDF + Ridge Classifier with Urdu & Roman Urdu Normalizer"
    }
