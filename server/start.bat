@echo off
setlocal

REM Resolve the directory of this script (server\)
set "SCRIPT_DIR=%~dp0"

REM Enter server folder to keep relative paths stable
pushd "%SCRIPT_DIR%" >nul

echo.
echo [static-web-server] Starting...
echo - Config: %SCRIPT_DIR%sws.toml
echo - URL   : http://127.0.0.1:8000/
echo.

REM Start server (blocking). Close this window to stop.
"%SCRIPT_DIR%static-web-server.exe" --config-file "%SCRIPT_DIR%sws.toml"

popd >nul
endlocal
