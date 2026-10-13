import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from backend.app.seed.demo_data import seed_demo

if __name__ == "__main__":
    seed_demo()
