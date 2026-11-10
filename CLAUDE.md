# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Delta Prime — premium heavy-equipment rental site (аренда спецтехники). Next.js 15 App Router, fully static (SSG), TypeScript, Tailwind CSS v4. UI copy is in Russian.

## Commands

```bash
npm run dev          # dev server (http://localhost:3000)
npm run build        # production build — also runs full type check + lint
npm run typecheck    # tsc --noEmit, no build
npm run lint         # next lint
npm run lint:fix     # next lint --fix
npm run format       # prettier --write across the repo
```

There is no test suite.

### Environment gotchas (Windows + Git Bash)

- **Node is not on the Git Bash PATH.** Prefix node/npm commands with `export PATH="$PATH:/c/Program Files/nodejs";` (shell state does not persist between calls).
- **Do not run `next build` while `next dev` is running.** Build overwrites `.next` and leaves the dev server serving 500s plus a zombie `node` process. To recover: `taskkill //F //IM node.exe`, `rm -rf .next`, then restart `next dev`.

## Architecture

### Rendering model
Everything is statically prerendered. Catalog detail pages (`src/app/catalog/[slug]/page.tsx`) use `generateStaticParams`. `next.config.mjs` keeps Node-server flexibility (no `output: 'export'` yet) — a comment there documents how to switch to a fully static export if needed.

### Design-token system (the core convention)
`src/app/globals.css` is the single source of styling truth, built on Tailwind v4's `@theme`:

- **Base tokens** (`@theme`): brand/accent colors, radii, shadows (`shadow-elev-1..3`), font.
- **Semantic tokens** are CSS variables (`--bg`, `--surface`, `--text`, `--border`, `--brand`, …) that **switch on the `data-theme` attribute** (`light` default on `<html>`, `dark` variant defined). They are re-exposed as Tailwind utilities via `@theme inline` → use `bg-surface`, `text-text`, `text-text-muted`, `border-border`, `bg-brand`, etc.
- **Never hardcode hex colors in markup.** Use the semantic utilities. To get light text over a dark media background, set `data-theme="dark"` on a wrapper rather than hardcoding — though the home page currently uses a single light theme throughout.
- `design-system.html` at the repo root is the original static design reference these tokens/components were derived from.

- **Custom utilities** live in `globals.css` under `@layer utilities`: two width knobs `.max-w-page` (1860px) and `.max-w-content` (1440px), plus decorative `.bg-blueprint` (hairline grid), `.hazard-stripe`, `.bg-media-fallback`, `.hero-overlay`.

Class merging uses `cn()` (`src/lib/cn.ts` — clsx + tailwind-merge). Button styling lives in `src/components/ui/buttonStyles.ts`: `buttonClasses({ variant, size })` produces the class string so a `next/link` can be styled as a button in server components (`Button.tsx` wraps it for the interactive case).

### Layout width (two-tier)
Two width caps, both defined once in `globals.css` (change the number there):
- **`.max-w-content` (1440px)** — content pages: the home page (via `Container`), `/about`, catalog detail (`/catalog/[slug]`), and the global chrome (`Navbar`, `Footer`).
- **`.max-w-page` (1860px)** — the full-width catalog listing (`/catalog`) only, where the filter sidebar + product grid want maximum room.

Standard gutters are `px-4 sm:px-6 lg:px-8`. `Container` (`src/components/ui/Container.tsx`) applies `max-w-content` **per section** (not page-wide), so home sections render full-bleed backgrounds while content stays contained. Text/readability caps (`max-w-2xl/3xl/4xl` on headings, paragraphs, forms) are intentional and independent of these page caps.

The site is exactly three nav pages — Главная (`/`), Каталог (`/catalog`), О компании (`/about`) — plus per-item catalog detail pages that count as part of the catalog.

### Component organization
- `src/components/blocks/` — page sections (Navbar, Footer, HeroSearch, ServicesGrid, B2BTrust, Advantages, ContactsSection, EquipmentCard, …). These compose pages. Home (`/`) renders HeroSearch → ServicesGrid → B2BTrust → Advantages → featured EquipmentCards; ContactsSection lives on `/about`. `BookingPanel` (`'use client'`) wraps `BookingForm` as a toggle-CTA on catalog detail (`/catalog/[slug]`) so the form doesn't push the page down. `BlogTeaser` + its placeholder data (`src/data/posts.ts`) exist but are **not wired into any page yet**.
- `src/components/ui/` — primitives reused across blocks (`Button`, `Input`, `Container`, `BackgroundMedia`, `ShaderBackground`, `Reveal`, `Badge`, `Chip`). See **Layout width** for `Container`.
- `Reveal` is the standard scroll-in animation wrapper (framer-motion); `B2BTrust` counters use the same `useInView` pattern. Animated/interactive components are `'use client'`; most blocks are server components.
- **Lucide icons can't be passed as a component prop from a Server to a Client Component** — pass them as JSX children instead (see `Button`).

