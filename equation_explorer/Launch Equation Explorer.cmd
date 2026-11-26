@echo off
setlocal
cd /d "%~dp0"
set PYTHONDONTWRITEBYTECODE=1
uv run --script app.py
if errorlevel 1 pause
