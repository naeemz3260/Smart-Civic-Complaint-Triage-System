# Contributing Guidelines

Thank you for your interest in improving the **Smart Civic Complaint Triage System**! We welcome contributions from developers, civic tech enthusiasts, urban planners, and data scientists.

## Code of Conduct
We are committed to providing a welcoming and inclusive environment for everyone. Please be respectful and constructive in all interactions.

## Development Workflow
1. **Fork and Clone** the repository.
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/my-civic-enhancement
   ```
3. **Set Up Environments**:
   - Backend: Create a Python virtualenv, install `backend/requirements.txt`.
   - Frontend: `npm install` in `frontend/`.
4. **Adhere to Code Standards**:
   - Python code must pass `flake8` and `pytest`.
   - TypeScript code must pass `npm run build` and TypeScript check.
   - Any modifications to priority scoring must update unit tests in `backend/tests/test_priority.py`.
5. **Submit a Pull Request**:
   - Provide a clear summary of what changed and reference any relevant issue tickets.
