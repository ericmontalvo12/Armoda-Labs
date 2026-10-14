"use client";

import { useState } from "react";
import { X, Truck, Check, ExternalLink, AlertTriangle } from "lucide-react";
import type { Order } from "@/lib/orders-db";
import { CARRIERS, getCarrier } from "@/lib/shipping";

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export function OrderDetail({
  order,
  onClose,
  onUpdated,
}: {
  order: Order;
  onClose: () => void;
  onUpdated: (o: Order) => void;
}) {
  const [carrier, setCarrier] = useState(order.carrier || "usps");
  const [tracking, setTracking] = useState(order.trackingNumber || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmResend, setConfirmResend] = useState(false);

  const alreadySent = Boolean(order.trackingEmailSentAt);

  const submit = async (resend: boolean) => {
    setError("");
    setWarning("");
    setSuccess("");
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/fulfill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carrier, trackingNumber: tracking, resend }),
      });
      const data = await res.json();

      if (res.status === 409 && data.alreadySent) {
        setConfirmResend(true);
        setError("");
        return;
      }
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setConfirmResend(false);
      if (data.warning) setWarning(data.warning);
      else setSuccess("Tracking saved and email sent.");
      if (data.order) onUpdated(data.order);
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const trackingUrl =
    order.trackingNumber && order.carrier
      ? getCarrier(order.carrier)?.trackingUrl(order.trackingNumber) || ""
      : "";

  const addressLines = [
    order.shippingName,
    order.addressLine1,
    order.addressLine2,
    [order.city, order.state, order.postalCode].filter(Boolean).join(", "),
    order.country,
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white h-full overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Order details</h2>
            <p className="text-xs text-gray-500 font-mono mt-0.5 break-all">
              {order.stripeSessionId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Customer */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Customer</h3>
            <p className="text-sm font-medium text-gray-900">
              {order.customerName || order.shippingName || "—"}
            </p>
            {order.email && <p className="text-sm text-gray-600">{order.email}</p>}
            {order.phone && <p className="text-sm text-gray-600">{order.phone}</p>}
          </section>

          {/* Shipping */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ship to</h3>
            {addressLines.length ? (
              <address className="text-sm text-gray-700 not-italic leading-relaxed">
                {addressLines.map((l, i) => (
                  <div key={i}>{l}</div>
                ))}
              </address>
            ) : (
              <p className="text-sm text-gray-400">No address on file</p>
            )}
          </section>

          {/* Items */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Items</h3>
            {order.lineItems.length ? (
              <ul className="space-y-1.5">
                {order.lineItems.map((li, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {li.quantity} × {li.description}
                    </span>
                    <span className="text-gray-900 tabular-nums">{money(li.amountTotal)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">No line items recorded</p>
            )}
            <div className="flex justify-between pt-2 mt-2 border-t border-gray-200 text-sm font-semibold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900 tabular-nums">{money(order.amountTotal)}</span>
            </div>
          </section>

          {/* Fulfilment */}
          <section className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-900">Shipping &amp; tracking</h3>
            </div>

            {alreadySent && (
              <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-2.5 py-2 mb-3 flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span>
                  Tracking email sent{" "}
                  {new Date(order.trackingEmailSentAt!).toLocaleString("en-US")}
                </span>
              </p>
            )}

            <div className="space-y-3">
              <div>
                <label htmlFor="carrier" className="text-xs text-gray-600 mb-1 block">Carrier</label>
                <select
                  id="carrier"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                >
                  {CARRIERS.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="tracking" className="text-xs text-gray-600 mb-1 block">Tracking number</label>
                <input
                  id="tracking"
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                  placeholder="Paste tracking number"
                  className="w-full h-9 px-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                />
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-2.5 py-2">
                  {error}
                </p>
              )}
              {warning && (
                <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-2 flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span>{warning}</span>
                </p>
              )}
              {success && (
                <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-2.5 py-2">
                  {success}
                </p>
              )}

              {confirmResend ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs text-amber-900 mb-2.5">
                    A tracking email already went out for this order. Send another?
                    The customer will receive a second email.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => submit(true)}
                      disabled={saving}
                      className="h-8 px-3 rounded-lg bg-amber-600 text-white text-xs font-medium hover:bg-amber-700 disabled:opacity-50"
                    >
                      {saving ? "Sending…" : "Yes, send again"}
                    </button>
                    <button
                      onClick={() => setConfirmResend(false)}
                      className="h-8 px-3 rounded-lg border border-gray-300 bg-white text-xs text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => submit(false)}
                  disabled={saving || !tracking.trim()}
                  className="w-full h-9 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {saving
                    ? "Saving…"
                    : alreadySent
                    ? "Update tracking"
                    : "Save & email tracking"}
                </button>
              )}

              {trackingUrl && (
                <a
                  href={trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                >
                  Track package <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
