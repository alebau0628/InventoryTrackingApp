"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Item } from "@/types";

const CATEGORIES = [
  "Ink Cartridges",
  "Art Paper Rolls",
  "Lustre Paper Rolls",
  "Decal Paper Rolls",
  "Canvas Rolls",
  "Other",
];

type Props = {
  item?: Item;
  onClose: () => void;
  onSaved: () => void;
};

export default function ItemModal({ item, onClose, onSaved }: Props) {
  const isEditing = !!item;
  const [form, setForm] = useState({
    name: item?.name ?? "",
    category: item?.category ?? CATEGORIES[0],
    unit: item?.unit ?? "",
    size: item?.size ?? "",
    printer: item?.printer ?? "",
    current_stock: item?.current_stock ?? 0,
    low_stock_threshold: item?.low_stock_threshold ?? 1,
    notes: item?.notes ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name: form.name.trim(),
      category: form.category,
      unit: form.unit.trim(),
      size: form.size.trim() || null,
      printer: form.printer.trim() || null,
      current_stock: Number(form.current_stock),
      low_stock_threshold: Number(form.low_stock_threshold),
      notes: form.notes.trim() || null,
    };

    const { error } = isEditing
      ? await supabase.from("items").update(payload).eq("id", item.id)
      : await supabase.from("items").insert(payload);

    if (error) {
      setError(error.message);
    } else {
      onSaved();
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">{isEditing ? "Edit item" : "Add item"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Epson SC-P9000 Cyan"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                required
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
              <input
                required
                value={form.unit}
                onChange={(e) => set("unit", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. rolls, cartridges"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size / Color</label>
              <input
                value={form.size}
                onChange={(e) => set("size", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder='e.g. 44" or Cyan'
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Printer</label>
              <input
                value={form.printer}
                onChange={(e) => set("printer", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Epson SC-P9000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current stock *</label>
              <input
                required
                type="number"
                min={0}
                step="any"
                value={form.current_stock}
                onChange={(e) => set("current_stock", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Low stock threshold *</label>
              <input
                required
                type="number"
                min={0}
                step="any"
                value={form.low_stock_threshold}
                onChange={(e) => set("low_stock_threshold", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={2}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Supplier, reorder link, etc."
            />
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
              {loading ? "Saving…" : isEditing ? "Save changes" : "Add item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
