# AdapTier Landing Page — Product Requirements Document

**Version:** 1.0  
**Date:** 2026-04-20  
**Status:** Ready for implementation

---

## 1. Purpose & Goals

Build a marketing landing page for AdapTier that:
- Communicates the product's value to building automation integrators, BMS engineers, and OT/IT teams
- Uses the product's own UI design language as the visual foundation (consistency between marketing and product)
- Converts visitors to trial sign-ups and demo bookings
- Serves as the content hub for the platform

Primary CTA: **"Get Started"** (trial / sign-up)  
Secondary CTA: **"Book a Demo"**

---

## 2. Design Language

The landing page must feel like a natural extension of the product UI — not a generic SaaS landing page. A visitor who uses the product should immediately recognize the aesthetic.

### 2.1 Color Palette

Extracted directly from the AdapTier PLC and Configurator UI screenshots:

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#1a1e24` | Page background (main dark charcoal) |
| `--surface` | `#21262d` | Cards, panels, sidebars |
| `--surface-raised` | `#282e38` | Elevated elements, hover states |
| `--border` | `rgba(255,255,255,0.08)` | Dividers, panel borders |
| `--border-muted` | `rgba(255,255,255,0.05)` | Subtle separators |
| `--text` | `#cdd6e0` | Primary text |
| `--text-muted` | `#8892a4` | Secondary text, labels |
| `--text-faint` | `#4a5568` | Section headers, uppercase labels |
| `--accent-amber` | `#f5a623` | Primary CTA, key highlights (matches "Go Online" button) |
| `--accent-amber-dim` | `rgba(245,166,35,0.12)` | Amber backgrounds |
| `--teal` | `#4ec9b0` | Data values, live readings, BOOL wire color |
| `--pink` | `#e879a0` | REAL type indicators, type-wire colors |
| `--green` | `#3fb950` | Online/connected status dots |
| `--blue` | `#58a6ff` | Selected state, links |
| `--red` | `#f85149` | Error state |

### 2.2 Typography

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Display / Hero | `JetBrains Mono` or `IBM Plex Mono` | 700–800 | Matches the monospace feel of "ADAPTIER PLC" header |
| Body | `Inter` | 300–500 | Clean, readable |
| Code / Values | `JetBrains Mono` | 400–600 | Data values, paths, code snippets |
| Section labels | Body, uppercase, letter-spacing 0.12em | 500 | Like "TASKS", "POUS", "IO MAPPING" in the sidebar |

**Do not use**: generic rounded sans-serifs (Syne, Nunito, Poppins, etc.)

### 2.3 UI Component Patterns

Carry over directly from the product UI:

- **Status dots**: Small circles (6–8px) in green/amber/red with faint matching glow. Used throughout for "online", "connected", "error" states.
- **Type pills/tags**: Inline rounded badges (e.g. `REAL`, `BOOL`, `FBD`) — dark background, colored text border. Colors match wire colors: teal for BOOL, pink for REAL.
- **Panel chrome**: Dark surface (`--surface`) panels with very subtle borders. Section headers in uppercase small text (`--text-faint`), with a `+` or action icon on the right.
- **Amber button**: The primary CTA button. Solid amber background, dark text, slightly rounded (4px). This is the "Go Online" button translated to marketing context.
- **Tree rows**: Highlighted row style (blue-indigo background) for selected states — recreated in product UI mockup sections.
- **Code editor block**: Dark Monaco-style block with syntax-highlighted JS, line numbers, used for the Script handler feature.
- **Live debug rows**: Timestamp + path (muted) + value (teal, right-aligned). This is a key visual that shows the product is alive.

### 2.4 Visual Motifs

- **Grid background**: Very subtle dot grid or line grid at low opacity, like the FBD canvas background.
- **Colored wires**: Use SVG curved lines (teal for BOOL, pink for REAL) as decorative elements in FBD-related sections — echoing the FBD canvas wire aesthetic.
- **Status glow**: Online status dots have a faint radial glow (e.g. `box-shadow: 0 0 8px #3fb950`).
- **Data stream**: Animated live-debug-style rows (timestamp + path + value) as a background or hero visual element.
- **Panel stacking**: Slightly overlapping panel cards to suggest the multi-panel layout of the product.

