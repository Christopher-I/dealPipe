# DealPipe — Build Spec

_Author: Chris (strategy) + CTO build · Date: 2026-05-27 · Sister docs: `dealpipe-cre-build-plan.md` (strategy), `demo-build-plan.md` (portfolio context)_

---

## 0. What this doc is

This is the **build-ready** spec — the bridge from strategy (`dealpipe-cre-build-plan.md`) to code. It locks the stack, the data model, the route map, the design system tokens, and the build phases. Everything in here is a decision; open questions are flagged in §11.

**One demo only — DealPipe.** Other 4 portfolio demos are out of scope until DealPipe is shipped.

**Design north star:** the coral/off-white dashboard reference image. The previous Anduril/Skydio/Linear dark-cinematic direction is **discarded** — we are going light/soft/coral for the entire surface (marketing + app).

**Mock-data-first.** We are **not** wiring Supabase in the initial build. The whole app runs on a typed mock data layer (`lib/data/*`) with deterministic seed data in `lib/data/seed/`. Components consume async functions (`listDeals(orgId)`, `getDeal(id)`, etc.) so the layer is swappable for Supabase later without touching any UI code. Supabase, RLS, real auth, and Stripe webhooks become a future migration phase if/when the demo proves it needs them.

---

## 1. Stack — locked

| Layer | Choice | Why |
|---|---|---|
| **Framework** | Next.js 15 (App Router, RSC, Server Actions) | React, but a *framework* — matches the verbatim premium job title *"Next.js + Supabase + Stripe."* SSR for the marketing page, RSC for the app shell. |
| **Language** | TypeScript (strict) | Non-negotiable for a demo to read as production-grade. |
| **Data layer (V0)** | TypeScript mock layer in `lib/data/*` with deterministic JSON seed | Lets us ship the demo surface fast without provisioning anything. Async function signatures match what a Supabase port would look like. |
| **Database + Auth + Storage (deferred)** | Supabase (Postgres + Auth + RLS + Storage) — **not wired yet** | Architecture decision is locked so we can port cleanly later. Schema in §6 is the eventual target, not a Phase 1 deliverable. |
| **Styling** | Tailwind CSS v4 | CSS-first config, no postcss boilerplate. Matches existing Seed App work. |
| **UI primitives** | shadcn/ui (Radix-based) | Owned components, easy to restyle to match the image. No vendor lock. |
| **Forms** | react-hook-form + zod | Standard. Zod schemas double as API validation. |
| **Charts** | Recharts | The image has line, bar, and concentric-circle charts — Recharts covers line + bar cleanly; concentric is a custom SVG component. |
| **Drag/drop** | dnd-kit | For the Kanban pipeline. Accessible, modern, light. |
| **Maps** | Mapbox GL JS | Already used in Traumagraph — leverages a stack we know. |
| **AI** | Anthropic Claude (claude-sonnet-4-6) via `@anthropic-ai/sdk` | Tool-use quality for NL→filter. Anthropic-native; matches "AI-powered commercial real estate search agent." |
| **Payments** | Stripe (test mode + Checkout) | Verbatim from brief. Webhook handler scaffolded; mock data acceptable. |
| **Icons** | lucide-react | Clean, geometric, matches the visual tone of the reference image. |
| **Fonts** | Inter (variable) | Matches the geometric sans in the reference. Hosted via `next/font`. |
| **Date / number** | `date-fns`, `Intl.NumberFormat` | No moment.js, no overkill libs. |
| **State (client)** | URL params + React state. TanStack Query only where we actually need cache. | RSC + Server Actions cover most reads; client cache is the exception, not the rule. |
| **Hosting** | Vercel | Matches existing deploys. Free tier sufficient for the demo. |
| **Analytics** | Vercel Analytics | Lightweight. |
| **CI / hooks** | Husky + lint-staged + Biome (or ESLint+Prettier — TBD §11) | Decide at scaffold time. |

