FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements from backend directory
COPY backend/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy entire project directory so backend has access to config/city.yaml and data/
COPY . .

# Set PYTHONPATH to project root so backend.app imports work seamlessly
ENV PYTHONPATH=/app
ENV PORT=8000

EXPOSE 8000

# Start Uvicorn pointing to backend.app.main:app, dynamic PORT support for Railway
CMD uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-8000}
