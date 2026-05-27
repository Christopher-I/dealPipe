# DealPipe — Design System (Pixel-Parity Spec)

_Author: CTO build · Date: 2026-05-27 · Sister docs: `SPEC.md` (build spec). This doc supersedes §3 of `SPEC.md` — anywhere they differ, this wins._

---

## 0. How to read this doc

This is the **complete visual reference** derived from the dashboard image. Every color, gradient, radius, weight, and component-level subtlety is logged so an implementer can recreate the dashboard without re-deriving anything by eye.

The document is organized so you can either:
- Read top-to-bottom for the full system (foundation tokens → components), or
- Jump to §8 "Component anatomy" and use it as a build checklist while implementing each card.

**Rule:** components reference tokens from §1–§5 only. No raw hex codes in component CSS. If a value doesn't exist in §1–§5 and it's needed, add it to §1–§5 first, then use it.

---

## 1. Reading the composition

The dashboard is a **two-layer warm-neutral environment**:

- **Page background (the table):** a cooler, slightly darker warm gray (`--color-page`). Reads almost like uncoated paper.
- **Dashboard surface (the workspace):** a lighter, slightly warmer off-white (`--color-bg`). Sits on top of the page like a sheet on a desk, with a generous outer radius (~32px). No drop shadow — the depth is purely the value step between page and dashboard.

Then on top of the dashboard surface sit **cards** in pure white (`--color-surface`), each with a near-invisible hairline border. The whole system relies on these three steps of luminance — page → dashboard → card — to create depth. No shadows are used anywhere in the layout.

Inside cards, there's a **fourth subtle layer**: cream-tinted "wells" (`--color-surface-warm`) used for icon backgrounds, and peach-tinted "action wells" (`--color-surface-peach`) used for inline action chips that lean on the accent. These two near-neutral tints are easy to miss but they're load-bearing — they're what makes the dashboard feel rich rather than flat.

Accent is a single coral that ranges from a deep terracotta to a pale peach via opacity stacking (Annual Profits) or true tint variants (chip backgrounds). The only true dark in the system is the Growth Rate dial's body and a handful of dark CTAs (Receive button, arrow circles, the № logo).

---

## 2. Color — every value in the image

### 2.1 Surfaces and backgrounds

| Token | Hex | Where it appears |
|---|---|---|
| `--color-page` | `#E8E5E0` | Outer page/viewport background (slightly cooler than dashboard) |
| `--color-bg` | `#F1EFEC` | Main dashboard surface (the big rounded container) |
| `--color-surface` | `#FFFFFF` | All white cards (VISA card, Total income, Annual profits, Activity manager, etc.) |
| `--color-surface-warm` | `#F6F2EC` | Icon wells (the circular background behind small icons like the clock, refresh, graph) and nested chip-card backgrounds in Business plans list |
| `--color-surface-peach` | `#F9EAE2` | Action chip backgrounds ("Edit cards limitation", "View on chart mode") and the `+9.3%` delta pill background |
| `--color-ink` | `#1A1A1A` | True near-black: Growth Rate dial body, Receive button, № logo disc, arrow-pill on Show my Tasks |
| `--color-ink-2` | `#262524` | Subtle alternate to `--color-ink` where a card is on dashboard bg vs on card surface — useful for the Growth Rate ring's non-active arc if it reads slightly lifted from pure ink |

### 2.2 Borders

| Token | Hex | Where it appears |
|---|---|---|
| `--color-border` | `#E5E1DA` | Default hairline on white cards over `--color-bg` |
| `--color-border-strong` | `#D9D4CC` | Slightly stronger edge — used on the date "19" circle and the microphone button (they read as slightly more defined) |
| `--color-border-on-warm` | `#EDE6DC` | Hairline when a card sits over `--color-surface-warm` (rare — only inner sub-cards) |

### 2.3 Type colors

| Token | Hex | Use |
|---|---|---|
| `--color-text` | `#0F0F0F` | Primary text — card titles, metric numerics (the digit part) |
| `--color-text-2` | `#3D3A36` | Body text inside cards, button labels, list items |
| `--color-text-muted` | `#6B6661` | Small labels: "Total income", "Linked to main account", "Monthly regular fee", "Review rating" |
| `--color-text-subtle` | `#A29D95` | Placeholder text in inputs: "Start searching here...", "Search in activities...", "Just ask me anything!" |
| `--color-text-on-ink` | `#FFFFFF` | Text on dark surfaces (Receive button, Growth Rate dial 36%) |
| `--color-text-on-accent` | `#FFFFFF` | Text on coral surfaces (Show my Tasks, Enable) |

### 2.4 Accent (coral) family

This is the **single accent system** for the whole design. Multiple values, but all in the same hue family.

