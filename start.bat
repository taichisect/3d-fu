@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
pushd "%SCRIPT_DIR%" >nul

set "SERVER_DIR=%SCRIPT_DIR%server\"

set "URL=http://127.0.0.1:8000/"
echo.
echo [static-web-server] Starting...
echo - Config: %SERVER_DIR%sws.toml
echo - URL   : %URL%
echo.

REM Start server in a new window so we can open the browser immediately
start "static-web-server" /D "%SERVER_DIR%" "%SERVER_DIR%static-web-server.exe" --config-file "%SERVER_DIR%sws.toml"

REM Give it a moment to bind the port
ping 127.0.0.1 -n 2 >nul

start "" "%URL%"

popd >nul
endlocal
