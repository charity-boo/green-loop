# Green Loop

A modern web application built with Next.js and TypeScript.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18.0.0 or higher)
- pnpm (v8.0.0 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/charitymugendi/green-loop.git
cd green-loop
```

2. Install dependencies:
```bash
pnpm install
```

## Development

To start the development server:
```bash
pnpm dev
```

This starts Firebase emulators and runs the Next.js app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

By default, client SDK calls use local Firebase emulators in development. Set `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=false` to disable emulator usage.
Emulator data is imported from and exported to `.firebase-emulator-data/` on each `pnpm dev` run.

## Build

To create a production build:
```bash
pnpm build
```

To start the production server:
```bash
pnpm start
```

## Project Structure

```
├── app/               # Next.js app directory
│   ├── globals.css    # Global styles
│   ├── layout.tsx    # Root layout component
│   └── page.tsx      # Home page component
├── lib/              # Utility functions and shared code
└── public/           # Static assets
```

## Technologies Used

- Next.js
- TypeScript
- Tailwind CSS
- ESLint
- PostCSS

## License
[MIT License](LICENSE)
