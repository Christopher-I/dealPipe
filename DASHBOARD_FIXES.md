# Dashboard Polish Plan — Phase 7.5

_Author: CTO build · Date: 2026-05-27 · Sister docs: `DESIGN.md` (visual reference), `SPEC.md` (build spec)_

---

## 0. What this doc is

Side-by-side comparison of the **reference** (image used in Phase 0) and the **current build** (Phase 3 output) surfaced four classes of issue. This doc breaks each down to the level a dev can implement against, in dependency order so we don't redo work.

The four classes:

1. **Layout density** — current build has too much air between card rows; reference is tightly packed via a vertically-split right cluster
2. **Motion** — current build is static; reference *feels* alive because the eye expects micro-motion on a financial-grade surface. Add mount + idle animations on each chart primitive
3. **Navigation** — no way back to `/` from `/app/*`; need an explicit affordance
4. **Copy drift** — several strings on the dashboard are still from the original financial-dashboard reference and don't read as CRE (`VISA`, `Receive/Send`, `Bank loans / Accounting / HR management`, `Main Stocks Extended & Limited`, `View on chart mode`, etc.)

Plus one **visual bug** I noticed in the screenshot: Annual Profits ring labels are colliding into a single horizontal smudge (`$6.8M$9.3M$14M`) instead of sitting on the right edge of each individual ring.

---

## 1. Layout density — the structural fix

### 1.1 What's wrong

**Reference composition** (re-read carefully):

The reference has **two main rows**. Row 1 is a tightly nested cluster where the right half is *vertically split into two sub-rows*:

```
ROW 1 (single visual band, ~half dashboard height)
┌────┬──────────┬──────────┬─────────────────────────────┐
│Rail│ VISA     │ Income   │ Lock │ 13 Days │ Year       │  ← upper sub-row
│    │ (tall,   ├──────────┼──────┴─────────┬────────────┤
│    │  spans   │ Paid     │   Growth Dial  │ Main Stocks│  ← lower sub-row
│    │  both)   │          │                │            │
├────┴──────────┴──────────┴────────────────┴────────────┤
ROW 2 (single visual band, ~half dashboard height)
│    │ Annual Profits │ Activity Manager       │ Review  │
│    │ (rings)        │ ($43.20 / Plans / Wallet) │ Rating│
└────┴────────────────┴────────────────────────┴─────────┘
```

Key insight: the reference's **VISA card is row-spanning**, and the columns to its right are nested grids that fill the same vertical space — that's how the reference avoids the wasted gap I currently have under the Income card and under the Lock/13D/Year row.

**Current build composition** (what I shipped in Phase 3):

```
Row 1: VISA(3) | Income(3) | Lock(1) | 13D(2) | Year(3)
Row 2: AnnualProfits(3, row-span 2) | Paid(3) | Dial(2) | MainStocks(4)
Row 3: ActivityManager(6) | ReviewRating(3)
```

Three side effects of this:
- **Row 1 height = max of (VISA, Income, Lock, 13D, Year).** VISA is tallest. Income/Lock/13D/Year all have whitespace under them within row 1.
- **Paid drops into row 2**, leaving a visible horizontal gap between the VISA bottom edge and the Paid top edge.
- **Annual Profits row-spans 2** (rows 2-3) which forces the bottom row taller than the reference's tight square footprint.

The result reads as **three rows with air between them**. The reference reads as two tightly-packed rows.

### 1.2 The fix — restructure into 2 outer rows with nested sub-grids on the right

**Outer grid** stays simple: 12 cols × 2 rows.

| Card / cluster | Outer row | Outer cols |
|---|---|---|
| Vertical action rail | spans both rows | col 1 |
| VISA | row 1 | cols 2–4 (3 cols) |
| Income/Paid stack | row 1 | cols 5–7 (3 cols, inner flex-col with 2 children) |
| Right cluster | row 1 | cols 8–12 (5 cols, inner grid 5-col × 2-row) |
| Annual Profits | row 2 | cols 2–5 (4 cols) |
| Activity Manager | row 2 | cols 6–10 (5 cols) |
| Review Rating | row 2 | cols 11–12 (2 cols) |

**Income/Paid stack** = a flex column containing two `MetricCard`s, no wrapper card — the two metric cards visually float in the column position together. Total vertical extent equals VISA's height.

**Right cluster (cols 8-12, row 1)** = a 5-col × 2-row inner grid:

