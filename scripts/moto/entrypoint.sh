#!/bin/sh
set -e

# Handle shutdown signals
cleanup() {
  kill -TERM "$MOTO_PID" 2>/dev/null
  exit 0
}

trap cleanup SIGTERM SIGINT

# Start Moto
moto_server -H 0.0.0.0 -p 4566 2>&1 & 
MOTO_PID=$!

# Wait for moto to come up
echo "Waiting for Moto to start..."
until python -c "import socket; s = socket.socket(); s.connect(('127.0.0.1', 4566))" 2>/dev/null; do
  sleep 0.5
done
echo "Moto started"

echo "Creating resources"
python /scripts/10-setup-resources.py
echo "Resources creaed"
echo READY > /tmp/READY

# Bring Moto to the foreground so the container stays alive
wait "$MOTO_PID"
