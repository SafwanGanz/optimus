#!/bin/bash

chmod +x "$0"

handle_restart() {
  EXIT_CODE=$1

  if [ -f ".restart_needed" ]; then
    echo "Restart flag detected, restarting immediately..."
    rm -f .restart_needed
    return 0
  fi

  if [ $EXIT_CODE -eq 0 ]; then
    echo "Clean restart requested, restarting in 2 seconds..."
    sleep 2
    return 0
  fi

  echo "Bot exited with error code $EXIT_CODE, restarting in 5 seconds..."
  sleep 5
  return 0
}

while true; do
  if [ -f ".restart_needed" ]; then
    echo "Detected restart flag, cleaning up..."
    rm -f .restart_needed
  fi
  
  echo "Starting Optimus-Void..."

  node index.js
  EXIT_CODE=$?
  
  echo "Bot exited with code $EXIT_CODE"

  handle_restart $EXIT_CODE
done