| Inner row | Inner cols | Card |
|---|---|---|
| 1 (top) | 1 (1/5) | System Lock |
| 1 (top) | 2-3 (2/5) | 13 Days |
| 1 (top) | 4-5 (2/5) | Year chart (2023/2022) |
| 2 (bottom) | 1-2 (2/5) | Growth Rate dial |
| 2 (bottom) | 3-5 (3/5) | Main Stocks |

The whole right cluster matches VISA's height.

### 1.3 Gap & padding tightening

| Token | Current | Target | Why |
|---|---|---|---|
| Outer dashboard padding (inside shell) | `p-6` = 24px | `p-5` = 20px | Reference shows ~20px |
| Grid gap (between outer cards) | `gap-5` = 20px | `gap-4` = 16px | Reference is tighter |
| Sub-grid gap (inside right cluster) | n/a | `gap-3` = 12px | Tightly clustered |
| Card padding (standard) | `p-6` = 24px | `p-5` = 20px | Reference cards are slightly denser |
| Card padding (large) | `p-7` = 28px | `p-6` = 24px | Same |
| Space between header rows | `space-y-6` | `space-y-4` | Reference has less header air |

These are minor numerical changes but they compound. **Don't change radii** — those are correct.

### 1.4 Header tightening too

Currently the dashboard page renders:
```
shell.Topbar              ← row of: ☰ logo | + persona search
↓ mt-6
DateTaskRow + AiPromptHero  ← row of: 19/Tue/Tasks/Cal | Hey,Need help? mic
↓ space-y-6
main grid
```

In the reference, the gap between the topbar and the second header row is **small** (~16-20px). Then the gap between the second header row and the start of the card grid is also small (~16-20px). My current `mt-6` (24px) on the dashboard wrapper + `space-y-6` between header and grid creates ~48px of air. Tighten to `mt-4` + `space-y-4`.

### 1.5 Specific files to touch

- `app/app/dashboard/page.tsx` — replace the current 12-col grid with the nested-row structure above
- `components/dashboard/AccountCard.tsx` — slightly tighter padding
- `components/dashboard/MetricCard.tsx` — same
- `app/app/layout.tsx` — drop outer padding by 4px
- `app/globals.css` — no token changes (radii stay; spacing tokens are inline)

---

## 2. Motion — make the dashboard feel alive

### 2.1 Two layers of motion

**Mount animations** — fire once when `/app/dashboard` loads. Communicate "this dashboard is reading live data."

**Idle animations** — quiet, looped or periodic. Communicate "this surface is alive."

The reference is a static screenshot so we're inferring intent, but the visual language clearly wants motion (the dial gradient, the blinking AI cursor, the wavy line chart). Per DESIGN.md §10 we said "no scroll cinema in the app surface" — that still holds. These are **micro-animations**, not Anduril-style cinema.

### 2.2 Per-primitive motion spec

| Primitive | Mount animation | Idle animation |
|---|---|---|
| **Growth Rate dial** | Coral arc sweeps from 0% → 36% over 900ms with `ease-out-cubic`. Center text fades in at 600ms with subtle scale 0.95→1. | Faint 4s pulse on the gradient brightness (±5%). |
| **Annual Profits rings** | Each ring scales from 0 → its diameter, staggered outer→inner (150ms stagger). 700ms total. Labels fade in at end. | None — rings stay static. |
| **Main Stocks line** | SVG path stroke-dasharray reveal — line "draws" left-to-right over 1200ms `ease-out`. | None — the wavy line is the personality already. *(Optional later: ticker effect where path shifts left by 1px per second to suggest live data.)* |
| **Activity bars** ($43.20 sub-card) | Bars grow up from baseline, staggered left-to-right (50ms stagger). 600ms total. | None. |
| **13 Days dot grid** | Dots fill in sequence, ~15ms stagger across the filled range. ~360ms total. | None. |
| **Year chart markers** | Marker lines extend up from baseline (stroke-dashoffset), 600ms, with the dot popping in at the end (`scale 0→1`). | None. |
| **KPI metrics** (Total income, Total paid, $16,073.49) | Number count-up from 0 → final value over 800ms, `ease-out`. Tabular numerics so width is stable. | None. |
| **Show my Tasks pill** | Already has the arrow nudge on hover. Keep. | None. |
| **Microphone button** | None on mount. | Subtle 3s pulse (ring scale 1 → 1.04 → 1) when no input is active. Implies "listening capability available." Stops on hover. |
| **AI prompt cursor** | Already blinks. Keep. | Continuous (already implemented). |
| **Vertical action rail** | Fade in at 200ms. | None. |
| **Cards (all)** | Stagger fade-up: opacity 0→1, translateY 6px→0, 50ms stagger across the grid by row order. 400ms each. | None. |

