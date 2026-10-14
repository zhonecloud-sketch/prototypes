@echo off
setlocal
cd /d "%~dp0"
if not exist "bin\attk-server.exe" goto build
if not exist "wasm\attk_engine.wasm" goto build
goto launch
:build
call build.bat
if errorlevel 1 goto failed
:launch
"bin\attk-server.exe" --root "%CD%" --open %*
if errorlevel 1 goto failed
exit /b 0
:failed
echo Game did not start. Read the error above and docs\installation.md.
pause
exit /b 1
