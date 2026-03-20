# Sandesh Regmi — Portfolio

Industrial Minimalism. Built with React + Framer Motion. Deploy-ready for Vercel.

## Stack
- React 18
- Framer Motion 11
- Vite 5
- Tailwind CSS 3

## Project Structure
```
/
├── Portfolio.jsx        ← entire site (one file)
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
├── package.json
└── src/
    └── main.jsx         ← entry point
```

## Setup & Run

```bash
npm install
npm run dev
```

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo to vercel.com — it auto-detects Vite.

## Before deploying

1. Drop your `resume.pdf` into the `/public` folder
2. Update your email in `Portfolio.jsx` if needed (search `contact-sand_esh@proton.me`)
3. Update LinkedIn/GitHub/YouTube links if they change

## Color System

| Color | Hex | Used for |
|---|---|---|
| Electric Blue | `#0077FF` | Primary — CTAs, headings, nav, section labels |
| Amber | `#E8A020` | Data — GPA, metrics, YouTube callout |
| UNT Green | `#00853E` | Institutional — UNT name references only |
| Obsidian | `#0A0A0F` | Background |
| Slate | `#5E6078` | Secondary text |
