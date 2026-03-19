#!/bin/bash
echo ""
echo "  🎸 Starting STAGESIDE..."
echo ""

# Check if API key arg was passed
if [ ! -z "$1" ]; then
  echo "TM_API_KEY=$1" > "$(dirname "$0")/.env"
  echo "  ✓ API key saved"
fi

node "$(dirname "$0")/server.js"
