"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Item, getStockStatus } from "@/types";
import StatusBadge from "@/components/StatusBadge";
import ItemModal from "@/components/ItemModal";
import StockUpdateModal from "@/components/StockUpdateModal";

type Modal =
  | { type: "add" }
  | { type: "edit"; item: Item }
  | { type: "stock"; item: Item }
  | null;

const CATEGORY_ORDER = [
  "Ink Cartridges",
  "Art Paper Rolls",
  "Lustre Paper Rolls",
  "Decal Paper Rolls",
  "Canvas Rolls",
  "Other",
];

export default function Dashboard() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Modal>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "low" | "out">("all");

  async function fetchItems() {
    const { data } = await supabase
      .from("items")
      .select("*")
      .order("category")
      .order("name");
    setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchItems(); }, []);

  async function deleteItem(id: string) {
    if (!confirm("Delete this item?")) return;
    await supabase.from("items").delete().eq("id", id);
    fetchItems();
  }

  const filtered = items.filter((item) => {
    const status = getStockStatus(item);
    if (filterStatus === "low" && status !== "low") return false;
    if (filterStatus === "out" && status !== "out") return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.printer?.toLowerCase().includes(q) ||
        item.size?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const grouped = CATEGORY_ORDER.reduce<Record<string, Item[]>>((acc, cat) => {
    const inCategory = filtered.filter((i) => i.category === cat);
    if (inCategory.length > 0) acc[cat] = inCategory;
    return acc;
  }, {});

  const alertCount = items.filter((i) => getStockStatus(i) !== "ok").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Photo Lab Inventory</h1>
            {alertCount > 0 && (
              <p className="text-xs text-yellow-700 font-medium mt-0.5">
                {alertCount} item{alertCount > 1 ? "s" : ""} need attention
              </p>
            )}
          </div>
          <button
            onClick={() => setModal({ type: "add" })}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 whitespace-nowrap"
          >
            + Add item
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="search"
            placeholder="Search items…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            {(["all", "low", "out"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  filterStatus === s
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {s === "all" ? "All" : s === "low" ? "Low" : "Out of stock"}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-center text-gray-400 py-16">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">No items found</p>
            <p className="text-sm mt-1">
              {items.length === 0 ? 'Click "+ Add item" to get started.' : "Try adjusting your search or filter."}
            </p>
          </div>
        ) : (
          Object.entries(grouped).map(([category, categoryItems]) => (
            <section key={category}>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {category}
              </h2>
              <div className="bg-white rounded-xl border divide-y">
                {categoryItems.map((item) => {
                  const status = getStockStatus(item);
                  return (
                    <div key={item.id} className="flex items-center gap-4 px-4 py-3">
                      {/* Status stripe */}
                      <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${
                        status === "ok" ? "bg-green-400" : status === "low" ? "bg-yellow-400" : "bg-red-500"
                      }`} />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {[item.size, item.printer].filter(Boolean).join(" · ")}
                        </p>
                      </div>

                      {/* Stock */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {item.current_stock} <span className="font-normal text-gray-400 text-xs">{item.unit}</span>
                        </p>
                        <p className="text-xs text-gray-400">min {item.low_stock_threshold}</p>
                      </div>

                      <StatusBadge status={status} />

                      {/* Actions */}
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => setModal({ type: "stock", item })}
                          className="text-xs border rounded-lg px-2 py-1 text-gray-600 hover:bg-gray-50"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => setModal({ type: "edit", item })}
                          className="text-xs border rounded-lg px-2 py-1 text-gray-600 hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="text-xs border rounded-lg px-2 py-1 text-red-500 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </main>

      {/* Modals */}
      {modal?.type === "add" && (
        <ItemModal
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); fetchItems(); }}
        />
      )}
      {modal?.type === "edit" && (
        <ItemModal
          item={modal.item}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); fetchItems(); }}
        />
      )}
      {modal?.type === "stock" && (
        <StockUpdateModal
          item={modal.item}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); fetchItems(); }}
        />
      )}
    </div>
  );
}
