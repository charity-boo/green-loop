# Design Document: Chapter 3 Methodology (Green Loop)

## Problem Statement
The user needs a full, detailed Chapter 3 (Methodology) for an academic report, structured strictly as:
3.1 Introduction, 3.2 Programming Tools, 3.3 Database Management Tools, 3.4 Web Server, 3.5 Dataset, 3.6 Package and Deployment, and 3.7 Installation, Configuration and Setup.

The chapter must be formal, project-specific to the Green Loop web application, and sized for a medium-length chapter (approximately 4-6 pages).

## Proposed Approach
Produce a standard academic methodology chapter that explains:
1. the development environment and technical stack choices,
2. data and database management practices,
3. application serving model,
4. dataset context and handling,
5. packaging and deployment workflow, and
6. reproducible setup steps.

Each section will follow a consistent pattern:
- brief contextual introduction,
- concrete implementation details from the Green Loop project,
- short methodological justification tied to software quality attributes.

## Scope and Boundaries
- In scope: methodological decisions, tools, architecture, setup, deployment, and data handling relevant to implementation.
- Out of scope: performance results, comparative metrics, and evaluation outcomes typical of later thesis chapters.

## Section-by-Section Design

### 3.1 Introduction
Frame the chapter purpose, explain that methodology details the technical path from requirements to implementation, and introduce the sequence of sections.

### 3.2 Programming Tools
Describe the selected development stack and role of each major tool:
- Next.js (application framework),
- TypeScript (type-safe development),
- Tailwind CSS (styling),
- pnpm (dependency and script management),
- Firebase SDKs and local emulator workflow.
Explain why these tools support maintainable and scalable delivery.

### 3.3 Database Management Tools
Explain Firebase-centered data management:
- Firestore usage model,
- rules-based access control managed in versioned rule files,
- local rule testing and emulator-based validation practices.
Emphasize consistency, security, and developer reproducibility.

### 3.4 Web Server
Document web serving lifecycle:
- development mode with local server and emulator integration,
- production mode build/start workflow,
- environment-based behavior separation.
Describe the role of Node.js runtime and Next.js server behavior.

### 3.5 Dataset
Define the dataset operationally for Green Loop:
- user-generated and workflow records that drive application features,
- local emulator data persistence for development continuity,
- data integrity and privacy-aware handling in development lifecycle.

### 3.6 Package and Deployment
Present package/deployment strategy:
- package configuration and dependency locking with pnpm,
- build artifact generation,
- deployment orientation (development vs online/production paths).
State how this supports predictable releases.

### 3.7 Installation, Configuration and Setup
Provide reproducible setup procedure:
- prerequisites,
- repository setup and dependency install,
- environment variable configuration,
- commands for offline and online execution,
- verification-oriented startup expectations.
Keep steps aligned with existing project scripts and conventions.

## Style and Quality Constraints
- Academic/formal tone.
- No marketing language.
- Clear transitions between sections.
- Include rationale but keep section focus on implementation method.
- Medium detail level suitable for 4-6 pages.
