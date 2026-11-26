@echo off
py -3 -B "%~dp0app.py"
if errorlevel 1 pause
