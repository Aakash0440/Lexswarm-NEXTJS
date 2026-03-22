# LEXSWARM — Next.js Frontend

Navy/gold luxury legal defense UI connected to the Railway FastAPI backend.

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Connected to: https://lexswarm-production.up.railway.app

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → import repo
3. Add environment variable:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://lexswarm-production.up.railway.app`
4. Framework preset: **Next.js** (auto-detected)
5. Deploy

## Project structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with fonts
│   ├── page.tsx        # Main page (form ↔ results)
│   └── globals.css     # Design system + animations
├── components/
│   ├── BackgroundPaths.tsx  # Animated gold SVG paths
│   ├── Cursor.tsx           # Custom gold cursor
│   ├── Nav.tsx              # Top navigation
│   ├── CaseForm.tsx         # Hero + input + loading
│   └── CaseResultView.tsx   # Full results display
└── lib/
    └── api.ts          # Railway API client
```
