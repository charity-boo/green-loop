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
    echo ""
    echo "🛑 Shutting down..."
    # Kill the Next.js dev process if running
    if [ -n "$NEXT_PID" ]; then
        kill "$NEXT_PID" 2>/dev/null
    fi
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
    echo "🔌 Starting Green Loop in OFFLINE mode (Firebase Emulators)..."
    export NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true

    # Use absolute path for DATA_DIR to ensure Firebase finds it reliably
    ABS_DATA_DIR="$(pwd)/$DATA_DIR"

    # Start Firebase emulators in the background.
    # Explicitly exclude 'hosting' to prevent the Firebase frameworks integration
    # from triggering a production Next.js build. Next.js runs via 'next dev' below.
    pnpm exec firebase emulators:start \
        --only auth,functions,firestore,database,storage \
        --import="$ABS_DATA_DIR" \
        --export-on-exit="$ABS_DATA_DIR" &
    FIREBASE_PID=$!

    # Wait for emulators to be ready (poll the hub endpoint)
    echo "⏳ Waiting for emulators to be ready..."
    until curl -s http://localhost:4000 > /dev/null 2>&1 || ! kill -0 "$FIREBASE_PID" 2>/dev/null; do
        sleep 2
    done

    if ! kill -0 "$FIREBASE_PID" 2>/dev/null; then
        echo "❌ Firebase emulators failed to start. Check logs above."
        exit 1
    fi

    echo "✅ Emulators ready. Starting Next.js dev server..."

    # Start Next.js dev server in the foreground
    pnpm exec next dev &
    NEXT_PID=$!

    # Wait for both processes — exit if either dies
    wait "$FIREBASE_PID"
fi
