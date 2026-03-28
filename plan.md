# Inventory Tracking App — Plan

## Goal
A responsive web app to track inventory at a photo lab. Alerts when stock is running low so orders can be placed before items run out.

## Principles
- MVP first, iterate later
- No budget — free tier only
- Simple over clever

## Core Features (MVP)
- View all inventory items with current stock levels
- Set a "low stock threshold" per item (e.g., alert when below 5 units)
- Visual indicators: OK / Low / Out of stock
- Add / edit / remove inventory items
- Log stock changes (restock, usage)

## Post-MVP (future iterations)
- Order tracking — mark when an order has been placed
- Email / push notifications when stock hits low threshold
- User authentication for multi-staff access
- Categories / filters for large inventories

## Cross-platform
- Responsive layout: works on mobile browser and desktop
- No native app required

---

## Tech Stack (decided)

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend + API routes | **Next.js** | Full-stack, great free ecosystem, easy Vercel deploy |
| Database | **Supabase** | Free Postgres + auto REST API + dashboard UI |
| Hosting | **Vercel** | Free tier, deploys from GitHub, pairs with Next.js |

---

## Data Model

### Categories (real-world)
| Category | Example items | Unit |
|----------|--------------|------|
| Ink Cartridges | Epson SC-P9000 Cyan, Canon Pro-4100 Matte Black | cartridges |
| Art Paper Rolls | Hahnemühle Photo Rag 308gsm 44" | rolls |
| Lustre Paper Rolls | Epson Premium Lustre 260 36" | rolls |
| Decal Paper Rolls | Clear Decal 24" | rolls |
| Canvas Rolls | Breathing Color Lyve 60" | rolls |
| Other | Maintenance tanks, head cleaning kits, etc. | units |

### `items` table
Represents each product/supply tracked in the lab.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | Primary key, auto-generated |
| `name` | `text` | e.g. "Epson SC-P9000 Cyan", "Canvas Roll 60\"" |
| `category` | `text` | See categories above |
| `unit` | `text` | "cartridges", "rolls", "units" |
| `size` | `text` | Width for rolls (e.g. "24\"", "36\"", "44\""), color for ink (e.g. "Cyan", "Matte Black") |
| `printer` | `text` | For ink cartridges — which printer it belongs to (e.g. "Epson SC-P9000") |
| `current_stock` | `numeric` | Current quantity on hand |
| `low_stock_threshold` | `numeric` | Alert when `current_stock` falls below this |
| `notes` | `text` | Optional — supplier info, reorder link, etc. |
| `created_at` | `timestamptz` | Auto-set on insert |
| `updated_at` | `timestamptz` | Auto-updated on change |

### `stock_logs` table
Every time stock changes (used or restocked), a log entry is created. Gives you a history of consumption and restocks.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | Primary key |
| `item_id` | `uuid` | Foreign key → `items.id` |
| `change` | `numeric` | Positive = restock, negative = usage |
| `reason` | `text` | Optional — e.g. "Weekly restock", "Used for order #42" |
| `created_at` | `timestamptz` | When the change happened |

### Derived status logic (computed in app, not DB)
```
if current_stock <= 0           → "Out of stock"  (red)
if current_stock <= threshold   → "Low"           (yellow)
else                            → "OK"            (green)
```

---

## Next Steps

- [ ] 1. Scaffold the Next.js project
- [ ] 2. Set up Supabase project + create tables
- [ ] 3. Build the inventory dashboard (list view with status indicators)
- [ ] 4. Build add/edit/delete item forms
- [ ] 5. Build stock update flow (log a usage or restock)
- [ ] 6. Deploy to Vercel
