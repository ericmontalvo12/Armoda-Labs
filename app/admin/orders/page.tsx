"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Package,
  DollarSign,
  ShoppingBag,
  Clock,
  LogOut,
  RefreshCw,
  Download,
  ImageDown,
} from "lucide-react";
import type { Order, OrderStatus } from "@/lib/orders-db";
import { OrderDetail } from "./OrderDetail";

interface Stats {
  totalRevenue: number;
  orderCount: number;
  unfulfilled: number;
  last30dRevenue: number;
}

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const STATUS_STYLES: Record<OrderStatus, string> = {
  unfulfilled: "bg-amber-50 text-amber-700 border-amber-200",
  fulfilled: "bg-green-50 text-green-700 border-green-200",
  refunded: "bg-gray-100 text-gray-600 border-gray-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const FILTERS: { id: OrderStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unfulfilled", label: "Unfulfilled" },
  { id: "fulfilled", label: "Fulfilled" },
  { id: "refunded", label: "Refunded" },
];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [selected, setSelected] = useState<Order | null>(null);
  const [backfilling, setBackfilling] = useState(false);
  const [shrinking, setShrinking] = useState(false);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (status !== "all") params.set("status", status);
      const res = await fetch(`/api/admin/orders?${params}`);
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load orders.");
        return;
      }
      setOrders(data.orders);
      setStats(data.stats);
    } catch {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, [search, status, router]);

  // Debounced so typing in search doesn't fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  const handleBackfill = async () => {
    setBackfilling(true);
    setNotice("");
    try {
      const res = await fetch("/api/admin/backfill", { method: "POST" });
      const data = await res.json();
      setNotice(
        res.ok
          ? `Imported ${data.imported} paid order${data.imported === 1 ? "" : "s"} from Stripe.`
          : data.error || "Backfill failed."
      );
      load();
    } catch {
      setNotice("Backfill failed.");
    } finally {
      setBackfilling(false);
    }
  };

  // Rewrites review photos that predate the upload size cap. Measures first and
  // asks before writing, since it re-encodes stored images in place.
  const handleShrinkPhotos = async () => {
    setShrinking(true);
    setNotice("");
    const mb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(2)}MB`;
    try {
      const dry = await fetch("/api/admin/shrink-review-photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apply: false }),
      });
      const plan = await dry.json();
      if (!dry.ok) {
        setNotice(plan.error || "Could not check review photos.");
        return;
      }

      const oversized = plan.rows.filter(
        (r: { action: string }) => r.action === "would-rewrite"
      ).length;
      if (oversized === 0) {
        setNotice(
          `All ${plan.photos} review photo${plan.photos === 1 ? "" : "s"} are already optimised. Nothing to do.`
        );
        return;
      }

      const confirmed = window.confirm(
        `${oversized} review photo${oversized === 1 ? "" : "s"} can be shrunk, ` +
          `taking ${mb(plan.bytesBefore)} down to ${mb(plan.bytesAfter)}.\n\n` +
          `The stored images are re-encoded in place and the originals are not kept. ` +
          `Displayed size on the review cards does not change.\n\nProceed?`
      );
      if (!confirmed) {
        setNotice("Cancelled - nothing was changed.");
        return;
      }

      const res = await fetch("/api/admin/shrink-review-photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apply: true }),
      });
      const done = await res.json();
      setNotice(
        res.ok
          ? `Shrank ${done.rewritten} review photo${done.rewritten === 1 ? "" : "s"}: ${mb(done.bytesBefore)} → ${mb(done.bytesAfter)}.`
          : done.error || "Could not shrink review photos."
      );
    } catch {
      setNotice("Could not shrink review photos.");
    } finally {
      setShrinking(false);
    }
  };

  const exportCsv = () => {
    const header = [
      "Order", "Date", "Name", "Email", "Total", "Status", "Carrier", "Tracking",
      "Address", "City", "State", "ZIP",
    ];
    const rows = orders.map((o) => [
      o.stripeSessionId, new Date(o.createdAt).toISOString(),
      o.customerName ?? o.shippingName ?? "", o.email ?? "",
      o.amountTotal.toFixed(2), o.status, o.carrier ?? "", o.trackingNumber ?? "",
      o.addressLine1 ?? "", o.city ?? "", o.state ?? "", o.postalCode ?? "",
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Rock Mountain Performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleBackfill}
            disabled={backfilling}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            title="Import historical paid orders from Stripe"
          >
            <RefreshCw className={`w-4 h-4 ${backfilling ? "animate-spin" : ""}`} />
            {backfilling ? "Importing…" : "Import from Stripe"}
          </button>
          <button
            onClick={handleShrinkPhotos}
            disabled={shrinking}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            title="Re-encode review photos uploaded before the size cap, to cut database transfer"
          >
            <ImageDown className={`w-4 h-4 ${shrinking ? "animate-pulse" : ""}`} />
            {shrinking ? "Checking…" : "Shrink review photos"}
          </button>
          <button
            onClick={exportCsv}
            disabled={!orders.length}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>

      {notice && (
        <p className="mb-4 text-sm text-gray-700 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2">
          {notice}
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Revenue (all time)", value: stats ? money(stats.totalRevenue) : "—", Icon: DollarSign },
          { label: "Revenue (30 days)", value: stats ? money(stats.last30dRevenue) : "—", Icon: Clock },
          { label: "Orders", value: stats ? String(stats.orderCount) : "—", Icon: ShoppingBag },
          { label: "Awaiting shipment", value: stats ? String(stats.unfulfilled) : "—", Icon: Package },
        ].map(({ label, value, Icon }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, order id, tracking…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-0.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setStatus(f.id)}
              className={`px-3 h-8 rounded-md text-sm transition-colors ${
                status === f.id
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-red-600">{error}</div>
        ) : orders.length === 0 ? (
          <div className="p-10 text-center">
            <Package className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600 font-medium">No orders found</p>
            <p className="text-xs text-gray-500 mt-1">
              {search || status !== "all"
                ? "Try clearing the search or filter."
                : 'New orders appear automatically. For past orders, use "Import from Stripe".'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["Date", "Customer", "Total", "Status", "Tracking"].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o.id}
                    onClick={() => setSelected(o)}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {o.customerName || o.shippingName || "—"}
                      </div>
                      <div className="text-xs text-gray-500">{o.email || "no email"}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900 tabular-nums whitespace-nowrap">
                      {money(o.amountTotal)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full border text-xs font-medium capitalize ${STATUS_STYLES[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {o.trackingNumber ? (
                        <span className="font-mono text-xs">{o.trackingNumber}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <OrderDetail
          order={selected}
          onClose={() => setSelected(null)}
          onUpdated={(updated) => {
            setSelected(updated);
            load();
          }}
        />
      )}
    </div>
  );
}