### 2.3 Animation primitives — what to install / what to write

**No new dependency required.** Native CSS + `@keyframes` covers everything except:

- The number count-up — write a small `useCountUp(target, duration)` hook (~20 lines, no dep)
- The SVG path draw — `stroke-dasharray` + `stroke-dashoffset` on the path with a CSS transition
- The dial arc sweep — same technique, animating `stroke-dasharray`'s "length" portion
- Staggered ring scaling — CSS `@keyframes` with `animation-delay` per ring

**Reduced motion respect:** wrap every keyframe block in `@media (prefers-reduced-motion: reduce)` to disable. Required for accessibility.

### 2.4 Specific files to touch

- `app/globals.css` — add ~10 keyframe definitions (`dp-arc-sweep`, `dp-ring-grow`, `dp-bar-grow`, `dp-dot-fill`, `dp-line-draw`, `dp-mic-pulse`, `dp-card-rise`)
- `components/dashboard/GrowthRateDial.tsx` — add arc sweep + center fade
- `components/dashboard/AnnualProfitsCard.tsx` — ring stagger
- `components/dashboard/MainStocksCard.tsx` — line draw on mount
- `components/dashboard/ActivityBarMini.tsx` — bar grow stagger
- `components/dashboard/DaysCountdownCard.tsx` — dot fill stagger
- `components/dashboard/YearChartCard.tsx` — marker extend + dot pop
- `components/dashboard/MetricCard.tsx` — accept an animated value via `useCountUp`
- `components/dashboard/AccountCard.tsx` — count-up on `$25.00`
- `components/dashboard/AiPromptHero.tsx` — mic pulse
- `lib/hooks/useCountUp.ts` — new file with the hook

---

## 3. Back-to-home navigation

### 3.1 What's missing

From any `/app/*` route there's currently no visible way back to the public landing (`/`). The hamburger button in the topbar is a placeholder that doesn't open anything. The № logo doesn't link anywhere.

### 3.2 The fix — two affordances

**Primary:** make the № logo a `Link` to `/`. This is the universal pattern users expect — the brand mark always navigates home.

**Secondary:** add a small "Back" arrow button before the hamburger that explicitly says "Back to home" on hover (`title` attribute). Icon-only at 36–40px to stay light visually.

Why both: the logo-link is for users who already know the convention; the explicit button is for users who don't and need an obvious affordance. Together they're <60px of pixel real estate.

### 3.3 Specific files to touch

- `components/shared/Logo.tsx` — wrap the disc + wordmark in a `Link href="/"`. Add `title="Back to home"`.
- `components/shared/Topbar.tsx` — add a "Back to home" `Link` (icon button, `ArrowLeft` from lucide) at the very start of the left cluster, before the hamburger.

---

## 4. Copy updates — CRE-ize the dashboard

### 4.1 The audit

These strings are still finance-dashboard residue and don't read as CRE:

| Component | Current text | Replacement | Rationale |
|---|---|---|---|
| `AccountCard` brand mark | "VISA" wordmark in Visa-blue italic | **"Treasury"** (label) + a small bank/vault icon in `--color-ink` | A CRE platform doesn't show a consumer Visa card. Treasury = pooled cash for the active org. |
| `AccountCard` | "Direct Debits ▾" chip | **"Wire transfers ▾"** | What you'd actually filter on for an investment vehicle's treasury. |
| `AccountCard` | "Linked to main account" | **"Linked to fund operating account"** | More CRE-specific. |
| `AccountCard` | "Receive" / "Send" buttons | **"Deposit"** / **"Transfer"** | CRE treasury language. |
| `AccountCard` | "Monthly regular fee $25.00" | **"Platform fee $25.00 / mo"** | Same meaning, less generic. |
| `AccountCard` | "Edit cards limitation" chip | **"Manage limits"** chip | Drops the "cards" framing entirely. |
| `MetricCard` (top one) | "Total income" | **"Pipeline inflow"** | What's actually flowing in for a CRE firm — closed-won deals contributing to AUM. |
| `MetricCard` (bottom one) | "Total paid" | **"Cap calls"** | LP capital calls drawn this week. |
| `MetricCard` action chip | "View on chart mode" | **"View trend"** | Drops the "chart mode" jargon. |
| `MainStocksCard` | "Main Stocks / Extended & Limited" | **"Portfolio NAV / Open + closed deals"** | NAV is the CRE-correct term for "what we're holding," and the subtitle clarifies what's aggregated. |
| `MainStocksCard` | "$16,073.49" | Keep the live derived value (already wired from seed) | Just a number — fine as-is. |
| `YearChartCard` | "2023" / "2022" chips | **"2026"** / **"2025"** chips | The seed is set in 2026 (current `Date()` ); the years should reflect that. |
| `DaysCountdownCard` | "13 Days / 109 hours, 23 minutes" | **"N Days / To next close"** (already done in Phase 3) | Verified correct. |
| `WorkspacesList` | "Bank loans / Accounting / HR management" + "Business plans" title | **"Underwriting / Asset reports / Team management"** + "Workspaces" title | Already done in Phase 3 — verify. |
| `WalletVerifyCard` | "Wallet Verification / Enable 2-step verification to secure your wallet." | **"Account security / Enable 2-step verification to protect your sign-in."** | Drops the "wallet" framing — DealPipe has no wallet. |
| `ReviewRatingCard` question | "How is your business management going?" | **"How is your portfolio performing?"** | Already done — verify. |
| `ShowMyTasksPill` | "Show my Tasks" | **"Show my deals"** | More direct for a CRE pipeline tool. |

