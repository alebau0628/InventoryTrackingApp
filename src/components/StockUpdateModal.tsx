"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Item } from "@/types";

type Props = {
  item: Item;
  onClose: () => void;
  onSaved: () => void;
};

export default function StockUpdateModal({ item, onClose, onSaved }: Props) {
  const [type, setType] = useState<"restock" | "usage">("usage");
  const [amount, setAmount] = useState(1);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const change = type === "restock" ? amount : -amount;
    const newStock = item.current_stock + change;

    const { error: logError } = await supabase.from("stock_logs").insert({
      item_id: item.id,
      change,
      reason: reason.trim() || null,
    });

    if (logError) {
      setError(logError.message);
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("items")
      .update({ current_stock: newStock })
      .eq("id", item.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      onSaved();
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-lg font-semibold">Update stock</h2>
            <p className="text-sm text-gray-500 mt-0.5">{item.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex rounded-lg border overflow-hidden">
            <button
              type="button"
              onClick={() => setType("usage")}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${type === "usage" ? "bg-red-50 text-red-700" : "text-gray-600 hover:bg-gray-50"}`}
            >
              Usage (-)
            </button>
            <button
              type="button"
              onClick={() => setType("restock")}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${type === "restock" ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"}`}
            >
              Restock (+)
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount ({item.unit})
            </label>
            <input
              required
              type="number"
              min={1}
              step="any"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Weekly restock, order #42"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
            Current: <span className="font-medium">{item.current_stock} {item.unit}</span>
            {" → "}
            New: <span className="font-medium">{item.current_stock + (type === "restock" ? amount : -amount)} {item.unit}</span>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving…" : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
