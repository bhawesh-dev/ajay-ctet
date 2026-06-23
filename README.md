# ACC GS Academy

A production-ready, single-page landing website for ACC GS Academy.

## Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- npm

## Getting started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run lint
npm run build
```

## Architecture

- `app/page.js` — the landing page
- `content/legal.js` — Terms & Conditions and Privacy Policy content
- `components/LegalAccordion.js` — accessible native policy accordions
- `app/globals.css` — Tailwind import, design tokens, and global behavior
- `next.config.mjs` — explicit Turbopack workspace root

The site is static and requires no environment variables, database, payment provider, or external runtime service.