### 4.2 Things to keep unchanged

- "System Lock" — generic enough, reads as a security badge.
- "Hey, Need help? 👋 / Just ask me anything!" — already correct, AI prompt is generic.
- "Activity manager" — generic, reads well.
- "Team / Insights / Today" filter chips — fine.
- "Annual profits / $14M / $9.3M / $6.8M / $4M" — fine as labels (these are dollar amounts, not specific company financials).
- "36% / Growth rate" — fine.

### 4.3 Specific files to touch

- `components/dashboard/AccountCard.tsx` — most of the copy + Treasury label + new icon
- `components/dashboard/MetricCard.tsx` — used by Income/Paid via the page, so the page passes new labels (or hardcode the action chip text into the call site)
- `components/dashboard/MainStocksCard.tsx` — title/subtitle props are already accepted; just pass new values from the page
- `components/dashboard/YearChartCard.tsx` — chip years
- `components/dashboard/WalletVerifyCard.tsx` — title + description
- `components/dashboard/ShowMyTasksPill.tsx` — default label
- `app/app/dashboard/page.tsx` — pass new copy to MetricCard / MainStocksCard

---

## 5. Annual Profits ring labels bug

Visible in my screenshot: all four labels (`$4M`, `$6.8M`, `$9.3M`, `$14M`) collapse onto one horizontal line, overlapping each other into `$6.8M$9.3M$14M`.

### 5.1 Why it's happening

In `AnnualProfitsCard.tsx` I positioned each label as `position: absolute; left: 50% + offset; top: 50%; -translate-x-1/2 -translate-y-1/2`. The `top: 50%` puts every label at the vertical center — exactly where they collide.

### 5.2 The fix

The reference puts each label on the **upper-right edge** of its ring, not the right midpoint. Each label is at a slight angle from center, around 1 o'clock to 2 o'clock on the clock face.

Switch to polar positioning per ring:

```ts
const ANGLE_DEG = 35; // 35° from north — upper-right
// For each ring with radius r (as % of container):
const x = 50 + r * Math.sin(ANGLE_DEG * Math.PI / 180);
const y = 50 - r * Math.cos(ANGLE_DEG * Math.PI / 180);
// Position label with -translate-x-1/2 -translate-y-1/2
```

This distributes labels naturally along the upper-right of each ring (with the innermost label still at center, where it currently sits).

### 5.3 Specific files to touch

- `components/dashboard/AnnualProfitsCard.tsx` — replace `labelOffsetPct` with polar coordinates

---

## 6. Implementation strategy (sequence)

I want the smallest possible diffs per commit so review is easy. Proposed order:

| Step | Scope | Why this order |
|---|---|---|
| **1** | Layout restructure (§1) | Biggest visual win, blocks everything else from reading correctly. Restructure first, then polish on top. |
| **2** | Annual Profits ring label fix (§5) | Small isolated fix that also makes the layout look right when comparing side-by-side. Tag onto step 1. |
| **3** | Back-to-home + Logo as link (§3) | Tiny diff; bundle with step 1. |
| **4** | Copy updates (§4) | Independent from layout/motion. Easy to verify visually. Bundle with step 1 if small enough, otherwise its own commit. |
| **5** | Motion — primitives (§2.2) | Once layout is locked, animate. Each primitive's animation is independent — can ship them in one big commit after testing. |
| **6** | Motion — KPI count-up + mic pulse + card stagger | Final polish layer. Could ship with step 5. |

