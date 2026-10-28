# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

The adaptier.io landing page: one static page (`index.html` + `styles.css` + `main.js`), no build
step, no framework. Five pillars for a BMS buyer — integration engine, PLC, operator screens, fleet &
updates, distributed BMS. Design + decisions: adaptier-umbrella
`docs/superpowers/specs/2026-10-15-landing-page-redesign-design.md`.

## Public Repo — Identity Policy

This is a public GitHub repo. **All commits must use the GitHub privacy identity:**

- Name: `sf-nika`
- Email: `1378945+sf-nika@users.noreply.github.com`

Never commit with a personal name or real email. The local `.git/config` is preset, and a `.githooks/pre-commit` hook blocks mismatched identities. If a fresh clone misses the hook, run:

```bash
git config core.hooksPath .githooks
git config user.name  "sf-nika"
git config user.email "1378945+sf-nika@users.noreply.github.com"
```

Also avoid putting personal names, emails, or absolute Windows/OneDrive paths into any tracked file (PRDs, comments, screenshot metadata).

## Claims rule

Every factual sentence must map to a **verified** row in that spec's §5 claims table (the claim ID is
in an HTML comment next to the sentence). New fact → new row, verified against the code first. A
claim that cannot be verified is not published.

**Differentiators only** (spec §11, 2026-10-28): state what sets AdapTier apart from a traditional
PLC / SCADA / BMS stack. Do not list what a BMS buyer takes for granted (quality flags, alarms with
acknowledgement, history charts, RETAIN, FBD/ST, COV, limit-checked popups, function counts) — it reads
as a salesman listing basics. The protocol strip is the one place for "speaks your buses". `tools/verify` enforces the mechanical parts
(banned words, unmapped numbers, NATS named once in the footnote).

## Development

    python3 -m http.server 8080                 # view
    cd tools/verify && npm install && npm test  # static + Playwright checks (system chromium)

## Demo link

`DEMO_URL` in `main.js`. Empty = every `[data-demo]` element stays hidden. Set a `mailto:` or
https URL to show all "Book a demo" buttons.

## Screenshots

`images/<name>.webp` + `@2x`, produced by `python3 tools/webp.py <png> <name> <width>` from captures
against demo data only (HMI demo mode, bms-simulator, scratch PLC runtime, throwaway fleet stack —
never a live edge or a production control plane). No customer names, tags, IPs or MACs in any image.

## Deployment

Every push to `main` deploys via `.github/workflows/deploy.yml`, which publishes only `index.html`,
`styles.css`, `main.js`, `favicon.svg`, `CNAME`, `.nojekyll`, `images/*.webp` and `images/og.png`.
A new file the page needs must be added to that `cp` list **and** to `SERVED` in `tools/verify/serve.mjs`.

## Design system

Tokens in `styles.css :root` mirror the product UI (amber `--accent` = primary action, teal = values,
pink = REAL, green = online). Fonts: JetBrains Mono + Inter only. Animate only `transform`/`opacity`;
everything stops under `prefers-reduced-motion`. Breakpoints 1280 / 960 / 640.

## Kept for reference (not served)

`landing-concept-*.html`, `LANDING-PAGE-PRD.md`, `adaptier-feature-map.md` — April 2026 material;
do not take copy from them.
