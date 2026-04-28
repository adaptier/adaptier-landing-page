# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A static marketing landing page for the AdapTier industrial automation platform. No build step, no framework — pure HTML + CSS + vanilla JS served directly from the browser.

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

## Development

Open any `.html` file directly in a browser, or serve locally:

```bash
# Python (no install needed)
python3 -m http.server 8080

# Node.js
npx serve .
```

There are no tests, no lint commands, and no package.json — this is intentional per the PRD.

## File Structure

| File | Purpose |
|------|---------|
| `index.html` | Main landing page (production candidate) — all CSS and JS are inline |
| `landing-concept-a/b/c.html` | Earlier design explorations, kept for reference |
| `images/screenshot-plc.png` | Product screenshot: FBD editor — used as hero visual |
| `images/screenshot-configurator.png` | Product screenshot: Configurator + live debug — used as hero visual |
| `favicon.svg` | Inline SVG favicon |
| `LANDING-PAGE-PRD.md` | Full design spec: color tokens, typography, section content, layout rules |
| `adaptier-feature-map.md` | Authoritative source for all product capabilities, copy, and technical claims |

## Architecture

`index.html` is fully self-contained: CSS custom properties, all component styles, and the live-debug animation JS are all inline. No external dependencies except Google Fonts (JetBrains Mono + Inter).

### Design System (defined in `index.html` `:root`)

The design language mirrors the AdapTier product UI exactly. Key tokens:

- `--bg: #1a1e24` / `--surface: #21262d` / `--surface-raised: #282e38` — dark charcoal hierarchy
- `--accent: #f5a623` — amber, used for primary CTA (matches "Go Online" button in product)
- `--teal: #4ec9b0` — data values, BOOL wire color
- `--pink: #e879a0` — REAL type indicators
- `--green: #3fb950` — online/connected status dots
- `--mono: 'JetBrains Mono'` / `--sans: 'Inter'` — typography pair

**Do not** substitute generic rounded sans-serifs (Poppins, Nunito, Syne, etc.).

### Key UI Patterns

- **Status dots**: 6–8px circles with matching `box-shadow` glow (e.g. `0 0 8px #3fb950`)
- **Type pills**: Rounded badges with colored text, dark background — colors match wire colors (teal = BOOL, pink = REAL)
- **Section labels**: Uppercase monospace, `--text-faint`, `letter-spacing: 0.14em`
- **Protocol chips**: Dark background, subtle border, green status dot, monospace font
- **Live debug rows**: `timestamp · path (muted) · value (teal, right-aligned)` — CSS `@keyframes` animation, no layout-triggering properties

### Content Sources

All product claims, numbers, and copy must come from `adaptier-feature-map.md` or `LANDING-PAGE-PRD.md`. Do not invent or approximate technical specs (bundle sizes, boot times, function code numbers, etc.).

## Responsiveness

Breakpoints: `1280px+` (desktop) · `960px` (tablet) · `640px` (mobile)

- Hero: 2-col on desktop → 1-col on mobile (screenshots stack below text)
- Feature cards: 3-col → 2-col → 1-col
- Protocol marquee: always visible, speed slows on mobile

## Performance Rules

- Animate only with `transform` and `opacity` — never layout-triggering properties
- Product screenshots use `loading="lazy"` except the hero image
- Preload hero fonts via `<link rel="preload">`
