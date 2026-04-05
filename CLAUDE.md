# CLAUDE.md — Photo Lab Inventory Tracking App

## What this project is

A web app for tracking printing supplies at a large format photo lab. It alerts when stock runs low so orders can be placed before items run out. Supplies include inkjet ink cartridges (printer-specific, by color), paper rolls (art, lustre, decal — by width), and canvas rolls (by size). Under 20 categories total.

## Principles

- MVP first, iterate later — don't over-engineer
- No budget — free tiers only (Supabase free Postgres, Vercel free hosting)
- Simple over clever — keep it straightforward

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend + API routes | Next.js (App Router) |
| Database | Supabase (free Postgres) |
| Hosting | Vercel (free tier, deploys from GitHub) |
| Styling | Tailwind CSS v3 |
| Language | TypeScript |

Key packages: `@supabase/supabase-js ^2`, `next ^16`, `react ^19`, `tailwindcss ^3.4`.

---

## Folder Structure

```
src/
  app/
    globals.css        # Just the three Tailwind directives — no custom CSS
    layout.tsx         # Root layout: sets fonts, metadata, bg-gray-50 body
    page.tsx           # The entire dashboard (only page so far)
  components/
    ItemModal.tsx      # Add/edit item form — shared for both modes
    StatusBadge.tsx    # Pill badge: OK / Low / Out of stock
    StockUpdateModal.tsx  # Log a usage or restock for a single item
  lib/
    supabase.ts        # Creates and exports the Supabase client
  types/
    index.ts           # Item type, StockLog type, StockStatus type, getStockStatus()
supabase/
  schema.sql           # Full DB schema — run this in Supabase SQL editor
plan.md                # Original planning doc with data model and future ideas
```

---

## Database Schema

### `items` table
| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK, auto-generated |
| `name` | `text` | e.g. "Epson SC-P9000 Cyan" |
| `category` | `text` | One of the 6 categories below |
| `unit` | `text` | "cartridges", "rolls", "units" |
| `size` | `text?` | Width for rolls (e.g. `44"`), color for ink (e.g. `Cyan`) |
| `printer` | `text?` | Which printer the ink belongs to |
| `current_stock` | `numeric` | Quantity on hand |
| `low_stock_threshold` | `numeric` | Alert when stock falls to or below this |
| `notes` | `text?` | Supplier info, reorder link, etc. |
| `created_at` / `updated_at` | `timestamptz` | Auto-managed; `updated_at` via trigger |

### `stock_logs` table
| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `item_id` | `uuid` | FK → `items.id` (cascade delete) |
| `change` | `numeric` | Positive = restock, negative = usage |
| `reason` | `text?` | e.g. "Weekly restock", "Order #42" |
| `created_at` | `timestamptz` | Auto |

---

## Categories (fixed, ordered)

```ts
const CATEGORY_ORDER = [
  "Ink Cartridges",
  "Art Paper Rolls",
  "Lustre Paper Rolls",
  "Decal Paper Rolls",
  "Canvas Rolls",
  "Other",
];
```

This order is hardcoded in both `page.tsx` and `ItemModal.tsx`. Categories without any items are hidden from the dashboard.

---

## Stock Status Logic

Computed in the app (not the DB), in `src/types/index.ts`:

```
current_stock <= 0              → "out"   (red)
current_stock <= low_threshold  → "low"   (yellow)
else                            → "ok"    (green)
```

---

## Design Choices

### Fonts
- **Geist Sans** (`--font-geist-sans`) — primary UI font
- **Geist Mono** (`--font-geist-mono`) — available via CSS variable, not actively used yet
- Both loaded from `next/font/google` in `layout.tsx`

### Colors (Tailwind defaults, no custom palette)
| Use | Color |
|-----|-------|
| Page background | `gray-50` |
| Card / modal background | `white` |
| Primary action button | `blue-600` (hover `blue-700`) |
| OK status stripe / badge | `green-400` / `green-100 text-green-800` |
| Low status stripe / badge | `yellow-400` / `yellow-100 text-yellow-800` |
| Out status stripe / badge | `red-500` / `red-100 text-red-800` |
| Delete button | `red-500` (hover `red-50` bg) |
| Alert count text | `yellow-700` |
| Section headings | `gray-500` uppercase |
| Item name | `gray-900` |
| Secondary text | `gray-400` |

### Layout
- Max content width: `max-w-5xl` centered with `px-4`
- Sticky header with white background and bottom border
- Items grouped by category into white `rounded-xl border` cards with `divide-y` rows
- Each row has: colored left stripe → item name/subtitle → stock count + threshold → status badge → action buttons
- Modals are centered overlays with `bg-black/50` backdrop, `rounded-xl shadow-xl`, max-w-lg (ItemModal) or max-w-sm (StockUpdateModal)
- Filter bar: search input + three toggle buttons (All / Low / Out of stock)

### UI Patterns
- Form focus ring: `focus:ring-2 focus:ring-blue-500`
- All inputs and selects: `border rounded-lg px-3 py-2 text-sm`
- Active filter button: `bg-gray-900 text-white`
- Inactive filter button: `bg-white text-gray-600 hover:bg-gray-50`
- Loading state: centered gray text
- Empty state: centered gray text with contextual hint

---

## Pages / Sections

There is currently **one page**: the dashboard (`src/app/page.tsx`).

It contains:
1. **Header** — app title, alert count, "+ Add item" button (sticky)
2. **Filters** — search box + All/Low/Out toggle
3. **Grouped item list** — one section per category, items as rows
4. **Modals** (conditionally rendered):
   - `ItemModal` in add mode (triggered by "+ Add item")
   - `ItemModal` in edit mode (triggered by "Edit" on a row)
   - `StockUpdateModal` (triggered by "Update" on a row)

---

## Environment Variables

Stored in `.env.local` (not committed):
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## Post-MVP Features (from plan.md)

- Order tracking — mark when an order has been placed
- Email / push notifications when stock hits low threshold
- User authentication for multi-staff access
- History view using the `stock_logs` table (logs are already written, just not displayed)
