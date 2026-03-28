export type Item = {
  id: string;
  name: string;
  category: string;
  unit: string;
  size: string | null;
  printer: string | null;
  current_stock: number;
  low_stock_threshold: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type StockLog = {
  id: string;
  item_id: string;
  change: number;
  reason: string | null;
  created_at: string;
};

export type StockStatus = "ok" | "low" | "out";

export function getStockStatus(item: Item): StockStatus {
  if (item.current_stock <= 0) return "out";
  if (item.current_stock <= item.low_stock_threshold) return "low";
  return "ok";
}
