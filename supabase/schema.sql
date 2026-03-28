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

-- Auto-update updated_at whenever an item is modified
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