Realistically this is **2 commits** end-to-end:
- Commit A: layout + ring-fix + back button + copy (all visual structural fixes)
- Commit B: motion layer

### 6.1 Time estimate

- Step 1 (layout): ~45 min
- Step 2 (ring fix): ~10 min
- Step 3 (back button): ~10 min
- Step 4 (copy): ~15 min
- Step 5+6 (motion): ~90 min

Total ~2.5 hours of focused work. Roughly half a dev day.

---

## 7. Risks & trade-offs

| Risk | Mitigation |
|---|---|
| Nested grid breaks at narrow viewports (the right cluster has 5 cols × 2 rows; below ~1024px it'd be cramped) | Below `lg` breakpoint, collapse the right cluster to a stacked column. The 2-row internal grid → 5-row single column. Cards stay readable. |
| Number count-up looks gimmicky on values that should feel "always there" (e.g. account balance) | Only animate KPIs that are derived/aggregated (Income, Paid, NAV). Leave the `$25.00` fee static — it's not "live." |
| Stroke-dasharray animation on Main Stocks line uses a hand-tuned path; the animation looks chunky if the path has sharp corners | Keep the existing smoothed path from Phase 3. |
| Animations distract on every navigation back to `/app/dashboard` | Each animation fires only on mount. React strict mode in dev fires mount effects twice — accept that in dev, prod is fine. |
| Reduced-motion users see jank or skipping | Wrap every animation in `@media (prefers-reduced-motion: reduce) { … animation: none; }`. Hard requirement. |
| "VISA" wordmark replacement loses some recognizability — buyers may have liked the literal pixel match | Counter: the literal Visa card framing was a brand mismatch for a CRE platform. The replacement (Treasury) is more credible to a buyer evaluating DealPipe as PropTech. Layout/visual weight is preserved. |
| Copy changes break the activity-manager / business-plans / wallet-verification translations that have specific iconography | Each replacement uses the same iconography (lock, sun illustration, list). Only text changes. |

---

## 8. Acceptance criteria

After both commits land:

**Visual structure**
- [ ] Income card sits directly above Paid card in the same column (no gap)
- [ ] Right cluster (Lock + 13D + Year + Dial + MainStocks) fills the same vertical extent as VISA card on the left
- [ ] Bottom row (Annual Profits + Activity Manager + Review Rating) sits flush against the top row
- [ ] Annual Profits labels are vertically distinct on the upper-right of each ring (no horizontal pile-up)

**Navigation**
- [ ] Clicking the № logo navigates to `/`
- [ ] A visible "Back to home" arrow button exists in the topbar

**Copy**
- [ ] Zero instances of "VISA" / "Receive" / "Send" / "Bank loans" / "Accounting" / "HR management" / "Main Stocks" / "Extended & Limited" / "View on chart mode" / "Wallet Verification" on the dashboard
- [ ] Year chart chips read "2026" and "2025"
- [ ] Show my Tasks pill reads "Show my deals"

**Motion**
- [ ] On first load of `/app/dashboard`, dial arc sweeps from 0% → 36%
- [ ] Main Stocks line draws left-to-right
- [ ] Annual Profits rings expand outer→inner with stagger
- [ ] Activity bars grow from baseline with stagger
- [ ] 13 Days dots fill in sequence
- [ ] KPI numbers count up from 0 to final values
- [ ] Microphone button pulses subtly when idle
- [ ] `@media (prefers-reduced-motion: reduce)` disables all of the above

---

## 9. What's intentionally not in this plan

- **Sidebar nav** — still deferred. The reference has none; we add nav via hamburger drawer if/when needed.
- **Persona-aware welcome line on the dashboard** — out of scope; can revisit.
- **Real-time data ticker on Main Stocks** — flagged as "optional later" in §2.2; not in V1 of this polish pass.
- **Dark-mode variant of the dashboard** — never in scope.
- **Mobile pixel-parity** — SPEC.md §13 says "graceful, not pixel-perfect on mobile." Same applies after this pass.

---

## 10. Next action

Chris reviews §1–§9 and either:
1. Says **go** → I ship Commit A (layout + ring + back + copy), then Commit B (motion).
2. Pushes back on specific items → I adjust before touching code.

No code lands until §6 sequence is approved.
