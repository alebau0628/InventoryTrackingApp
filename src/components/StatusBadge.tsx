import { StockStatus } from "@/types";

const config: Record<StockStatus, { label: string; className: string }> = {
  ok: { label: "OK", className: "bg-green-100 text-green-800" },
  low: { label: "Low", className: "bg-yellow-100 text-yellow-800" },
  out: { label: "Out of stock", className: "bg-red-100 text-red-800" },
};

export default function StatusBadge({ status }: { status: StockStatus }) {
  const { label, className } = config[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
