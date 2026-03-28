# Green Loop - Development Guidelines

## General Standards
- **Package Manager**: `pnpm` is the mandatory package manager for this project. Do not use `npm` or `yarn` for adding dependencies or running scripts to ensure consistent lockfiles.

## Folder Structure
The project follows a root-level modular structure to keep the codebase clean and accessible.
- `app/`: Next.js App Router routes and page components.
- `components/`: Reusable UI components, organized by feature.
- `context/`: React Context providers for global state management.
- `hooks/`: Custom React hooks.
- `lib/`: Core logic, Firebase admin setup, and utility functions.
- `services/`: External service integrations (e.g., Notifications).
- `types/`: TypeScript interfaces and type definitions.
- `firebase/rules/`: Security rules and indexes for Firestore, Storage, and Realtime Database.
- `logs/`: Centralized directory for application and emulator logs.
- `scripts/`: Maintenance, seeding, and testing scripts.

## Environment Management
We use a unified development script (`scripts/dev.sh`) to manage the application lifecycle.
- **Run Offline (Default)**: `pnpm dev` or `pnpm dev:offline`
  - Runs Next.js with Firebase emulators.
  - Automatically imports/exports local data to `.firebase-emulator-data/`.
  - Redirects all Firebase debug logs to `logs/` on exit to keep the root clean.
- **Run Online**: `pnpm dev:online`
  - Runs Next.js against the live cloud Firebase environment.

## Firebase Best Practices
To ensure consistency and security within our Firebase integration, follow these mandates:

- **Security Rules**: 
  - Never modify rules directly in the Firebase Console.
  - All changes must be made in `firebase/rules/` and deployed via CLI.
  - Always run `pnpm test:rules` before deploying new rules.
- **Data Lifecycle**:
  - The `dev:offline` command ensures your local emulator data is persisted between sessions.
  - Do not commit `.firebase-emulator-data/` to version control.
- **Logs & Cleanup**:
  - All `*-debug.log` files are automatically moved to `logs/` by the dev script.
  - Use `pnpm clean` to reset build artifacts and clear the log directory.
- **Code Organization**:
  - Client-side Firebase calls should use standard hooks from `hooks/`.
  - Administrative or sensitive tasks must use the Firebase Admin SDK in `lib/firebase/admin` via API routes or Cloud Functions.