**Rejected** (so we don't bike-shed later):
- Vite SPA — no SSR for marketing page, weaker SEO/AEO signal for the case study.
- Prisma — Supabase RLS is the multi-tenant story; pulling Prisma in front adds layers without solving anything.
- Tremor — its defaults won't match the image. Recharts gives us more design control.
- Framer Motion — only pull in if a specific interaction needs it; CSS transitions handle 90% of the dashboard.

---

## 2. Repo layout

```
~/work/dealPipe/
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx          # public chrome (no auth)
│   │   └── page.tsx            # / — landing
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── app/                    # authenticated shell
│   │   ├── layout.tsx          # sidebar/topbar, requires session
│   │   ├── page.tsx            # redirect → /app/dashboard
│   │   ├── dashboard/page.tsx
│   │   ├── deals/
│   │   │   ├── page.tsx        # Kanban + table toggle
│   │   │   └── [id]/page.tsx
│   │   ├── properties/
│   │   │   ├── page.tsx        # map + list
│   │   │   └── [id]/page.tsx
│   │   ├── search/page.tsx     # full-page AI search
│   │   └── settings/
│   │       ├── page.tsx        # org settings
│   │       ├── users/page.tsx
│   │       └── billing/page.tsx
│   ├── api/
│   │   ├── ai-search/route.ts
│   │   └── webhooks/stripe/route.ts
│   ├── globals.css             # Tailwind v4 @theme tokens live here
│   └── layout.tsx              # root, fonts
├── components/
│   ├── ui/                     # shadcn primitives — Button, Card, Input, etc.
│   ├── dashboard/              # KpiCard, ActivityManager, AnnualProfitsRings, MainStocksChart, GrowthRing, AskAnything
│   ├── deals/                  # PipelineKanban, DealRow, DealDetailSheet, StageColumn
│   ├── properties/             # PropertyMap, PropertyList, PropertyCard
│   ├── search/                 # AiSearchBar, AiResultCard
│   └── shared/                 # Sidebar, Topbar, OrgSwitcher, PersonaSwitcher
├── lib/
│   ├── data/                   # the V0 mock data layer
│   │   ├── index.ts            # listDeals, getDeal, listProperties, etc. — async API
│   │   ├── session.ts          # readActivePersona, switchPersona (localStorage)
│   │   ├── ai-search.ts        # in-memory filter executor for AI tool calls
│   │   └── seed/
│   │       ├── orgs.ts
│   │       ├── users.ts
│   │       ├── properties.ts
│   │       ├── deals.ts
│   │       ├── activities.ts
│   │       └── documents.ts
│   ├── claude.ts               # Anthropic SDK wrapper + tool defs
│   ├── format.ts               # currency, percent, dates
│   └── utils.ts                # cn() etc.
├── types/
│   └── domain.ts               # Organization, User, Deal, Property, etc.
├── public/
│   └── logos/                  # 3 tenant brand marks (Hudson Bay, Phoenix, Atlantic)
├── .env.local.example
├── biome.json (or .eslintrc)
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## 3. Design system — see `DESIGN.md`

**This section is intentionally short.** The full design system — every color, gradient, radius, type token, component anatomy, and pixel-parity acceptance checklist — lives in [`DESIGN.md`](./DESIGN.md). That doc is the source of truth; this section is the summary.

Tokens live in `app/globals.css` under Tailwind v4 `@theme`. Anything not listed in `DESIGN.md` §2–§5 doesn't exist — no rogue hex codes in components.

### Summary of the system (full detail in `DESIGN.md`)

- **Two-layer warm-neutral base:** page (`#E8E5E0`) → dashboard surface (`#F1EFEC`) → cards (`#FFFFFF`), with two additional tints (`--color-surface-warm`, `--color-surface-peach`) for icon wells and action chips.
- **Single accent (coral):** `--color-accent` (`#E15B3F`) with a deep variant, a bright variant for gradient ends, and a 4-step opacity ladder for the Annual Profits rings.
- **Five gradients to implement** (catalogued in `DESIGN.md` §3): Show my Tasks pill, Growth Rate dial arc, Annual Profits opacity stack, page→dashboard luminance step, bar-chart bar top-light.
- **Radii:** 32 (shell) / 28 (large card) / 24 (card) / 20 (sub-card) / 16 (input) / 9999 (pill).
- **Type:** Inter Variable, scale `--text-display` (40px) → `--text-meta` (12px); coral `$` glyph on headline metrics, tabular numerics enforced.
- **No shadows anywhere.** Depth is luminance and spacing only.
- **Motion is restrained:** 200ms color transitions on interactive elements; no scroll-driven cinema in the app surface.

---

## 4. Route map

| Route | Auth | What it is |
|---|---|---|
| `/` | public | Marketing landing — hero, feature grid, demo CTA |
| `/login` | public | Email/password + persona quick-select (§5) |
| `/signup` | public | Org creation + first user |
| `/app/dashboard` | required | KPI surface — **pixel-parity target to the reference image** |
| `/app/deals` | required | Pipeline: Kanban + table toggle, filters, search |
| `/app/deals/[id]` | required | Deal detail — financials, docs, notes, activity log |
| `/app/properties` | required | Map (Mapbox) + filterable list |
| `/app/properties/[id]` | required | Property detail |
| `/app/search` | required | Full-page conversational AI search |
| `/app/settings` | required | Org name, branding, members, integrations placeholder |
| `/app/settings/users` | required | Member list, invite, role change |
| `/app/settings/billing` | required | Stripe Checkout link + mock invoice list |
| `/api/ai-search` | server | Claude tool-use → Postgres query |
| `/api/webhooks/stripe` | server | Stripe events (mock acceptable for V1) |

---

## 5. Auth + multi-tenancy (V0: mock; later: Supabase)

**V0 (mock):** No real auth. `/login` is three persona buttons — *"Try as Hudson Bay broker"*, *"Try as Phoenix principal"*, *"Try as Atlantic admin"*. Click sets `localStorage.activePersonaId` and routes to `/app/dashboard`. The mock data layer reads the active persona to scope all queries to that persona's org.

**Org switcher** in the topbar lets a persona move between any orgs they belong to (in the mock seed, most personas belong to one org; one "super broker" persona belongs to two — to prove the multi-tenant UX).

**Roles** still apply at the UI level — `admin`/`principal`/`broker` — to drive what controls are visible. Mock data layer enforces role gates so the demo behaves like the real thing.

**Later (Supabase phase, deferred):**
- `organizations` is the multi-tenant root.
- `org_users(org_id, user_id, role)` join table.
- Every domain table has `org_id`. RLS policies enforce `org_id` matches a row in `org_users` for the current `auth.uid()`.
- Cookie-based session via `@supabase/ssr`. Email/password + magic link.

The async function signatures in `lib/data/index.ts` are designed so the mock implementation and the future Supabase implementation are drop-in interchangeable.

---

## 6. Data model

This is the **eventual Postgres schema** (the target if/when we wire Supabase). In V0 it's the same shape, expressed as TypeScript types in `types/domain.ts` and consumed by the mock layer in `lib/data/`.

All `id` columns are `uuid default gen_random_uuid()`. All tables have `created_at timestamptz default now()` and (where mutable) `updated_at`. All have `org_id uuid references organizations(id) on delete cascade` except `organizations` itself.

### `organizations`
```
id, name, slug (unique), brand_color (hex), logo_path (storage ref), created_at
```

### `org_users`
```
id, org_id, user_id (references auth.users), role (enum: admin|principal|broker), created_at
unique (org_id, user_id)
```

### `properties`
```
id, org_id, name, address, city, state, zip, lat, lng,
asset_class (enum: office|retail|industrial|multifamily|hospitality|mixed_use),
price_usd (numeric), cap_rate (numeric), sqft (int),
year_built (int), photo_url (text), description (text), created_at
```

### `deals`
```
id, org_id, property_id, name, stage (enum: sourcing|loi|diligence|closing|closed_won|closed_lost),
amount_usd (numeric), probability (int 0-100), owner_id (org_users.id),
expected_close (date), notes (text), created_at, updated_at
```

### `activities`
```
id, org_id, deal_id (nullable), property_id (nullable), user_id (auth.users),
type (enum: note|stage_change|document_upload|deal_created|deal_won|deal_lost),
body (text), metadata (jsonb), created_at
```

### `documents`
```
id, org_id, deal_id, storage_path, filename, mime_type, size_bytes, uploaded_by, created_at
```
**Note:** Document *records* exist in V1; upload UI is V2 per the build plan. Seed data populates placeholder rows.

### Enums
Created as Postgres enums, not text — gives us check-constraint behavior for free.

---

## 7. RLS policies (deferred — for the Supabase phase)

**Not built in V0.** This section is here so we know the target architecture and don't paint ourselves into a corner with the mock layer's shape.



One predicate, applied everywhere:

```sql
-- helper
create function is_org_member(target_org uuid)
returns boolean language sql security definer stable as $$
  select exists(
    select 1 from org_users
    where org_id = target_org and user_id = auth.uid()
  );
$$;

-- example policy applied to every domain table
create policy "org members can read"  on deals
  for select using (is_org_member(org_id));
create policy "org members can write" on deals
  for insert with check (is_org_member(org_id));
create policy "org members can update" on deals
  for update using (is_org_member(org_id));
create policy "org members can delete" on deals
  for delete using (is_org_member(org_id));
```

Role-gated writes (e.g. only `admin` can change billing) layer on top via additional policy clauses or via a server-side guard in the action (cleaner — keep RLS as the org isolation layer; do role checks in server actions where intent is readable).

**Test plan for RLS** (must pass before Phase 1 closes):
- Two seeded orgs (A and B). User in A queries every table — sees only A's rows. Tries to insert with `org_id = B` — denied. Tries to update a B-owned row directly — denied. Tries to read via raw SQL with a forged JWT — denied.

---

## 8. AI search (the differentiator)

`/api/ai-search` receives `{ query: string }`. Server reads the active persona/org from a signed cookie or `next/headers`-readable client cookie (V0 — cookie set when persona switches), then:

1. Calls Claude with a tool definition (`query_properties` and `query_deals`) and the user query.
2. Claude returns a structured filter object via tool use.
3. Server runs the filter against the **in-memory mock dataset** (V0) — same filter object will be translated to a parameterized Postgres query later (Supabase phase).
4. Server returns `{ results, summary }` where `summary` is a brief natural-language answer Claude generated from the result count + first few rows.

**Tool definition sketch (properties):**
```ts
{
  name: "query_properties",
  description: "Search the org's CRE properties by structured filters.",
  input_schema: {
    type: "object",
    properties: {
      asset_class: { type: "string", enum: ["office","retail","industrial","multifamily","hospitality","mixed_use"] },
      state: { type: "string", description: "2-letter US state code" },
      min_cap_rate: { type: "number" }, max_cap_rate: { type: "number" },
      min_price_usd: { type: "number" }, max_price_usd: { type: "number" },
      keyword: { type: "string", description: "Substring match on name/description/city" },
      limit: { type: "integer", default: 20, maximum: 100 }
    }
  }
}
```

**Documented test queries** (must all return sensible results before AI search closes):
1. "Office buildings in Texas with cap rate above 7% under $20M"
2. "Show me multifamily deals in the diligence stage"
3. "Industrial properties between $5M and $15M"
4. "Recently closed deals worth more than $10M"
5. "Hospitality properties in California with cap rate above 6%"

---

## 9. Seed data strategy

Seed is part of the demo — empty tables kill it. In V0 the seed is **static TypeScript modules** under `lib/data/seed/` — deterministic, version-controlled, no script to run. Future Supabase port will reuse the same seed objects via a one-time import script.

- **3 orgs** with distinct brand colors and logos:
  - Hudson Bay Partners (deep green)
  - Phoenix CRE (terracotta — close to our accent; pick a sibling tone)
  - Atlantic Realty Group (navy)
- **~5-8 users per org** across all 3 roles.
- **~50 properties per org**, spread across 5+ metros (NYC, LA, Chicago, Dallas, Atlanta, Miami). Realistic addresses, believable lat/lng for the chosen city, Unsplash CRE photos.
- **~20 deals per org**, distributed across all 6 stages (skewed toward early stages, like a real pipeline).
- **~3 documents per deal** (placeholder refs — no actual files).
- **Activity log** with stage changes, notes, won/lost events, timestamps spanning the last 6 months.

Generator approach: hand-craft 3 org records, then a Node script (`scripts/generate-seed.ts` — run once, output checked in) produces the bulk records using `faker` + a one-shot Claude call for property description variants per asset class. The output is static TS, not regenerated at runtime.

---

## 10. Build phases

No time estimates committed here — strategy doc has 3-4 weeks total; we'll refine after Phase 0.

| Phase | Output | Exit criteria |
|---|---|---|
| **0 — Spec lock** *(this doc)* | This `SPEC.md` reviewed and approved | Chris says "go" |
| **1 — Foundation** | Next.js scaffold, Tailwind v4 + design tokens in `globals.css`, app shell layout (sidebar + topbar), persona login page, mock data layer skeleton with type-only stubs, three placeholder routes that render the layout chrome | Persona switch routes to `/app/dashboard`, sidebar/topbar render with correct tokens, type-check passes |
| **2 — Mock seed** | Hand-built 3-org seed + Node generator script that fills out users, properties, deals, activities, documents. Output is checked-in TS modules under `lib/data/seed/`. Data layer functions return real data for every read. | Every route can render with seeded data; no empty states are reached via normal navigation |
| **3 — Dashboard** | `/app/dashboard` pixel-matched to the reference image: KPI cards, AI search header, Annual Profits rings, Activity Manager, Main Stocks line chart, Growth Rate dial, status cards | Side-by-side comparison vs the image looks like the same product |
| **4 — Deals** | `/app/deals` Kanban + table toggle, drag between stages (mock-persisted to localStorage or in-memory), `/app/deals/[id]` detail with notes + activity log | Pipeline drag works visually; deal detail renders all sections |
| **5 — Properties + map** | `/app/properties` map+list with Mapbox, filters, `/app/properties/[id]` detail | 150+ properties render on the map without lag; filters work |
| **6 — AI search** | `/api/ai-search` + UI; 5 documented test queries return sensible results from the mock dataset | All 5 queries from §8 pass acceptance |
| **7 — Settings, marketing, deploy** | Org settings (read-only OK in V0), member list, mock billing page, marketing `/` landing, Vercel deploy, analytics | Demo URL live, persona buttons work end-to-end on prod |
| **8 — Supabase port (deferred / optional)** | Wire Supabase: schema migrations, RLS, auth, swap mock layer for real client | RLS test plan in §7 passes; persona login becomes real auth |

---

## 11. Open CTO calls (still need decisions)

| # | Question | Default if you don't decide | When it bites |
|---|---|---|---|
| 1 | Final product name — DealPipe or rename (ParcelIQ, EstateOps, TerraIQ)? | Ship as **DealPipe** | Phase 1 scaffold — affects logo, copy, repo name |
| 2 | Repo folder name — keep `dealPipe` or normalize to `dealpipe`? | **Keep existing `dealPipe`** (folder is already created) | Phase 1 |
| 3 | Stripe — include a mock billing page or skip entirely in V0? | **Mock billing page** (static, no real Stripe wiring in V0) | Phase 7 |
| 4 | Document upload — show static doc cards or omit entirely? | **Static cards** (no upload UI) | Phase 4 — deal detail |
| 5 | 3D geospatial in scope? | **Skip** — Mapbox 2D only | Phase 5 |
| 6 | Linter/formatter — Biome or ESLint+Prettier? | **Biome** (faster, one tool) | Phase 1 |
| 7 | Analytics: Vercel Analytics, Plausible, or none? | **Vercel Analytics** | Phase 7 deploy |
| 8 | Persona switcher placement — `/login` page only, or also as a quick-switcher in the topbar? | **Both** — `/login` is the entry, topbar lets you switch personas without re-logging | Phase 1 |
| 9 | Mapbox token — your existing token or fresh one? | **Fresh public token** under your account | Phase 5 |
| 10 | When (if ever) do we wire Supabase? | **Defer indefinitely** — revisit only if a buyer demo needs real persistence | Phase 8 (or never) |

---

## 12. Risks & mitigations (carried over from build plan, sharpened)

| Risk | Mitigation |
|---|---|
| Mock layer leaks shape across the codebase, making future Supabase port painful | The `lib/data/index.ts` async API is the only seam UI touches. No component imports from `lib/data/seed/*` directly. Enforce via lint rule if needed. |
| AI search returns garbage | The 5 test queries in §8 are an acceptance gate for Phase 6. Tune Claude tool defs until they all pass. |
| Demo feels like generic CRUD | Map + AI search + multi-tenant feel *are* the differentiators. If those slip, demo loses its punch — protect them ruthlessly. |
| Pixel-parity drifts on routes that aren't in the image | §3 design tokens are the single source of truth. New components reference tokens, never raw hex. Periodic side-by-side review with the image during Phase 3. |
| Mock layer feels obviously fake to a sharp viewer (e.g. all timestamps identical, deal names look templated) | Seed generator uses faker + Claude for variety. Timestamps are spread across 6 months. Activity log is irregular, not on a fixed cadence. |

---

## 13. Success criteria — "done" looks like

Copied from `dealpipe-cre-build-plan.md` §13, kept as the acceptance bar:

- [ ] 3+ tenant orgs with distinct seed data (mock — V0)
- [ ] One-click persona login on `/login`
- [ ] Deal pipeline supports drag-between-stage on Kanban (mock-persisted in-session)
- [ ] Property map renders 150+ properties across 5+ US metros without lag
- [ ] AI search returns sensible results from all 5 documented natural-language queries (§8) against the mock dataset
- [ ] All routes mobile-responsive (graceful — not pixel-perfect on mobile, but usable)
- [ ] Lighthouse ≥ 90 across Performance, Accessibility, SEO on the marketing landing page
- [ ] Page-load < 2s on dashboard, < 3s on map view
- [ ] No console errors on any page
- [ ] `/work/dealpipe` case study page live on seedapp.io (out of this repo's scope — Chris owns)
- [ ] "See demo →" button on the case study hits the deployed app
- [ ] One-paragraph internal write-up describing what we built

**Deferred (gate for Supabase Phase 8, if/when triggered):**
- [ ] Real auth replaces persona switcher
- [ ] Schema migrated to Supabase; RLS test plan in §7 passes
- [ ] Mock data layer functions reimplemented against Supabase client; UI unchanged

---

## 14. Next action after this doc

Chris reviews §11 open calls and either:
1. Picks answers for the ones that matter to him,
2. Or says *"go with the defaults"* and I move to Phase 1.

Either way, no code lands until §11 is resolved.
