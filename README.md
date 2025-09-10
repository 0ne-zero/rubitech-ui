
# Rubitech Landing (React + Vite + Tailwind)

A production-ready starter that embeds your Rubitech landing page component. Features:
- Vite + React 18 + TypeScript
- TailwindCSS 3
- ESLint + Prettier
- RTL-first HTML (`lang="fa" dir="rtl"`)

## Getting Started (Local)

1) **Requirements**
   - Node.js 18+ (recommend 20+)
   - A package manager: npm (comes with Node), pnpm or yarn

2) **Install dependencies**
```bash
cd rubitech-landing
npm install
# or: pnpm install
```

3) **Run the dev server**
```bash
npm run dev
```
Open the printed local URL (typically http://localhost:5173).

4) **Build for production**
```bash
npm run build
npm run preview  # to test the built app locally
```

## Font (IRANYekanX)
This project references *IRANYekanX* and *IRANYekanX FaNum* in CSS. Place the licensed font files into `public/fonts/` and uncomment the `@font-face` blocks in `src/index.css`.

## Where is my code?
Your landing page is at `src/sections/RubitechLandingPageFA.tsx` (copied from your upload).

## Tailwind
- Config: `tailwind.config.js`
- Directives imported in `src/index.css`

## Lint & Format
```bash
npm run lint
npm run format
```
