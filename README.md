# NOVA SBE Canteen Waste Dashboard

Mobile-first MVP for tracking canteen production, sales, and waste, then turning that data into simple planning recommendations.

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Recharts
- Zustand

## What is included

- Seeded synthetic history covering about 12 weeks of weekday service
- Daily input workflow for entering multiple dishes for one day
- Dashboard, history, insights, and recommendations screens
- Explainable rule-based scoring for dish performance
- Local browser persistence for newly added entries

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Notes

- The app uses realistic fake data and does not depend on external APIs.
- New entries are stored in browser `localStorage` on top of the seeded demo data.
- Recommendation logic lives in `lib/analytics.ts` so it can be replaced later with real forecasting or API-backed data.
