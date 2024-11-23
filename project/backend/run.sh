#!/bin/bash
python -c 'import sys; print(sys.version_info[:])'
pip install -r requirements.txt
python3.11 -m uvicorn app.main:app --reload --port 8000