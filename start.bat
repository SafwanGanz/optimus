@echo off
setlocal EnableDelayedExpansion

:start
echo Starting Optimus-Void...

if exist .restart_needed (
  echo Detected restart flag, cleaning up...
  del /f .restart_needed
)

node index.js
set EXIT_CODE=%errorlevel%

echo Bot exited with code %EXIT_CODE%

if exist .restart_needed (
  echo Restart flag detected, restarting immediately...
  del /f .restart_needed
  goto start
)

if %EXIT_CODE% EQU 0 (
  echo Clean restart requested, restarting in 2 seconds...
  timeout /t 2 /nobreak >nul
  goto start
)

echo Bot exited with error, restarting in 5 seconds...
timeout /t 5 /nobreak
goto start
