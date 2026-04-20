# Mintmelon

Personal site — live at [www.mintmelon.ca](https://www.mintmelon.ca).

Next.js 15 App Router + Tailwind, statically exported to GitHub Pages.
Bilingual (`/en/`, `/zh/`), dark-first.

## Development

    pnpm install
    pnpm dev       # http://localhost:3000

## Build

    pnpm build     # next build → ./out/
    npx serve out  # preview the static export

## Deploy

`main` branch is deployed automatically by GitHub Actions
(`.github/workflows/deploy.yml`). The `CNAME` in `public/` keeps the
custom domain.

## Design & plans

- Design spec: `docs/superpowers/specs/2026-04-20-personal-site-redesign-design.md`
- Implementation plans: `docs/superpowers/plans/`
