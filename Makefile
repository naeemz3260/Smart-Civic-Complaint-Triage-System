.PHONY: help setup run seed test evaluate clean

PYTHON ?= python
NPM ?= npm

help:
	@echo "Available commands:"
	@echo "  make setup     - Install Python and Node dependencies"
	@echo "  make run       - Run backend and frontend concurrently"
	@echo "  make seed      - Populate database with realistic civic complaint scenarios"
	@echo "  make test      - Execute backend pytest and frontend checks"
	@echo "  make evaluate  - Train text classifier and generate performance metrics"
	@echo "  make clean     - Remove virtualenvs, node_modules, and cache files"

setup:
	cd backend && $(PYTHON) -m pip install -r requirements.txt
	cd frontend && $(NPM) install

run-backend:
	cd backend && uvicorn app.main:app --reload --port 8000

run-frontend:
	cd frontend && $(NPM) run dev

seed:
	cd backend && $(PYTHON) -m app.seed.demo_data

test:
	cd backend && pytest -v
	cd frontend && $(NPM) test -- --run

evaluate:
	$(PYTHON) ml/train_text_classifier.py
	$(PYTHON) ml/evaluate.py

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
