"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { CREDIT_REASONS, type CreditEntry } from "@/lib/store-credit-db";

const money = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

const REASON_LABELS: Record<string, string> = {
  damaged_in_transit: "Damaged in transit",
  not_delivered: "Not delivered",
  wrong_item: "Wrong item",
  shipping_error: "Shipping error",
  goodwill: "Goodwill",
  correction: "Correction",
  redeemed: "Redeemed",
};

const field =
  "h-9 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-900";

export default function AdminCreditPage() {
  const router = useRouter();
  const [recent, setRecent] = useState<CreditEntry[]>([]);
  const [lookup, setLookup] = useState("");
  const [found, setFound] = useState<{
    email: string;
    balanceCents: number;
    entries: CreditEntry[];
  } | null>(null);

  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState<string>("damaged_in_transit");
  const [orderId, setOrderId] = useState("");
  const [note, setNote] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadRecent = useCallback(async () => {
    const res = await fetch("/api/admin/store-credit");
    if (res.status === 401) {
      router.replace("/admin/login");
      return;
    }
    const data = await res.json();
    if (res.ok) setRecent(data.entries ?? []);
  }, [router]);

  useEffect(() => {
    loadRecent();
  }, [loadRecent]);

  async function doLookup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch(
      `/api/admin/store-credit?email=${encodeURIComponent(lookup.trim())}`
    );
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Lookup failed.");
      return;
    }
    setFound(data);
    // Issuing is nearly always for the customer just looked up.
    setEmail(data.email);
  }

  async function issue(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/admin/store-credit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          amountDollars: Number(amount),
          reason,
          orderId: orderId.trim() ? Number(orderId.trim()) : null,
          note: note.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not record that.");
        return;
      }
      setNotice(
        `Recorded. ${email.trim()} now has ${money(data.balanceCents)}.`
      );
      setAmount("");
      setOrderId("");
      setNote("");
      await loadRecent();
      if (found && found.email.toLowerCase() === email.trim().toLowerCase()) {
        setLookup(email.trim());
        const r = await fetch(
          `/api/admin/store-credit?email=${encodeURIComponent(email.trim())}`
        );
        if (r.ok) setFound(await r.json());
      }
    } finally {
      setBusy(false);
    }
  }

  function renderRows(entries: CreditEntry[], withEmail: boolean) {
    if (entries.length === 0) {
      return <p className="text-sm text-gray-500">Nothing yet.</p>;
    }
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              {withEmail && <th className="px-4 py-3 font-medium">Customer</th>}
              <th className="px-4 py-3 font-medium">Reason</th>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(entry.createdAt).toLocaleDateString("en-US")}
                </td>
                {withEmail && (
                  <td className="px-4 py-3 text-gray-900">{entry.email}</td>
                )}
                <td className="px-4 py-3 text-gray-600">
                  {REASON_LABELS[entry.reason] ?? entry.reason}
                  {entry.note && (
                    <div className="text-xs text-gray-500">{entry.note}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {entry.orderId ? `#${entry.orderId}` : "—"}
                </td>
                <td
                  className={`px-4 py-3 text-right font-medium ${
                    entry.amountCents < 0 ? "text-red-700" : "text-green-700"
                  }`}
                >
                  {entry.amountCents > 0 ? "+" : ""}
                  {money(entry.amountCents)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store credit</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            The only compensation offered under the shipping and claims policy.
            All sales are final and nothing is ever returned.
          </p>
        </div>
        <Link
          href="/admin/orders"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Orders
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {notice && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {notice}
        </div>
      )}

      <form onSubmit={doLookup} className="mb-8 flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={lookup}
            onChange={(e) => setLookup(e.target.value)}
            placeholder="Look up a customer by email"
            className="h-10 w-full rounded-lg border border-gray-300 pl-9 pr-3 text-sm text-gray-900"
          />
        </div>
        <button
          type="submit"
          className="h-10 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white hover:bg-gray-800"
        >
          Look up
        </button>
      </form>

      {found && (
        <section className="mb-10">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              {found.email}
            </h2>
            <p className="text-lg font-bold text-gray-900">
              {money(found.balanceCents)}
            </p>
          </div>
          {renderRows(found.entries, false)}
        </section>
      )}

      <section className="mb-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Record an entry
        </h2>
        <form
          onSubmit={issue}
          className="rounded-xl border border-gray-200 bg-white p-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-gray-600">
                Customer email
              </span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className={field}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-gray-600">
                Amount in dollars (negative deducts)
              </span>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                step="0.01"
                required
                className={field}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-gray-600">
                Reason
              </span>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className={field}
              >
                {CREDIT_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {REASON_LABELS[r] ?? r}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-gray-600">
                Order number (optional)
              </span>
              <input
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                inputMode="numeric"
                className={field}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-xs font-medium text-gray-600">
                Note (the customer sees this)
              </span>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Replacement for vial damaged in transit"
                className={field}
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="mt-5 h-10 rounded-lg bg-gray-900 px-5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {busy ? "Recording…" : "Record entry"}
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Recent activity
        </h2>
        {renderRows(recent, true)}
      </section>
    </div>
  );
}
