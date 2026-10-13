import json
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from backend.app.main import app

def export_openapi():
    schema = app.openapi()
    output_path = "docs/openapi.json"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(schema, f, indent=2)
    print(f"[SUCCESS] Exported OpenAPI schema to {output_path}")

if __name__ == "__main__":
    export_openapi()
