@echo off
setlocal
cd /d "%~dp0"
if not exist "bin\attk-server.exe" goto prepare
if not exist "wasm\attk_engine.wasm" goto prepare
goto launch
:prepare
"%SystemRoot%\System32\where.exe" cargo >nul 2>nul
if not errorlevel 1 goto build
if not exist "%USERPROFILE%\.cargo\bin\cargo.exe" goto runtimeMissing
set "PATH=%USERPROFILE%\.cargo\bin;%PATH%"
:build
call build.bat
if errorlevel 1 goto failed
:launch
"bin\attk-server.exe" --root "%CD%" --open %*
if errorlevel 1 goto failed
exit /b 0
:runtimeMissing
echo The compiled game runtime is not installed in this folder:
echo "%CD%"
if not exist "bin\attk-server.exe" echo Missing: bin\attk-server.exe
if not exist "wasm\attk_engine.wasm" echo Missing: wasm\attk_engine.wasm
echo.
echo To play without installing Rust:
echo Download attk-windows-x64-runtime from the ATTK build Artifacts.
echo https://github.com/zhonecloud-sketch/prototypes/actions
echo Copy its bin and wasm folders directly into the folder shown above.
echo Do not leave them inside an extra extracted archive folder.
echo Git pull supplies source files; compiled runtime files are separate.
echo.
echo To compile from source, install Rust and the Windows C++ Build Tools.
echo Full instructions: docs\installation.md
if not "%ATTK_NO_PAUSE%"=="1" pause
exit /b 2
:failed
echo Game did not start. Read the error above and docs\installation.md.
if not "%ATTK_NO_PAUSE%"=="1" pause
exit /b 1
