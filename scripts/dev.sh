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
    pnpm exec next dev
else
    echo "plug: Starting Green Loop in OFFLINE mode (Firebase Emulators)..."
    export NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
    
    # Use absolute path for DATA_DIR to ensure Firebase finds it reliably
    ABS_DATA_DIR="$(pwd)/$DATA_DIR"
    
    # We use pnpm exec firebase to ensure we use the project's local version
    # The --import and --export-on-exit ensure our local data persists
    # Removed pnpm dotenv wrapper as it can interfere with signal handling (Ctrl+C)
    # Next.js will load its own .env files automatically.
    pnpm exec firebase emulators:exec \
        --ui \
        --import="$ABS_DATA_DIR" \
        --export-on-exit="$ABS_DATA_DIR" \
        "pnpm exec next dev"
fi