---

## 3. Hero Asset Strategy

**Use the actual product screenshots** as the hero visuals. The screenshots show:
1. The FBD editor (PLC) — shows programming complexity and visual appeal
2. The Configurator — shows the tree/config/debug workflow

These are more authentic and credible than any mocked UI. Place them as:
- Overlapping or side-by-side panels with a slight perspective/shadow treatment
- The FBD screenshot (larger, behind) with the Configurator (in front, offset)
- Or a single focused screenshot with a live-debug data stream visible

Screenshot file paths (sourced from user):
- `/mnt/c/Users/NiclasKäld/OneDrive - Styrfabriken AB/Bilder/Skärmbilder/adaptier-landing-page-2026-04-20_1.png` (PLC FBD editor)
- `/mnt/c/Users/NiclasKäld/OneDrive - Styrfabriken AB/Bilder/Skärmbilder/adaptier-landing-page-2026-04-20_2.png` (Configurator + live debug)

---

## 4. Page Sections

### 4.1 Navigation

**Content:**
- Logo: "ADAPTIER" in monospace, bold — or use product wordmark if available
- Links: Product · Protocols · PLC · Deploy · Docs · Pricing
- CTA button: "Get Started" (amber, primary)

**Design:**
- Sticky, dark background `--bg` with border-bottom
- Height: 58px
- Backdrop blur when scrolled
- Logo with small green status dot (always "online")

---

### 4.2 Hero

**Headline (primary):**
> From field device to NATS JetStream — in minutes.

**Subheadline:**
> AdapTier bridges Modbus TCP, M-bus, OPC-UA, BACnet, and HTTP to NATS JetStream. Comes with a browser-based IEC 61131-3 PLC IDE, hot-reload config, and edge deployment built in.

**CTAs:**
- Primary: "Get Started Free" (amber button)
- Secondary: "View Docs →" (text/ghost)

**Badge:**
- `● IEC 61131-3 Certified Runtime` — small status badge above headline

**Visual:**
- Right side: The two product screenshots, stacked/overlapping with drop shadow
- The PLC screenshot (larger, behind/above), Configurator screenshot (in front/below)
- Subtle animated data stream rows in background (like live debug panel)
- Faint grid behind the visual

**Layout:** 2-column — text left, screenshots right. Collapse to single column on mobile.

---

### 4.3 Protocol Support Belt

**Content:** Scrolling marquee of supported protocols/transports:

`Modbus TCP` · `M-bus TCP` · `OPC-UA` · `BACnet/IP` · `HTTP REST` · `NATS JetStream` · `MQTT` · `SparkPlug B`

**Design:**
- Dark surface bar (`--surface`), border top and bottom
- Each item: a "chip" styled like the product's type tags — dark background, subtle border, status dot (green), monospace font
- Fade mask on left/right edges
- Label above: `SUPPORTED PROTOCOLS & TRANSPORTS` in small uppercase

---

### 4.4 Feature Highlights (3-column grid)

**Headline:** `The platform. Not a point tool.`

**3 cards:**

1. **Hot-Reload. Zero Downtime.**
   - Change protocol configs or PLC logic in the browser. The running service reloads atomically via NATS KV watch — no restart, no data gap.
   - Tag: `KV-watch atomic swap`

2. **Browser PLC IDE**
   - IEC 61131-3 FBD, Ladder, SFC, and Structured Text with live online debugging, force variables, and version snapshots.
   - Tag: `IEC 61131-3 Edition 3`

3. **Edge-to-Cloud via NATS**
   - Every poll reading streams to NATS JetStream. 850 KB runtime boots in under 2 seconds on Raspberry Pi.
   - Tag: `ARM64 + AMD64`

**Design:**
- Cards styled as product panels: `--surface` background, subtle border, section header style icon label
- Icon/visual: use a small inline "preview" — e.g. a mini FBD node diagram, a mini data stream, a mini deploy command

