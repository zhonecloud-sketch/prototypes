@echo off
setlocal
cd /d "%~dp0"
where cargo >nul 2>nul
if errorlevel 1 (
  echo Cargo is missing. See docs\installation.md for Rust installation.
  exit /b 1
)
set "CARGO_TARGET_DIR=%CD%\target"
cargo build --locked --release -p attk-server
if errorlevel 1 exit /b 1
cargo build --locked --release -p attk-engine --target wasm32-unknown-unknown
if errorlevel 1 exit /b 1
if not exist bin mkdir bin
if not exist wasm mkdir wasm
copy /y "target\release\attk-server.exe" "bin\attk-server.exe" >nul
if errorlevel 1 exit /b 1
copy /y "target\wasm32-unknown-unknown\release\attk_engine.wasm" "wasm\attk_engine.wasm" >nul
if errorlevel 1 exit /b 1
echo Build complete. Run start-game.bat.
