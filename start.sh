#!/bin/bash
while true; do
  echo "Starting Optimus-Void..."
  node index.js
  echo "Bot exited with code $?. Restarting in 5 seconds..."
  sleep 5
done
