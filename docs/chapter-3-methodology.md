# CHAPTER 3: METHODOLOGY

## 3.1 Introduction
This chapter presents the methodology used to design, implement, and operationalize the Green Loop web application. The methodological focus is practical software delivery: selecting appropriate technologies, structuring data management, defining server behavior, organizing deployment, and establishing reproducible setup procedures for development and production contexts.

Green Loop was implemented as a modern web platform that supports role-based workflows and service transactions, including scheduling and payment-related operations. The methodology emphasizes maintainability, type safety, security-rule governance, and environment consistency. In particular, the project adopts a controlled offline-first development process through Firebase emulators, while preserving a clear path to online execution against live cloud services.

The chapter is organized as follows: Section 3.2 describes the programming tools and rationale for their selection; Section 3.3 explains database management tools and governance practices; Section 3.4 presents the web server model; Section 3.5 defines the dataset characteristics and handling approach; Section 3.6 outlines packaging and deployment strategy; and Section 3.7 provides installation, configuration, and setup procedures.

## 3.2 Programming Tools
The Green Loop implementation uses a JavaScript/TypeScript web stack centered on **Next.js**. Next.js was selected as the core framework because it supports structured application routing, server/client integration patterns, and production-ready build tooling in one framework. This reduces architectural fragmentation and improves long-term maintainability.

The primary implementation language is **TypeScript**, chosen to improve correctness through static typing and stronger development-time checks. By enforcing explicit types for components, APIs, and utility logic, the project reduces runtime ambiguity and improves refactor safety as features evolve.

For user interface construction, the project uses **React** (through Next.js) and **Tailwind CSS**. Tailwind CSS supports consistent utility-based styling and rapid interface iteration while keeping styles close to component logic. This contributes to UI consistency and lowers maintenance overhead compared to scattered custom CSS patterns.

Dependency and script management are standardized through **pnpm**. Using a single package manager across development and deployment workflows ensures lockfile consistency, deterministic installs, and stable project onboarding. Key lifecycle scripts include development startup, build generation, production start, linting, seeding, and maintenance operations.

The platform integrates **Firebase client/admin ecosystems** and associated SDK tooling for cloud-connected features. During development, emulator-backed execution is preferred to isolate local testing from live resources. This approach improves developer safety, supports repeatable testing conditions, and enables controlled data lifecycle handling.

Additional implementation tools include ESLint for code quality, TSX for running TypeScript scripts, and utility libraries for form handling, validation, UI behavior, data formatting, and external integrations (e.g., payment and communication services). Methodologically, this toolset reflects a balance between rapid delivery and engineering discipline: strong typing, scripted workflows, and explicit environment control.

## 3.3 Database Management Tools
Database management in Green Loop is organized around **Firebase services**, with **Firestore** as the primary structured data store and accompanying security governance through declarative rules. The project defines Firestore configuration and indexes through source-controlled files, allowing database behavior to be versioned alongside application code.

A key methodological principle is that access policies are treated as code artifacts, not ad hoc console edits. Security constraints are maintained in repository-managed rule files under `firebase/rules/`, enabling traceability, peer review, and consistent deployment behavior. This improves governance and minimizes the risk of untracked policy drift.

Green Loop also includes rules for other Firebase-backed surfaces (e.g., Storage and Realtime Database) through dedicated rule files. Centralizing these artifacts creates a coherent database security model across services rather than isolated configurations.

For local development and validation, the application uses Firebase emulators configured with explicit ports for Auth, Firestore, Functions, Realtime Database, Storage, and Emulator UI. This environment allows developers to test data operations, auth interactions, and policy behavior without impacting production resources.

Data management methodology further includes persistent emulator-state handling. Local emulator data is imported on startup and exported on shutdown to preserve continuity between development sessions. This supports reproducible debugging and realistic workflow simulation while remaining isolated from live systems.

In summary, Green Loop’s database management approach combines cloud-native scalability with disciplined rule governance, source-controlled configuration, and reproducible local environments. This strengthens both security posture and operational consistency.

## 3.4 Web Server
Green Loop uses the **Next.js application server model** as its primary web-serving layer. In development mode, the application is executed via a unified shell script that controls environment selection and runtime orchestration. By default, development starts in offline mode with Firebase emulators enabled; online mode can be explicitly selected to connect to live cloud services.

This dual-mode design is implemented through environment variable switching, particularly `NEXT_PUBLIC_USE_FIREBASE_EMULATORS`. When offline mode is active, the workflow runs Next.js within an emulator execution context and persists emulator data across sessions. When online mode is selected, the development server runs against live services.

