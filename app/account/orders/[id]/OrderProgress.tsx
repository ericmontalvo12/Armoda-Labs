import { Check } from "lucide-react";

/**
 * Four-step delivery progress.
 *
 * Steps map to the only states an order actually has in the database:
 * unfulfilled, fulfilled, refunded, cancelled. Nothing here infers a step
 * the data cannot support, so "Shipped" lights up when a tracking number
 * exists, not when someone hopes it has gone out.
 */
export function OrderProgress({
  status,
  placedAt,
  carrier,
  trackingNumber,
}: {
  status: string;
  placedAt: string;
  carrier: string | null;
  trackingNumber: string | null;
}) {
  const stopped = status === "cancelled" || status === "refunded";
  const shipped = Boolean(trackingNumber) || status === "fulfilled";

  const date = new Date(placedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const steps = [
    { label: "Order placed", note: date, done: true },
    { label: "Processing", note: stopped ? "Stopped" : date, done: !stopped },
    { label: "Shipped", note: shipped ? carrier ?? "Dispatched" : "—", done: shipped },
    {
      label: "Tracking",
      note: trackingNumber ?? "—",
      done: Boolean(trackingNumber),
    },
  ];

  const headline = stopped
    ? status === "cancelled"
      ? "Order cancelled"
      : "Order refunded"
    : shipped
      ? "On its way"
      : "Order confirmed";

  const sub = stopped
    ? "Contact us if this is unexpected."
    : shipped
      ? "Your order has left our facility."
      : "We are preparing your order.";

  return (
    <>
      <p className="mt-2 font-heading text-2xl font-extrabold text-gold-text">
        {headline}
      </p>
      <p className="mt-1 text-sm text-text-secondary">{sub}</p>

      <ol className="mt-8 grid grid-cols-4 gap-2">
        {steps.map((step, i) => (
          <li key={step.label} className="relative text-center">
            {/* Connector sits behind the markers and stops at the last step. */}
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className={`absolute left-1/2 top-4 h-[2px] w-full ${
                  steps[i + 1].done ? "bg-gold" : "bg-border"
                }`}
              />
            )}
            <span
              className={`relative z-10 mx-auto flex h-8 w-8 items-center justify-center rounded-full border ${
                step.done
                  ? "border-gold bg-gold text-text-on-gold"
                  : "border-border bg-surface text-text-muted"
              }`}
            >
              {step.done ? (
                <Check className="h-4 w-4" strokeWidth={2.5} />
              ) : (
                <span className="text-xs font-bold">{i + 1}</span>
              )}
            </span>
            <p className="mt-2 font-heading text-xs font-bold text-text-primary">
              {step.label}
            </p>
            <p className="mt-0.5 break-words text-[11px] leading-tight text-text-muted">
              {step.note}
            </p>
          </li>
        ))}
      </ol>
    </>
  );
}
