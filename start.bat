@echo off
:start
echo Starting Optimus-Void...
node index.js
echo Bot exited with code %errorlevel%
timeout /t 5
goto start
