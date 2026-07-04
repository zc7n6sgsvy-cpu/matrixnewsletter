# Matrix Newsletter

**matrixnewsletter.com** — Decode the signal. Weekly transmissions. Zero noise.

A beautiful terminal-inspired publishing site. Fully integrated with **Beehiiv** for subscriptions + mass publishing.

## Live

- Vercel: https://matrixnewsletter-five.vercel.app
- GitHub: https://github.com/zc7n6sgsvy-cpu/matrixnewsletter

## Features (Beehiiv-ready)

- Real email subscriptions via Beehiiv API
- Dynamic archive + individual transmission pages (pulls from Beehiiv)
- Automatic RSS feed (`/feed.xml`)
- Live stats (subscriber count etc.)
- Gorgeous Matrix terminal aesthetic preserved

## Quick Start (Beehiiv Setup)

1. Create (or use existing) a publication at [beehiiv.com](https://www.beehiiv.com)
2. Go to **Settings → Integrations → API** and generate an API key
3. Copy your **Publication ID** (starts with `pub_`)
4. Add these environment variables in Vercel (or `.env.local`):

```bash
BEEHIIV_API_KEY=your_api_key
BEEHIIV_PUB_ID=pub_xxxxxxxxxxxxxxxx
```

5. Deploy / push. The site will immediately:
   - Accept real signups
   - Show your published posts in the archive
   - Render full issues at `/transmissions/[slug]`

## Local development

```bash
npm install
cp .env.example .env.local
# Add your Beehiiv keys to .env.local
npm run dev
```

## Publishing workflow (mass publishing)

- Write & publish issues directly inside Beehiiv (choose **Web + Email**)
- They automatically appear on this site within minutes (cached ~5 min)
- Use the beautiful `/archive` and individual transmission pages

## Tech

- Next.js 16 + App Router + TypeScript
- Beehiiv v2 API (subscriptions + posts)
- Custom dark phosphor aesthetic

## Routes

- `/` — Landing + subscribe
- `/archive` — Full list of transmissions
- `/transmissions/[slug]` — Individual issue reader
- `/feed.xml` — RSS

## Custom domain

Add `matrixnewsletter.com` in the Vercel dashboard → Domains. Point DNS as instructed.

## Recommended next

- Set up a Beehiiv webhook → Vercel deploy hook (for instant cache bust on publish)
- Add custom fields on subscribe (e.g. "How did you find us?")
- Style the Beehiiv reader content further if needed

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