### Data layer
Content is static data, not a CMS/DB:
- **Catalog**: a single `src/data/catalog/equipment.json` array (all units) plus `src/data/catalog/categories.json`, imported and cast to domain types in `src/lib/catalog.ts`. (Was per-item JSON; consolidated into one array once the catalog grew to ~50+ units.) That module is the API for catalog data — `equipmentCatalog`, `featuredEquipment`, `getEquipmentBySlug`, `getCategoryTitle`, `getRelatedEquipment`. JSON is typed loosely on import and cast to `Equipment`/`EquipmentCategory` (`src/types/equipment.ts`, re-exported from `src/types`). Prices carry a primary `amount` (per shift) plus optional `hourly` and a `from` flag; `amount: 0` renders as «Цена по запросу».
- **Equipment images**: only some units have a real photo. `getEquipmentImage(equipment)` in `src/lib/catalog.ts` returns the `image` path only when the slug is in `EQUIPMENT_IMAGE_SLUGS` (files live in `public/images/catalog/<slug>.jpg`); otherwise `undefined` → `EquipmentCard`/detail render an icon placeholder instead of a broken `next/image`. Adding a photo = drop the file + add the slug to that set.
- **Formatting**: `src/lib/format.ts` is the single source for display formatting — `formatPrice` (ru-RU digit grouping, `32500 → "32 500"`) and `rentalUnitLabel` (`'shift' → 'смена'`). Used by `EquipmentCard`, `CatalogBrowser`, and catalog detail — don't re-implement `Intl.NumberFormat` inline.
- **Services** (`src/data/services.ts`) and **contacts** (`src/data/contacts.ts`) are typed TS modules. `contacts.ts` is the shared source for phones/emails/offices/`WORKING_HOURS`/`MESSENGERS` used by `Navbar`, `Footer`, and `ContactsSection` — keep it the single source rather than duplicating literals.

### Catalog filtering (`/catalog`)
`CatalogBrowser` (`src/components/blocks/CatalogBrowser.tsx`, `'use client'`) is a DNS-style faceted browser: left sidebar (single-select category + availability/price/brand) with a single result grid; facet counts recompute against the other active filters. Per-category **contextual spec filters** are auto-derived from each item's free-form `specs` by `src/lib/catalogFacets.ts` (`deriveSpecFacets`/`matchesSpecFilters`): mostly-numeric labels become range filters, small discrete sets become checkbox facets, noisy labels are skipped. This works because spec `label`s are consistent within a category — keep them uniform when adding equipment.

### Media / backgrounds
Two reusable absolute background layers (`inset-0 -z-10`); the parent must be `relative overflow-hidden`. Both gate on `prefers-reduced-motion` + `≥768px` and fall back to the CSS gradient/grid, so SSR and mobile never break.
- `src/components/ui/BackgroundMedia.tsx` — gradient fallback → poster → video → overlay. Used in the **home hero**. Drop-in video assets go in `public/media/` with fixed filenames from `public/media/README.md` (`hero.mp4`, `hero.webm`, `hero-poster.jpg`); with no file it shows a labelled placeholder that disappears once the file exists.
- `src/components/ui/ShaderBackground.tsx` — animated "blueprint/contour" backdrop: static `.bg-blueprint` grid + a `Dithering` shader (`@paper-design/shaders-react`, loaded via `next/dynamic` with `ssr: false`). Used **only in the About hero** (full-width band).

### Dependencies convention
No third-party UI-component kits (MUI/Bootstrap/shadcn) and no CMS — the UI is hand-built on the design tokens. Runtime deps beyond React/Next are intentionally minimal: `framer-motion` (animation), `lucide-react` (icons), `clsx`+`tailwind-merge` (via `cn`), and `@paper-design/shaders-react` — the one visual/WebGL library, added deliberately for `ShaderBackground` (it's a canvas shader, not a UI kit). Prefer extending the token system over adding UI libraries.

## Code conventions enforced by tooling

- `tsconfig` is strict with `noUncheckedIndexedAccess` — **array/index access yields `T | undefined`**. Guard it, or expose an explicitly-typed singular export (see `PRIMARY_PHONE`/`PRIMARY_EMAIL` in `contacts.ts`) rather than indexing inline.
- ESLint enforces inline type-only imports (`import { type Foo }`), no unused vars (prefix intentional ones with `_`), and `no-console` except `warn`/`error`.
- Path aliases: `@/*`, plus `@/components/*`, `@/lib/*`, `@/data/*`, `@/types`.
- 2-space indent, LF, final newline (`.editorconfig`); Prettier with `prettier-plugin-tailwindcss` orders classes — run `npm run format` rather than hand-ordering.
