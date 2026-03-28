#!/bin/bash

# Green Loop Development Script
# Handles both online and offline (emulator) modes while keeping the root clean.

MODE=${1:-"--offline"}
LOG_DIR="logs"
DATA_DIR=".firebase-emulator-data"

# Ensure directories exist
mkdir -p "$LOG_DIR"
mkdir -p "$DATA_DIR"

clean_up() {
    # Move any stray logs to the log directory
    mv *-debug.log "$LOG_DIR/" 2>/dev/null
}

# Trap exit to ensure cleanup runs
trap clean_up EXIT

if [ "$MODE" == "--online" ]; then
    echo "🚀 Starting Green Loop in ONLINE mode (Live Firebase)..."
    export NEXT_PUBLIC_USE_FIREBASE_EMULATORS=false
    next dev
else
    echo "plug: Starting Green Loop in OFFLINE mode (Firebase Emulators)..."
    export NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
    
    # We use emulators:exec to run next dev within the emulator environment
    # The --export-on-exit ensures our local data persists
    # We use pnpm dotenv -o to ensure the .env file is loaded and OVERRIDES any poisoned shell env
    pnpm dotenv -e .env -o -- firebase emulators:exec --ui --import="$DATA_DIR" --export-on-exit="$DATA_DIR" "next dev"
fi