---

### 4.5 Protocol Deep-Dive

**Headline:** `Every protocol. Production-ready.`

**Sub:** Stop writing custom integrations. AdapTier handles the protocol complexity.

**Content:** Table or card grid showing each protocol:

| Protocol | Direction | Key Capability |
|----------|-----------|----------------|
| Modbus TCP | Read + Write | FC1–4 reads, FC5/6/15/16 writes, 247 unit IDs |
| M-bus TCP | Read + Scan | Auto-discover meters 1–250, DIF/VIF decoding |
| OPC-UA | Read + Write | MonitoredItem subscriptions, session reconnect |
| BACnet/IP | Read + Write | COV subscriptions, WriteProperty with priority |
| HTTP REST | Read + Write | Polling + push, custom transforms |

**Design:**
- Table styled to match the product's panel style (dark rows, subtle hover highlight like tree row selection)
- Protocol name in monospace bold
- Pills for Read/Write/Scan status

---

### 4.6 "How it Works" — 3 Steps

**Headline:** `Up in three steps.`

**Steps:**
1. **Configure in the browser** — Add devices in the Configurator UI. Scan M-bus to auto-discover meters. Map registers to named data points. Save — goes live instantly.
2. **Deploy to the edge** — `adaptier-agent deploy app.zip --node pi-01`. Boots in under 2 seconds. Rollback in one command.
3. **Data flows to NATS** — Every reading publishes to NATS JetStream. Connect dashboards, historians, PLC logic, or your own consumers.

**Design:**
- Step numbers styled like the PLC section counters (large faint monospace numeral behind)
- Each step has a small inline code/path snippet styled as a dark code block
- Horizontal layout on desktop, vertical on mobile

---

### 4.7 PLC IDE Feature Spotlight

**Headline:** `A PLC IDE that lives in the browser.`

**Sub:** Full IEC 61131-3 programming — FBD, Ladder Diagram, SFC, and Structured Text — with live online debugging, force variables, version snapshots, and NATS I/O mapping. No installation. Deploy over NATS.

**Visual:** The PLC FBD screenshot (full width or large), with callout annotations:
- "Live value badges on every wire"
- "Drag-and-drop function block palette"
- "Force variables during online debug"
- "NATS I/O mapping in global vars"

**Feature list (beneath visual):**
- 4 IEC languages: FBD · LD · SFC · ST
- 10 stdlib FBs: TON, TOF, TP, CTU/CTD/CTUD, SR/RS, R_TRIG/F_TRIG
- ~120 standard functions + 70+ type conversions
- GCD-based multi-task scheduler
- RETAIN persistence across power loss
- Version history with color-coded diffs

**Design:**
- Full-width section, screenshot centered with annotation overlays
- Feature list in a 2-column pill/chip grid below

---

### 4.8 Live Debug Showcase

**Headline:** `See your data. Right now.`

**Sub:** The live debug panel shows every poll reading as it arrives — path, value, unit, timestamp. Select a poll group in the tree and data streams in instantly via WebSocket.

**Visual:** Animated recreation of the live debug panel (bottom of Configurator screenshot):
```
21:30:58,900    elm-1.V_L3              229.8
21:30:58,900    elm-1.V_L2              229.3
21:30:58,900    elm-1.V_L1              229.3
```
Real animated CSS rows appearing/fading, timestamps ticking, values in teal.

**Design:**
- Dark panel, monospace font, teal values right-aligned — exactly matching the product
- Rows animate in from the bottom and fade out at top (CSS)

---

### 4.9 AdapTier Agent — Edge Deployment

**Headline:** `Deploy anywhere. Roll back instantly.`

**Sub:** AdapTier Agent is a lightweight NATS-controlled edge deployment manager. Deploy zip packages to edge nodes, manage lifecycle via pm2, and roll back in one command — no SSH required.

**Feature bullets:**
- Zip-based deployment over NATS
- Versioned with instant rollback
- pm2 process management (auto-restart, crash recovery)
- NODE_ID auto-detected from MAC address
- Docker + docker-compose ready
- ARM64 + AMD64

