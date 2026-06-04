# Ian Goh Lab

Public operating map for Ian Goh's live products, AI infrastructure, growth playbooks, creative work, and venture experiments.

Live site: [lab.iangoh.com](https://lab.iangoh.com)

## What is included

- React, TypeScript, Vite, Tailwind CSS, Framer Motion, and Lucide React.
- Cinematic hero with MP4 background and responsive project orbit.
- Interactive Lab Bot connected through a Vercel serverless proxy.
- Project atlas covering Ian Goh, Portfolio / Ventures, GrowthDex, Web 4.0, LLM API, Bookflow, ExtractMint, WillCrafty, Kite Video, AI Cinema, Music, FourType, Praise Mountain, KIRA Money, Wang Haron & Goh, SkillRivals, and KITA.
- Vercel deployment config for `lab.iangoh.com`.

## Local Development

```bash
npm install
npm run dev
```

## Checks

```bash
npm run lint
npm run build
```

## Environment Variables

The Lab Bot expects these production variables on Vercel:

- `FREELLMAPI_BASE_URL`
- `FREELLMAPI_API_KEY`

Do not commit secrets. `.vercel/` is ignored.

## Deploy

```bash
npx vercel --prod --yes --project ianlab --force
```
