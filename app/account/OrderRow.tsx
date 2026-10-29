import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { CustomerOrder } from "@/lib/customers-db";

const STATUS_STYLES: Record<string, string> = {
  unfulfilled: "border-gold-muted text-gold-text",
  fulfilled: "border-[#2f6b4a] text-success",
  refunded: "border-border text-text-muted",
  cancelled: "border-border text-text-muted",
};

const STATUS_LABELS: Record<string, string> = {
  unfulfilled: "Processing",
  fulfilled: "Completed",
  refunded: "Refunded",
  cancelled: "Cancelled",
};

export function OrderRow({ order }: { order: CustomerOrder }) {
  const items = order.lineItems ?? [];
  const extra = items.length > 1 ? items.length - 1 : 0;

  return (
    <li>
      <Link
        href={`/account/orders/${order.id}`}
        className="group block rounded-[18px] border border-border bg-surface p-5 transition-colors hover:border-gold"
      >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-heading font-bold ${
            STATUS_STYLES[order.status] ?? STATUS_STYLES.unfulfilled
          }`}
        >
          {STATUS_LABELS[order.status] ?? order.status}
        </span>
        <span className="text-xs text-text-muted">
          {new Date(order.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-heading text-sm font-bold text-gold-text">
            Order #{order.id}
          </p>
          <p className="mt-1 truncate text-sm text-text-secondary">
            {items[0]?.description ?? "Order"}
            {extra > 0 && (
              <span className="text-text-muted"> and {extra} more</span>
            )}
          </p>
          {order.trackingNumber && (
            <p className="mt-1 text-xs text-text-muted">
              {order.carrier ?? "Tracking"}: {order.trackingNumber}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <p className="font-heading text-lg font-extrabold text-text-primary">
            ${order.amountTotal.toFixed(2)}
          </p>
          <ChevronRight className="h-4 w-4 text-text-muted transition-colors group-hover:text-gold" />
        </div>
      </div>
      </Link>
    </li>
  );
}