For production serving, the methodology follows the standard Next.js build lifecycle: `next build` to generate optimized build artifacts and `next start` to run the production server. This separation of development and production runtime behavior ensures that local debugging conveniences do not leak into deployment assumptions.

The server methodology also includes operational cleanliness practices. Development scripts automatically capture and move debug logs to a centralized logs directory, helping keep the project root organized and making troubleshooting outputs easier to track.

Overall, the web server strategy is intentionally environment-aware: one framework for both development and production, but with explicit configuration boundaries. This supports reliability, clearer debugging, and controlled migration from local to cloud-backed execution.

## 3.5 Dataset
In this project, the dataset is operational rather than purely research-tabular. It consists of application records generated and consumed by platform workflows, including user identity and role data, service scheduling records, payment-state transitions, assignment-related records, and related interaction logs/notifications needed by the system.

Dataset composition is therefore driven by business workflow states. For example, lifecycle transitions such as scheduling, payment completion, and downstream assignment create structured records that must remain consistent across user-facing and administrative views. The methodology treats these as transaction-linked entities rather than isolated documents.

During development, dataset handling is performed primarily through emulator-backed stores. This allows realistic test data creation, scenario replay, and debugging under controlled conditions. Because emulator data can be persisted across local runs, developers can evaluate multi-step flows over time instead of re-seeding from scratch for each session.

From a data-quality perspective, the methodology emphasizes:
1. predictable schema-like conventions through typed application code,
2. access control through Firebase security rules, and
3. environment separation so test data and production data do not mix.

Where external integrations are involved (e.g., payment events), the data methodology uses explicit local setup variables and endpoint-based processing patterns to keep state changes auditable and reproducible in development.

Thus, the dataset strategy supports both engineering productivity and operational correctness: data remains workflow-centered, guarded by rules, and environment-scoped for safe iteration.

## 3.6 Package and Deployment
Green Loop’s packaging methodology is based on **pnpm-managed dependency control** and scripted lifecycle execution. Using `pnpm` as the mandatory package manager provides deterministic dependency resolution, lockfile consistency, and repeatable builds across contributors and environments.

The project defines explicit scripts for development (`dev`, `dev:offline`, `dev:online`), build (`build`), production startup (`start`), linting (`lint`), cleanup (`clean`), and operational scripts such as seeding and migration support. This script-driven approach reduces manual command variance and improves deployment reproducibility.

Deployment-oriented preparation follows a standard sequence: install dependencies, produce a production build, and run with production server settings. For Firebase-connected components, configuration files and rules remain source-controlled, enabling deployment pipelines to use declarative infrastructure/application settings instead of undocumented manual steps.

The Firebase configuration includes service definitions (Firestore, Functions, Storage, Realtime Database, Auth providers) and emulator definitions for local parity. For cloud functions, predeploy hooks (lint/build at function scope) are declared to enforce minimum quality gates before deployment packaging.

Methodologically, this packaging/deployment structure supports reliability in two ways: first, by standardizing execution paths through scripts; second, by reducing configuration drift through versioned config artifacts. It enables a clear transition from local development to production deployment while maintaining environmental discipline.

## 3.7 Installation, Configuration and Setup
A reproducible setup process is essential for methodological validity and team scalability. Green Loop uses the following structured setup procedure:

1. **Prerequisites**  
   Install Node.js (v18 or higher) and pnpm (v8 or higher). These versions provide compatibility with the project’s Next.js and TypeScript toolchain.

2. **Project Initialization**  
   Clone the repository and enter the project directory.  
   Install dependencies using:
   ```bash
   pnpm install
   ```

3. **Environment Configuration**  
   Configure required environment variables in local environment files as needed.  
   For optional map autocomplete functionality:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_browser_key
   ```
   For payment workflow testing, configure Stripe keys and webhook secret in local env configuration.

4. **Development Startup (Default Offline Mode)**  
   Run:
   ```bash
   pnpm dev
   ```
   This starts Next.js and Firebase emulators via the unified development script. Emulator-backed mode enables safe local testing and imports/exports emulator data for continuity.

5. **Alternative Online Development Mode**  
   Run:
   ```bash
   pnpm dev:online
   ```
   This mode connects development runtime to live Firebase resources and should be used only when online integration behavior is intentionally required.

6. **Production Build and Start**  
   Generate optimized production artifacts:
   ```bash
   pnpm build
   ```
   Start the production server:
   ```bash
   pnpm start
   ```

7. **Maintenance and Operational Commands**  
   Use project scripts for linting, cleanup, and data operations (e.g., seeding/migration utilities) to maintain consistent engineering workflows.

This setup methodology prioritizes reproducibility, controlled environment switching, and script-based execution. As a result, onboarding is simplified, development behavior is consistent across machines, and deployment readiness is improved through standardized operational steps.
