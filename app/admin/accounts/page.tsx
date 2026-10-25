"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import type { Customer, CustomerStatus, Referral } from "@/lib/customers-db";

interface Earnings {
  orderCount: number;
  referredTotalCents: number;
  commissionCents: number;
}

type ReferralRow = Referral & { email: string; earnings: Earnings | null };

const money = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

const BADGE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  none: "bg-gray-100 text-gray-600 border-gray-200",
};

function Badge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${
        BADGE[status] ?? BADGE.none
      }`}
    >
      {status}
    </span>
  );
}

/**
 * Suggests a code from the account's name or email. Only a suggestion - the
 * field stays editable, because a short memorable code is worth more than a
 * derived one.
 */
function suggestCode(row: ReferralRow, customer?: Customer): string {
  const base = (customer?.name || row.email.split("@")[0] || "").toUpperCase();
  const cleaned = base.replace(/[^A-Z0-9]/g, "");
  return cleaned.slice(0, 12) || `AFF${row.id}`;
}

export default function AdminAccountsPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [referrals, setReferrals] = useState<ReferralRow[]>([]);
  const [codes, setCodes] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const [cRes, rRes] = await Promise.all([
        fetch("/api/admin/customers"),
        fetch("/api/admin/referrals"),
      ]);
      if (cRes.status === 401 || rRes.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const [cData, rData] = await Promise.all([cRes.json(), rRes.json()]);
      if (!cRes.ok || !rRes.ok) {
        setError(cData.error || rData.error || "Failed to load accounts.");
        return;
      }
      setCustomers(cData.customers ?? []);
      setReferrals(rData.referrals ?? []);
    } catch {
      setError("Failed to load accounts.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(id: number, status: CustomerStatus) {
    setBusy(`c${id}`);
    setError("");
    try {
      const res = await fetch("/api/admin/customers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Failed to update account.");
      else await load();
    } finally {
      setBusy(null);
    }
  }

  async function updateReferral(
    id: number,
    action: "approve" | "reject",
    code?: string
  ) {
    setBusy(`r${id}`);
    setError("");
    try {
      const res = await fetch("/api/admin/referrals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, code }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Failed to update referral.");
      else await load();
    } finally {
      setBusy(null);
    }
  }

  const customerById = new Map(customers.map((c) => [c.id, c]));
  const pendingCustomers = customers.filter((c) => c.status === "pending");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Accounts &amp; referrals
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {pendingCustomers.length} account
            {pendingCustomers.length === 1 ? "" : "s"} awaiting review
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Orders
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : (
        <div className="space-y-10">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
              Referral applications
            </h2>
            {referrals.length === 0 ? (
              <p className="text-sm text-gray-500">No applications yet.</p>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Applicant</th>
                      <th className="px-4 py-3 font-medium">Audience</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Code</th>
                      <th className="px-4 py-3 font-medium">Earned</th>
                      <th className="px-4 py-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {referrals.map((row) => {
                      const customer = customerById.get(row.customerId);
                      const codeValue =
                        codes[row.id] ?? row.code ?? suggestCode(row, customer);
                      return (
                        <tr key={row.id} className="align-top">
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">
                              {customer?.name || row.email}
                            </div>
                            <div className="text-xs text-gray-500">{row.email}</div>
                            {customer?.organization && (
                              <div className="text-xs text-gray-500">
                                {customer.organization}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 max-w-sm text-gray-600">
                            {row.audience || "—"}
                            {customer?.researchUse && (
                              <div className="mt-1 text-xs text-gray-500">
                                <span className="font-medium">Stated use:</span>{" "}
                                {customer.researchUse}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <Badge status={row.status} />
                            <div className="mt-1 text-xs text-gray-500">
                              {(row.rateBps / 100).toFixed(0)}%
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {row.status === "approved" ? (
                              <span className="font-mono text-gray-900">
                                {row.code}
                              </span>
                            ) : (
                              <input
                                value={codeValue}
                                onChange={(e) =>
                                  setCodes((prev) => ({
                                    ...prev,
                                    [row.id]: e.target.value.toUpperCase(),
                                  }))
                                }
                                className="h-9 w-36 rounded-lg border border-gray-300 px-2 font-mono text-sm uppercase text-gray-900"
                                placeholder="CODE"
                              />
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {row.earnings ? (
                              <>
                                <div className="font-medium text-gray-900">
                                  {money(row.earnings.commissionCents)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {row.earnings.orderCount} order
                                  {row.earnings.orderCount === 1 ? "" : "s"} ·{" "}
                                  {money(row.earnings.referredTotalCents)}
                                </div>
                              </>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              {row.status !== "approved" && (
                                <button
                                  onClick={() =>
                                    updateReferral(row.id, "approve", codeValue)
                                  }
                                  disabled={busy === `r${row.id}`}
                                  className="h-9 px-3 rounded-lg bg-gray-900 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                                >
                                  Approve
                                </button>
                              )}
                              {row.status !== "rejected" && (
                                <button
                                  onClick={() => updateReferral(row.id, "reject")}
                                  disabled={busy === `r${row.id}`}
                                  className="h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
              Accounts
            </h2>
            {customers.length === 0 ? (
              <p className="text-sm text-gray-500">No accounts yet.</p>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Account</th>
                      <th className="px-4 py-3 font-medium">Organization</th>
                      <th className="px-4 py-3 font-medium">Role &amp; stated use</th>
                      <th className="px-4 py-3 font-medium">Registered</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {customers.map((customer) => (
                      <tr key={customer.id}>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">
                            {customer.name || "—"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {customer.email}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {customer.organization || "—"}
                        </td>
                        <td className="px-4 py-3 max-w-md text-gray-600">
                          {customer.role || "—"}
                          {customer.researchUse && (
                            <div className="mt-1 text-xs text-gray-500">
                              {customer.researchUse}
                            </div>
                          )}
                          {customer.expectedVolume && (
                            <div className="mt-1 text-xs text-gray-500">
                              <span className="font-medium">Volume:</span>{" "}
                              {customer.expectedVolume}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {new Date(customer.createdAt).toLocaleDateString("en-US")}
                        </td>
                        <td className="px-4 py-3">
                          <Badge status={customer.status} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            {customer.status !== "approved" && (
                              <button
                                onClick={() => setStatus(customer.id, "approved")}
                                disabled={busy === `c${customer.id}`}
                                className="h-9 px-3 rounded-lg bg-gray-900 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                              >
                                Approve
                              </button>
                            )}
                            {customer.status !== "rejected" && (
                              <button
                                onClick={() => setStatus(customer.id, "rejected")}
                                disabled={busy === `c${customer.id}`}
                                className="h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
