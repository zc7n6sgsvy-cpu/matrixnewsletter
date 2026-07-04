# Matrix Newsletter

**matrixnewsletter.com** — Decode the signal. Weekly transmissions. Zero noise.

A beautiful terminal-inspired landing page for Matrix Newsletter. Exact recreation of the original design with live Matrix rain, text decode effects, animated counters, and working (mock) subscribe flows.

## Live

- Vercel: https://matrixnewsletter-five.vercel.app
- GitHub: https://github.com/zc7n6sgsvy-cpu/matrixnewsletter

## Tech

- Next.js 16 (App Router, Turbopack)
- TypeScript + Tailwind
- Self-contained Matrix canvas + animations (no external deps)

## Local dev

```bash
npm install
npm run dev
```

## Deploy

Connected to Vercel + GitHub. Every push to `main` auto-deploys.

## Custom domain

Add `matrixnewsletter.com` in the Vercel project dashboard (Domains tab). Follow the DNS instructions (CNAME or A records). The domain is already registered.

## Next steps ideas

- Real subscribe endpoint (e.g. Beehiiv / Mailchimp / Resend)
- Archive page with past issues
- RSS feed
- Admin for sending transmissions

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