| Token | Hex | Use |
|---|---|---|
| `--color-accent` | `#E15B3F` | Solid coral — Show my Tasks pill base, Enable button, $4K center ring, coral filter dot, bar-chart "filled" bars, notification dot on calendar icon, +9.3% text |
| `--color-accent-deep` | `#C94427` | Bottom end of the Show my Tasks pill gradient, end of the Growth Rate arc gradient, hover/pressed state |
| `--color-accent-bright` | `#F18A6E` | Top end of the Growth Rate arc gradient (lighter coral that the arc starts with at 12 o'clock) |
| `--color-accent-glyph` | `#E15B3F` | The `$` symbol color in large metric numbers (`$ 23,194.80`, `$ 8,145.20`, `$ 16,073.49`) — same as `--color-accent`, named separately so the rule is explicit |
| `--color-accent-soft-1` | `rgba(225,91,63,0.18)` | Outermost ring of Annual Profits ($14K) — palest |
| `--color-accent-soft-2` | `rgba(225,91,63,0.35)` | Annual Profits $9.3K ring |
| `--color-accent-soft-3` | `rgba(225,91,63,0.60)` | Annual Profits $6.8K ring |
| `--color-accent-soft-4` | `rgba(225,91,63,1)` | Annual Profits $4K center (solid) |
| `--color-accent-bar-mute` | `#F0E0D8` | The "off" bars in the $43.20 bar chart (the alternating muted bars) |
| `--color-accent-ring-track` | `#F1ECE5` | The non-active portion of the Growth Rate dial ring (the cream arc that the coral arc sits within) |

### 2.5 Neutrals used inside the dark dial

The Growth Rate dial inverts the system locally. Inside its dark body:

| Token | Hex | Use |
|---|---|---|
| `--color-dial-bg` | `#1A1A1A` | The dial body fill |
| `--color-dial-track` | `#F1ECE5` | The cream arc (the "remaining" portion of the ring) — same as `--color-accent-ring-track` |
| `--color-dial-accent-top` | `#F18A6E` | Light end of the coral gradient arc (~12 o'clock anchor) |
| `--color-dial-accent-bottom` | `#C94427` | Dark end of the coral gradient arc (~5 o'clock end) |
| `--color-dial-text` | `#FFFFFF` | "36%" |
| `--color-dial-text-muted` | `rgba(255,255,255,0.65)` | "Growth rate" label |

---

## 3. Gradients (every gradient in the image, catalogued)

There are **five** distinct gradients in the design. Two are obvious, three are subtle but materially affect the look.

### 3.1 Show my Tasks pill — vertical gradient

```
linear-gradient(
  180deg,
  #EB6A4D 0%,
  #E15B3F 50%,
  #D74D31 100%
)
```

Very subtle — about ±5% luminance from the midpoint. Without it the pill looks like a flat plastic chip; with it the pill picks up a soft "lit-from-above" quality. Apply only when the pill is at its resting size (≥40px high). On smaller variants drop to solid `--color-accent`.

### 3.2 Growth Rate dial — arc gradient

The active ~36% sweep is a **conic gradient** along the arc path. Implemented as an SVG stroke with a linear gradient that maps along the arc's tangent. Approximation:

```
arc stroke gradient:
  start (12 o'clock):    #F18A6E   (--color-dial-accent-top)
  end   (~5 o'clock):    #C94427   (--color-dial-accent-bottom)
```

In SVG: use `linearGradient` with `x1=0% y1=0% x2=100% y2=100%` and apply as `stroke` on a `path` describing the arc. The remaining ~64% of the ring is the cream `--color-dial-track` color, drawn as a separate stroked arc.

End caps on both arcs are `stroke-linecap: round`.

### 3.3 Annual Profits — opacity-stacked radial system

Not a CSS `radial-gradient`, but a **stack of four solid coral circles** with descending diameter and ascending opacity:

| Layer | Diameter (relative) | Color/opacity | Label position |
|---|---|---|---|
| Ring 1 (outer) | 100% | `--color-accent-soft-1` (0.18) | "$14K" — right edge of ring |
| Ring 2 | 75% | `--color-accent-soft-2` (0.35) | "$9.3K" |
| Ring 3 | 52% | `--color-accent-soft-3` (0.60) | "$6.8K" |
| Ring 4 (center) | 30% | `--color-accent-soft-4` (1.00) | "$4K" |

All circles share the same center point. The visual gradient effect emerges from the opacity stacking against the white card surface.

**Important:** the rings are not stroked rings; they're **filled circles** layered on top of each other. The outer ring appears as a ring only because the next-smaller solid circle sits on top of it.

Label text in each ring is `--color-accent` at full opacity (so it reads even on the palest outer ring) and is positioned just inside the right edge of each circle's diameter.

### 3.4 Page → dashboard luminance step

Not a literal gradient but a **two-tone background relationship**:

```
viewport: #E8E5E0
  └─ dashboard rounded container: #F1EFEC, border-radius: 32px, margin: ~16px on all sides
```

There is a ~3% luminance step between the two. No border, no shadow on the dashboard container — the value step alone defines the edge. The dashboard container fills almost the entire viewport with consistent margin.

### 3.5 Subtle coral bar chart hover-tone (Activity manager $43.20 card)

The bars alternate between `--color-accent` (filled coral) and `--color-accent-bar-mute` (#F0E0D8). The "lit" bars all share a hint of vertical lightening at the top — a very faint `linear-gradient(180deg, rgba(255,255,255,0.12), transparent 40%)` on top of the coral fill. Easy to skip if it looks busy in implementation, but it's there in the reference.

---

## 4. Radii

| Token | Value | Use |
|---|---|---|
| `--radius-shell` | `32px` | The outer dashboard container (the sheet-on-desk) |
| `--radius-card-lg` | `28px` | Large cards (Annual profits, Activity manager) |
| `--radius-card` | `24px` | Standard cards (VISA, Total income, Main Stocks, Review rating) |
| `--radius-sub-card` | `20px` | Sub-cards inside Activity manager ($43.20, Business plans, Wallet Verification) |
| `--radius-chip` | `9999px` | All pills and chips (buttons, filter chips, search bars, status badges) |
| `--radius-input` | `16px` | Search inputs (the inner field, before being wrapped in a pill chip) |
| `--radius-icon-well` | `9999px` | Circular icon backgrounds (always perfect circles) |
| `--radius-dial` | `9999px` | Growth Rate dial (perfect circle) |

**Rule:** never invent a radius between these values. Pick the nearest token.

---

## 5. Typography

### 5.1 Family

`Inter Variable`, loaded via `next/font/google`. Fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`. If a designer prefers Söhne or General Sans for closer match, the swap is one line in `app/layout.tsx`.

### 5.2 Scale (the only sizes used)

| Token | Size | Weight | Line height | Use |
|---|---|---|---|---|
| `--text-display` | `40px / 2.5rem` | 500 | 1.1 | "Hey, Need help?" + sibling placeholder line |
| `--text-metric-xl` | `30px / 1.875rem` | 500 | 1.2 | Card metric numbers ("$ 23,194.80", "$ 16,073.49") |
| `--text-metric-lg` | `26px / 1.625rem` | 500 | 1.2 | "**** 2719", "13 Days", "$ 43.20", "36%" |
| `--text-metric-md` | `22px / 1.375rem` | 500 | 1.2 | "$ 8,145.20", smaller metric variants |
| `--text-headline` | `18px / 1.125rem` | 500 | 1.3 | "How is your business management going?", "Wallet Verification" |
| `--text-body` | `15px / 0.9375rem` | 400 | 1.45 | List items ("Bank loans", "Accounting"), button labels |
| `--text-label` | `13px / 0.8125rem` | 500 | 1.4 | Card section labels ("Total income", "Annual profits", "Main Stocks") |
| `--text-meta` | `12px / 0.75rem` | 400 | 1.4 | Sub-labels ("109 hours, 23 minutes", "Extended & Limited", "Linked to main account") |
| `--text-chip` | `12px / 0.75rem` | 500 | 1 | Pill/chip text ("Weekly", "Direct Debits", "Team", "+9.3%") |

### 5.3 Typography rules

- **Tabular numerals** on all metrics: `font-variant-numeric: tabular-nums`. Non-negotiable. Without this the `$23,194.80` will jitter when values change.
- **The `$` glyph in large metric numbers is colored `--color-accent`**, not `--color-text`. Wrap in a `<span>` with the accent color. Examples: Total income, Total paid, Main Stocks card amount. **Exception:** in smaller contexts where the `$` doesn't get visual emphasis (the "Monthly regular fee: $ 25.00" line on the VISA card, the "$ 43.20 USD" inside the bar-chart card), the `$` stays in `--color-text` — the rule only applies to the headline metric on each card.
- **Tracking:** display text and metrics use `letter-spacing: -0.01em`. Labels and meta stay at default.
- **All labels stay in title case, not uppercase.** The image uses sentence case throughout. Exceptions: stage names in deal pipeline (TBD when we build that).
- **Number formatting:** `$ 23,194.80` has a space between `$` and the digits. Implementer must respect this — `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })` returns `$23,194.80` without the space, so we manually compose with a space, or split sign and number and color them separately (which we have to do anyway because of the coral `$` rule).

---

## 6. Spacing

### 6.1 Card-level rhythm

| Context | Padding |
|---|---|
| Standard card (`--radius-card`) | `24px` |
| Large card (`--radius-card-lg`) | `28px` to `32px` (Annual profits uses generous space) |
| Sub-card | `20px` |
| Pill / chip | `8px 14px` (small), `12px 20px` (default), `16px 24px` (large CTAs like Enable) |
| Icon well | `8px` (icon centered, well is circular and sized to icon + 8px) |

### 6.2 Grid gap

Between top-level cards: `20px`. The full dashboard uses CSS Grid with explicit `grid-column` placement to recreate the reference layout (see §7).

### 6.3 Dashboard container

Outer margin from viewport edge: `16px` on all sides at desktop. Inner padding (inside the rounded container, before cards begin): `24px`.

---

## 7. Layout — the dashboard grid

The reference is a **12-column CSS Grid** with explicit row placement. Here's the inferred grid (desktop ≥ 1280px):

```
┌──────────────────────────────────────────────────────────────────────┐
│ Header row (full bleed, height auto)                                 │
│  [☰]  [№ Financial / Dashboard]    [+] [Dwayne]   [🔍 search bar]    │
│                                                                      │
│  [19][Tue,Dec][Show my Tasks→][📅]    Hey, Need help? 👋        [🎤] │
│                                       Just ask me anything!          │
├──────────────────────────────────────────────────────────────────────┤
│ Main grid (12 cols, ~20px gap)                                       │
│                                                                      │
│ ▕  cols 1     │ cols 2-4: VISA  │ cols 5-7: TotIn/Pd│ Lock│ 13 Days│2023│
│ ▕vertical    │                  │                   │ ▼   │  ▼    │ ▼ │
│ ▕action pill │                  │                   │ Growth Rate │MainStocks│
│              │                  │                   │   (dial)    │   ─────  │
│ ── Annual profits ──    ── Activity Manager (with 3 sub-cards) ──  │ Review  │
│                                                                    │ rating  │
└──────────────────────────────────────────────────────────────────────┘
```

Approximate column spans:

| Card | Row | Col span |
|---|---|---|
| Vertical action pill | rows 1-3 of main | 1 col, narrow |
| VISA card | row 1 | cols 2-4 (3 cols) |
| Total income / Total paid stack | row 1 | cols 5-7 (3 cols) — internally two stacked cards |
| System Lock | row 1 | col 8 (1 col, square-ish) |
| 13 Days | row 1 | col 9 (1 col, wider than Lock) — actually 1.5 col |
| 2022 / 2023 chart | row 1 | cols 11-12 (2 cols) |
| Growth Rate dial | row 2 | col 8 (1 col, circular) — centered between System Lock and Main Stocks |
| Main Stocks line | row 2 | cols 9-12 (4 cols) |
| Annual profits | rows 2-3 | cols 2-4 (3 cols) — extends downward |
| Activity manager | rows 2-3 | cols 5-9 (5 cols, the widest card) |
| Review rating | row 3 | cols 10-12 (3 cols) |

**This is not strict** — exact spans get fine-tuned during implementation against the reference image. The grid is a starting structure, not a contract.

At smaller breakpoints (< 1024px), the layout collapses to a 1-2 column stack. Mobile-responsive but not pixel-perfect on mobile — per `SPEC.md` §13.

---

## 8. Component anatomy

This section is a build checklist. Each card in the reference is broken down to the level a dev can implement from this alone.

### 8.1 Header — left cluster

- **Hamburger button:** circular, 40×40, `--color-surface` fill, `--color-border` 1px, three-line icon centered, icon color `--color-text-2`.
- **№ logo:** circular disc, 44×44, `--color-ink` fill, white serif "№" glyph centered. The "№" is a specific Unicode character (U+2116) — render in a serif fallback to match the image, or use an SVG to lock the look.
- **Title stack:** to the right of the № disc, two lines — "Financial" (`--text-label`, `--color-text`) on top, "Dashboard" (`--text-meta`, `--color-text-muted`) below.

### 8.2 Header — center/right cluster

- **+ button:** circular, 40×40, `--color-surface` fill, `--color-border` 1px, dark thin plus.
- **User pill:** rounded pill, height ~44, padded `8px 16px`. Contents (left-to-right): circular avatar (32×32, image), text stack "Dwayne Tatum" (`--text-body`, `--color-text`) on top, "CEO Assistant" (`--text-meta`, `--color-text-muted`) below.
- **Search pill:** rounded pill, height ~44, `--color-surface` fill, `--color-border` 1px, padded `12px 20px`. Contents: search icon (`lucide-search`, `--color-text-subtle`, 18×18) + placeholder text "Start searching here ..." (`--text-body`, `--color-text-subtle`).

### 8.3 Header — date + tasks cluster (second row)

- **Date "19" circle:** 64×64 circle, `--color-surface` fill, `--color-border-strong` 1px, centered "19" in `--text-metric-md`, weight 500, `--color-text`.
- **Date label stack:** "Tue," (`--text-body`, `--color-text`) on top, "December" (`--text-body`, `--color-text`) below — same size, same weight, two lines.
- **Show my Tasks pill:** large pill, height 56, padding `12px 12px 12px 28px`. Background: gradient from §3.1. Text: "Show my Tasks" in `--color-text-on-accent`, `--text-body`, weight 500. Right side: a black circular sub-button (40×40 circle, `--color-ink` fill) containing a white arrow icon (north-east arrow, `lucide-arrow-up-right`, 18×18, white).
- **Calendar button:** circular, 44×44, `--color-surface` fill, `--color-border` 1px, calendar icon centered (`lucide-calendar`, 18×18, `--color-text-2`). **Notification dot:** 8×8 circle, `--color-accent` fill, positioned absolute top-right of the calendar button (~2px inset from corner).

### 8.4 Header — AI prompt

- **Two-line display:** "Hey, Need help?" with a 👋 emoji at the end (native emoji, no recolor), in `--text-display`, weight 500, `--color-text`. Second line: "Just ask me anything!" in `--text-display`, weight 500, `--color-text-subtle` (it's a placeholder). A blinking text cursor sits at the start of the second line — implement as a `::before` pseudo-element with `animation: blink 1s steps(2) infinite`.

### 8.5 Header — microphone button

- **Mic button:** circular, 96×96 (large), `--color-surface` fill, `--color-border-strong` 1px, microphone icon centered (`lucide-mic`, 28×28, `--color-text-2`). No shadow.

### 8.6 Vertical action pill (left edge of main grid)

A thin vertical pill spanning ~120-160px tall, 44px wide, `--color-surface` fill, `--color-border` 1px, `--radius-chip`. Contents (top to bottom): a `+` icon (24×24, `--color-text-2`), a divider line (`--color-border`), a share icon (`lucide-share-2` or `lucide-corner-up-right`, 20×20, `--color-text-2`). The two icons are vertically padded ~24px apart.

### 8.7 VISA card

- **Card:** `--color-surface`, `--radius-card`, `--color-border` 1px, padding `24px`.
- **Top row:** VISA logo (left, blue-italic "VISA" or an SVG of the VISA wordmark in dark `#1A1F71` — Visa brand color, the one exception to our palette) + "Direct Debits ▾" pill (right, `--color-surface-warm` fill, `--color-border` 1px, `--text-chip`, `--color-text-2`, chevron-down icon).
- **Middle:** "Linked to main account" (`--text-meta`, `--color-text-muted`). Below: "**** 2719" with the masked dots followed by the last 4 digits — entire string in `--text-metric-lg`, `--color-text`. The asterisks should render as four bullet glyphs (•) and the "2719" in tabular numerics.
- **Buttons row:** two buttons side by side.
  - Receive: `--color-ink` fill, `--radius-chip`, padding `12px 28px`, "Receive" text in `--color-text-on-ink`, `--text-body`, weight 500.
  - Send: `--color-surface` fill, `--color-border` 1px, `--radius-chip`, padding `12px 28px`, "Send" text in `--color-text-2`.
- **Divider:** 1px line in `--color-border` spanning full card width.
- **Bottom row:** "Monthly regular fee" (`--text-meta`, `--color-text-muted`) over "$ 25.00" (`--text-metric-md`, `--color-text` — `$` stays dark here because it's a small metric per §5.3 exception). On the right of this row: an action chip "Edit cards limitation" — `--color-surface-peach` fill, `--radius-chip`, padding `8px 14px`. Inside the chip on the left: a small circular icon well (`--color-accent` fill, 28×28 circle) with a white pencil/edit icon. Chip text: "Edit" on top, "cards limitation" below — both small, `--color-text-2`.

### 8.8 Total income card

- **Card:** `--color-surface`, `--radius-card`, `--color-border` 1px, padding `24px`.
- **Top:** small icon well (left, `--color-surface-warm` fill, 36×36 circle) containing a refresh/circular-arrow icon (`lucide-rotate-cw` or `lucide-refresh-ccw`, 16×16, `--color-text-2`). On the right: "Weekly ▾" pill (`--color-surface-warm` fill, `--color-border` 1px, `--text-chip`, `--color-text-2`).
- **Middle:** "Total income" (`--text-label`, `--color-text-muted`). Below: "$ 23,194.80" — with `$` in `--color-accent` and the digits in `--color-text`, `--text-metric-xl`, weight 500, tabular numerics.

### 8.9 Total paid card

Same structure as 8.8 but with a different icon (a "history" or "clock-back" icon, `lucide-history`, in the well) and the action chip on the right of the metric row: "View on chart mode" — `--color-surface-peach` fill, `--radius-chip`, padding `8px 14px`, with a small circular icon well (`--color-accent` fill, 28×28) containing a white chart-up icon. Chip text: "View" on top, "on chart mode" below.

### 8.10 System Lock card

- **Card:** `--color-surface`, `--radius-card`, `--color-border` 1px, padding `24px`, square aspect.
- **Contents:** centered vertically — a padlock icon (`lucide-lock`, 28×28, `--color-text`), and below it "System Lock" (`--text-label`, `--color-text`).

### 8.11 13 Days card

- **Card:** `--color-surface`, `--radius-card`, `--color-border` 1px, padding `24px`.
- **Top:** clock icon well (`--color-surface-warm` fill, 36×36 circle, `lucide-clock` icon).
- **Middle:** "13 Days" (`--text-metric-lg`, `--color-text`). Below: "109 hours, 23 minutes" (`--text-meta`, `--color-text-muted`).
- **Dot grid:** at the bottom, a grid of small filled circles. Approximate dimensions: 10 columns × 4 rows = 40 dots, each 6×6, with 4px gap. The first ~24 dots are `--color-accent` (filled), the remaining are `--color-surface-warm` or `--color-border` (un-filled). Represents a 60% progress visualization.

### 8.12 2022 / 2023 chart card

- **Card:** `--color-surface`, `--radius-card`, `--color-border` 1px, padding `24px`.
- **Top-left:** chart icon well (small, `--color-surface-warm`, `lucide-bar-chart-2`).
- **Top-right:** two stacked chips — "2023" (`--color-accent` fill, white text) and "2022" (`--color-surface-warm` fill, `--color-text-2` text). The active year is the coral-filled chip.
- **Chart area:** A small grid background (light gray gridlines, `--color-border` at ~30% opacity) with two markers. The "2023" marker is a vertical coral line ending in a coral filled circle (~6px), positioned ~70% horizontally and ~30% vertically (high on the chart). The "2022" marker is a smaller gray vertical line + gray dot, positioned ~50% horizontally and ~70% vertically (lower). Implement with SVG.

### 8.13 Growth Rate dial card

- **Card:** circular, ~180×180, `--color-dial-bg` fill, `--radius-dial`, no border. Centered as a perfect circle.
- **Ring:** SVG. Center the dial. Two arcs:
  - Track arc: from ~5 o'clock counter-clockwise to ~12 o'clock (≈64% of the ring), stroke `--color-dial-track`, `stroke-width: 12`, `stroke-linecap: round`.
  - Active arc: from ~12 o'clock clockwise to ~5 o'clock (≈36%), stroke is a `<linearGradient>` from `--color-dial-accent-top` to `--color-dial-accent-bottom`, `stroke-width: 12`, `stroke-linecap: round`.
  - Both arcs have a small gap between them (the rounded caps create natural separation).
- **Center text:** "36%" in `--text-metric-lg`, weight 500, `--color-dial-text`. Below: "Growth rate" in `--text-meta`, `--color-dial-text-muted`.

### 8.14 Main Stocks line chart card

- **Card:** `--color-surface`, `--radius-card`, `--color-border` 1px, padding `24px`.
- **Top-left:** chart squiggle icon well (`--color-surface-warm`, `lucide-activity` or `lucide-trending-up`).
- **Top-right:** "$ 16,073.49" — `$` in `--color-accent`, digits in `--color-text`, `--text-metric-lg`, tabular.
- **Chart:** A smooth curve filling the card. Implement with Recharts `Area` set to transparent fill and `stroke: --color-accent`, `strokeWidth: 2.5`. Smooth (monotone). No grid, no axes, no labels. The line spans the full card width with no padding.
- **Bottom row:** "Main Stocks" (`--text-label`, `--color-text`) on the left, "Extended & Limited" (`--text-meta`, `--color-text-muted`) below. On the right: "+ 9.3%" pill — `--color-surface-peach` fill, `--radius-chip`, padding `6px 12px`, text in `--color-accent`, `--text-chip`, weight 500.

### 8.15 Annual profits card

- **Card:** `--color-surface`, `--radius-card-lg`, `--color-border` 1px, padding `28px`.
- **Top row:** "Annual profits" (`--text-label`, `--color-text`) on the left, "2023 ▾" chip on the right (`--color-surface-warm` fill, `--color-border` 1px, `--text-chip`).
- **Rings system:** centered in the remaining card area. Implement as four nested SVG `<circle>` elements per §3.3. Each ring's label is positioned at the right edge of its diameter, slightly inset, in `--color-accent`, `--text-meta`. Labels: "$14K", "$9.3K", "$6.8K", "$4K" — all in `--color-accent` regardless of opacity layer.

### 8.16 Activity manager card

- **Card:** `--color-surface`, `--radius-card-lg`, `--color-border` 1px, padding `28px`.
- **Top row:** "Activity manager" label (`--text-label`, `--color-text`) on the left. On the right, three controls:
  - Three-dots-vertical menu (`lucide-more-vertical`, 18×18, `--color-text-2`)
  - Expand/collapse arrows (`lucide-chevrons-down-up` or similar, 18×18, `--color-text-2`)
  - "Filters" pill — `--color-surface` fill, `--color-border` 1px, `--radius-chip`, padded `6px 12px`, filter funnel icon + "Filters" text in `--text-chip`, `--color-text-2`.
- **Search + filter row:** Search input on the left (`--color-surface-warm` fill, `--radius-chip`, `--text-body`, `--color-text-subtle` placeholder "Search in activities ..."). On the right, three filter chips:
  - "Team" — `--color-surface` fill, `--color-border` 1px, with a small `--color-accent` filled dot (6×6) inside.
  - "Insights ×" — `--color-surface-warm` fill, with an `×` close icon.
  - "Today ×" — same as Insights.
- **Sub-cards row:** three sub-cards side by side, each `--color-surface`, `--radius-sub-card`, `--color-border-on-warm` 1px (since they sit on `--color-surface` already — actually use `--color-border` for these), padding `20px`. Detailed below in 8.17–8.19.

### 8.17 Sub-card: $43.20 USD

- **Top row:** "$ 43.20" (`--text-metric-lg`, `--color-text`, tabular) immediately followed by "USD" (`--text-meta`, `--color-text-muted`). The `$` stays dark per §5.3 exception (small metric inside a sub-card).
- **Middle:** mini bar chart, full sub-card width, ~80px tall. ~12 bars total. Bars alternate between `--color-accent` (filled) and `--color-accent-bar-mute` (#F0E0D8). Heights vary — some short, some tall — looking like a real metric distribution. The center bar is tallest. Implement with Recharts or a simple SVG.
- **Bottom:** 3 pagination dots centered. Middle dot is `--color-accent` (active), others are `--color-text-subtle` at 40% opacity.

### 8.18 Sub-card: Business plans

- **Top row:** "Business plans" (`--text-label`, `--color-text`) on the left, three-dots-vertical menu on the right.
- **List:** three rows, each padded `8px 0`, with:
  - Left: small circular icon well, `--color-surface-warm` fill, 28×28 — contains a small icon in `--color-accent` (bank for "Bank loans", bar-chart for "Accounting", users for "HR management").
  - Right of icon: row label in `--text-body`, `--color-text-2`.
- **Selected/hover state:** the first item ("Bank loans") appears slightly more pronounced — its row has a `--color-surface-warm` background pill spanning the full row width (`--radius-chip`, padded `8px 12px`). The others are inline only.

### 8.19 Sub-card: Wallet Verification

- **Illustration:** at the top, centered — a stylized sun (orange circle with radiating short rays) about 56×56. Custom SVG, single color `--color-accent`, no shading.
- **Title:** "Wallet Verification" (`--text-headline`, `--color-text`, weight 500).
- **Description:** "Enable 2-step verification to secure your wallet." (`--text-meta`, `--color-text-muted`, ~2 lines).
- **CTA button:** full-width pill at the bottom, `--color-accent` fill (solid, no gradient at this size), `--radius-chip`, padding `12px 0`, centered "Enable" text in `--color-text-on-accent`, `--text-body`, weight 500.

### 8.20 Review rating card

- **Card:** `--color-surface`, `--radius-card`, `--color-border` 1px, padding `24px`.
- **Top row:** a "drag handle" indicator on the left (a short horizontal pill — like `▬`, 32×6, `--color-text-subtle`). On the right: `×` close icon (`lucide-x`, 18×18, `--color-text-2`).
- **Label:** "Review rating" (`--text-meta`, `--color-text-muted`).
- **Headline:** "How is your business management going?" (`--text-headline`, `--color-text`, weight 500). Two lines.
- **Face row:** five circular buttons in a row, each 44×44, `--color-surface` fill, `--color-border` 1px, containing a single-line stroke face icon (custom SVG or lucide's `lucide-frown`, `lucide-meh`, `lucide-smile` etc.). The face icons are minimal line drawings, all in `--color-text-2`. No fill colors on the faces.

### 8.21 Microphone button (right of AI prompt)

Already covered in §8.5.

---

## 9. Iconography rules

- **Source:** `lucide-react`. If a needed icon isn't in lucide, use a custom SVG matching lucide's stroke style (`stroke-width: 1.75`, `stroke-linecap: round`, `stroke-linejoin: round`).
- **Default icon size:** 18×18 inside buttons, 16×16 inside chips, 20-24×20-24 inside icon wells, 28×28 in feature contexts (mic button).
- **Default icon color:** `--color-text-2`.
- **Color exceptions:**
  - Icons inside action chips' inner wells (e.g. the edit pencil in "Edit cards limitation") are white on coral.
  - Icons inside Business plans list wells are `--color-accent` on `--color-surface-warm`.
  - The sun illustration on Wallet Verification is `--color-accent` solid.

---

## 10. Motion

The reference is a static image, so motion is inferred. Guiding principles:

- **No scroll-driven cinema in the app surface.** The dashboard is workspace, not theatre. Hover states are subtle (200ms `transition-colors`).
- **Card hover:** none. Cards do not lift, change shadow, or scale on hover. They're static surfaces.
- **Pill / chip hover:** background darkens by ~8% luminance, 150ms.
- **Show my Tasks pill press:** the dark arrow-circle nudges right by 2px, 200ms.
- **Drag/drop on Kanban (later, Phase 4):** card lifts via `transform: scale(1.02)` and a single coral outline ring (`box-shadow: 0 0 0 2px var(--color-accent)`). No drop shadow.
- **AI prompt blinking cursor:** 1s `steps(2)` infinite, as noted in §8.4.
- **Loading states:** skeleton elements are `--color-surface-warm` blocks with `--radius-sub-card`. No shimmer animation — they pulse opacity from 0.6 to 1.0 over 1.4s.
- **Transitions on route change:** none. App feels instant.

---

## 11. Pixel-parity acceptance checklist (for the `/app/dashboard` route)

This is the gate for Phase 3 of `SPEC.md` §10. Side-by-side comparison with the reference image must satisfy every item:

**Foundation**
- [ ] Page background is `--color-page` (`#E8E5E0`), not the dashboard surface color
- [ ] Dashboard surface is `--color-bg` (`#F1EFEC`) in a 32px-radius container with 16px viewport margin
- [ ] No drop shadows anywhere

**Header**
- [ ] № logo is a black circle with white serif No. mark
- [ ] Show my Tasks pill uses the §3.1 vertical gradient (not solid)
- [ ] Show my Tasks arrow circle is `--color-ink`, not coral
- [ ] Calendar icon has a small coral notification dot at top-right
- [ ] "Hey, Need help?" includes the 👋 emoji at line end
- [ ] "Just ask me anything!" is `--color-text-subtle` with a blinking cursor

**Top row of cards**
- [ ] VISA card has the "Edit cards limitation" action chip with `--color-surface-peach` background
- [ ] Total income `$` is `--color-accent`; digits are `--color-text`
- [ ] Total paid same treatment + "View on chart mode" peach chip
- [ ] 13 Days card has a ~60% filled dot grid
- [ ] 2023/2022 card has coral `2023` chip and gray `2022` chip stacked

**Growth Rate dial**
- [ ] Card body is `--color-dial-bg` (dark)
- [ ] Active arc uses the §3.2 gradient (light coral at top → deep coral at bottom)
- [ ] Track arc is cream `--color-dial-track`, both arcs have round line caps
- [ ] Center reads "36%" in white over "Growth rate" muted white

**Main Stocks**
- [ ] Smooth single coral line, no axes/grid/labels
- [ ] "+ 9.3%" pill uses `--color-surface-peach` background, coral text

**Annual profits**
- [ ] Four concentric solid circles (not stroked rings) per §3.3
- [ ] Opacity ladder: 0.18 / 0.35 / 0.60 / 1.00
- [ ] Each diameter has its label in `--color-accent` text positioned at the right edge

**Activity manager**
- [ ] Three sub-cards: $43.20, Business plans, Wallet Verification
- [ ] Bar chart in $43.20 alternates coral and cream bars
- [ ] Bank loans row has a `--color-surface-warm` pill background (selected state)
- [ ] Wallet Verification has the orange sun illustration

**Review rating**
- [ ] Drag-handle indicator on top-left, × on top-right
- [ ] Five face-icon buttons in a row, all unselected, line-drawing only

**Type**
- [ ] All money amounts use tabular numerics
- [ ] All `$` in large headline metrics are coral; in small contextual metrics are dark

**Vertical action pill**
- [ ] Tall narrow pill at the left edge of the main grid with + and share icons

---

## 12. What's intentionally not in the image (we add to extend the system)

The reference is a single dashboard view. The following are extensions of the same design language, added for DealPipe's other routes — they must use the same tokens, radii, and rules so the system stays coherent:

- **Sidebar navigation** (left of `/app/*`): a vertical column, `--color-bg` background, 64px wide collapsed / 240px expanded. Nav items are pills in `--color-surface-warm` on hover, `--color-surface` on active. Icons in `--color-text-2`.
- **Topbar inside `/app/*`:** persona switcher pill (same shape as the Dwayne Tatum pill in the reference), notification icon, settings icon.
- **Kanban columns:** card surface `--color-surface`, column body `--color-bg` (the dashboard surface), column header is a chip with the stage name + count.
- **Property map (Mapbox):** the map sits inside a card with `--radius-card-lg`. Markers are coral pins matching `--color-accent`.
- **AI search results:** result cards mirror the dashboard sub-card style (`--radius-sub-card`, `--color-surface`).
- **Marketing landing page (`/`):** same color system, larger type scale, generous whitespace. No dark cinematic surfaces.

---

## 13. Implementation notes for the build

- **Tailwind v4:** declare all tokens under `@theme` in `app/globals.css`. Example:
  ```css
  @theme {
    --color-page: #E8E5E0;
    --color-bg: #F1EFEC;
    --color-surface: #FFFFFF;
    --color-accent: #E15B3F;
    /* ...etc */
    --radius-card: 24px;
    --radius-card-lg: 28px;
    /* ...etc */
  }
  ```
- **Money formatting helper:** `lib/format.ts` exports `formatMoney(value: number): { sign: string, amount: string }` returning the `$` and the comma-separated digits separately, so components can color each part. Example output: `{ sign: '$', amount: '23,194.80' }`.
- **No utility-class overrides for colors.** If a component needs a color that's not in §2, the answer is to add it to §2 — not to inline a hex.
- **Storybook (optional but recommended):** if we set up Storybook, build each component (KpiCard, ShowMyTasksPill, GrowthDial, AnnualProfitsRings, etc.) as a standalone story with the design tokens applied. Makes pixel-parity review trivial.
- **Side-by-side review:** at the end of Phase 3 (Dashboard), put the deployed `/app/dashboard` next to the reference image at the same scale. Walk §11 checklist top-to-bottom.

---

## 14. Open visual questions

Things I couldn't lock from the image alone — flag these for Chris during Phase 3:

1. **Exact VISA wordmark treatment** — use the real VISA logo SVG (brand color `#1A1F71`) or a stylized "VISA" text? Real SVG is safer for credibility but requires honoring VISA's brand guidelines (which is fine for a demo).
2. **The sun illustration on Wallet Verification** — illustrate from scratch or use a vendor SVG? Recommend custom SVG to match the rest of the design's geometry.
3. **The face icons on Review rating** — use lucide's emotion icons or custom drawings? Recommend lucide for consistency; the reference looks close to lucide's set.
4. **Exact stroke width of the dial arc and Main Stocks line** — I'm specifying 12px for the dial and 2.5px for the line. Could be ±1px off the reference. Adjust during implementation against side-by-side.
5. **Tabular numerals in Inter** — Inter Variable supports tabular nums but the default OpenType feature flag must be turned on (`font-feature-settings: "tnum"`). Verify in implementation; some Tailwind setups skip this.
