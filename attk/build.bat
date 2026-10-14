@echo off
setlocal
cd /d "%~dp0"
"%SystemRoot%\System32\where.exe" cargo >nul 2>nul
if not errorlevel 1 goto ready
if not exist "%USERPROFILE%\.cargo\bin\cargo.exe" goto cargoMissing
set "PATH=%USERPROFILE%\.cargo\bin;%PATH%"
:ready
set "CARGO_TARGET_DIR=%CD%\target"
cargo rustc --locked --release -p attk-server -- -C target-feature=+crt-static
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

exit /b 0
:cargoMissing
echo Compiling from source requires Cargo, supplied by the Rust installer.
echo To play without a compiler, install the prebuilt Windows runtime.
echo See docs\installation.md for both installation routes.
exit /b 2
