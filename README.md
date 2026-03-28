# Photo Lab Inventory Tracker

A responsive web app to track large-format printing supplies — ink cartridges, paper rolls, canvas, and more. Get a clear view of current stock levels and know when to reorder before running out.

## Features (MVP)
- Dashboard with all inventory items and stock status (OK / Low / Out of stock)
- Visual color indicators per item
- Set a low stock threshold per item
- Add, edit, and remove items
- Log stock changes (restocks and usage)

## Tech Stack
- **[Next.js 15](https://nextjs.org/)** — React framework with App Router
- **[Supabase](https://supabase.com/)** — Postgres database + auto REST API
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first styling
- **[Vercel](https://vercel.com/)** — Hosting and deployment

## Getting Started

### 1. Clone and install dependencies
```bash
npm install
```

### 2. Set up Supabase
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Run the SQL below in the Supabase SQL Editor to create the tables
4. Copy your project URL and anon key from **Project Settings → API**

### 3. Configure environment variables
Create a `.env.local` file in the root (already exists as a template):
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Run the dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Database Setup (Supabase SQL)

Run this in the Supabase SQL Editor:

```sql
-- Items table
create table items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  unit text not null,
  size text,
  printer text,
  current_stock numeric not null default 0,
  low_stock_threshold numeric not null default 1,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Stock logs table
create table stock_logs (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references items(id) on delete cascade,
  change numeric not null,
  reason text,
  created_at timestamptz not null default now()
);

-- Auto-update updated_at on items
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger items_updated_at
before update on items
for each row execute function update_updated_at();
```

---

## Deployment (Vercel)
1. Push the repo to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Add the two environment variables in Vercel project settings
4. Deploy — done

## Status Legend
| Color | Meaning |
|-------|---------|
| Green | Stock is OK |
| Yellow | Low — below threshold, time to order |
| Red | Out of stock |
