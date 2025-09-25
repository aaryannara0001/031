#!/bin/bash
cd /Users/aaryannara/Downloads/project/backend
source /Users/aaryannara/Downloads/project/.venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