**Visual:** Small CLI code block showing:
```bash
adaptier-agent deploy app.zip --node pi-01
adaptier-agent rollback myapp --node pi-01
adaptier-agent status --node pi-01
```

---

### 4.10 Final CTA

**Headline:** `Your field devices deserve better than custom scripts.`

**Sub:** AdapTier gives building automation teams a production-ready platform that grows with your deployment.

**CTAs:**
- "Get Started Free" (amber button)
- "Book a Demo" (ghost/outlined)

**Design:**
- Full-width, dark gradient background
- Faint radial glow centered (amber)
- Same amber button as nav

---

### 4.11 Footer

**Content:**
- Logo + tagline: "Industrial automation platform"
- Links: Docs · GitHub · Protocol Support · Pricing · Contact
- Copyright: © 2026 AdapTier

**Design:**
- Dark surface `--surface`
- Minimal, single row or 2-column

---

## 5. Technical Requirements

### 5.1 Stack

- **Framework**: Static HTML + CSS + vanilla JS (no build step required for initial version). Optional: Vite + vanilla TS if bundling needed.
- **No heavy frameworks**: No React, no Vue unless explicitly needed.
- **Fonts**: Load via Google Fonts (JetBrains Mono + Inter) or bundle via @font-face.
- **Images**: Product screenshots used as `<img>` with `loading="lazy"`. Serve as PNG or WebP.
- **Animations**: CSS-only where possible. JS only for the live-data-stream animation.

### 5.2 Responsiveness

- **Breakpoints**: 1280px+ (desktop), 960px (tablet), 640px (mobile)
- Hero: 2-col on desktop → 1-col on mobile (screenshots hidden or below text)
- Protocol belt: Always visible, marquee speed slows on mobile
- Feature cards: 3-col → 2-col → 1-col

### 5.3 Performance

- Lazy-load screenshots below the fold
- Animate only with `transform` and `opacity` (no layout-triggering properties)
- Preload hero fonts

### 5.4 Accessibility

- Sufficient contrast ratios (WCAG AA) on all text
- Semantic HTML: `<nav>`, `<section>`, `<h1>`–`<h3>` hierarchy
- `alt` text on all product screenshots

---

## 6. Content Guidelines

- **Voice**: Direct, technical, confident. Not salesy. Speak peer-to-peer with BMS engineers.
- **Avoid**: Marketing fluff ("revolutionary", "game-changing", "seamless"), excessive exclamation marks
- **Use**: Specific numbers (850 KB, <2s, FC3, 247 unit IDs), protocol names, real code snippets
- **Code examples**: Should be real AdapTier syntax, not pseudocode
- **Tone reference**: The Evil Martians study finding — "clever and simple", avoid "salesy BS"

---

## 7. Page Flow Summary

```
Nav (sticky)
│
├── Hero — headline + screenshots + data stream
├── Protocol belt — marquee
├── Feature cards (3-col) — hot-reload, PLC IDE, edge deploy
├── Protocol table — all 5 protocols
├── How it works (3 steps)
├── PLC IDE spotlight — annotated screenshot
├── Live debug showcase — animated data stream
├── Agent / edge deployment — CLI preview
└── Final CTA
    └── Footer
```

---

## 8. Assets Needed

| Asset | Source | Notes |
|-------|--------|-------|
| PLC FBD editor screenshot | `/mnt/c/Users/NiclasKäld/.../_1.png` | Use as-is, hero visual |
| Configurator + live debug screenshot | `/mnt/c/Users/NiclasKäld/.../_2.png` | Use as-is, hero + debug section |
| AdapTier logo (SVG) | From product repo or create inline | Check `adaptier-configurator-ui/` for existing logo |
| Protocol icons | Not required — use styled text chips | Avoid random icon sets |

---

## 9. Out of Scope (v1)

- Blog / changelog
- Pricing page (linked, not built)
- Auth / sign-up form (CTA links to external)
- Localization
- Dark/light mode toggle (dark only)
- Analytics integration (add later)
