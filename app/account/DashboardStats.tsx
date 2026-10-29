import { Package, DollarSign, Boxes, Wallet } from "lucide-react";

/**
 * The four figures across the top of the dashboard.
 *
 * The reference's fourth tile is "Reward Points". Armoda has no points
 * scheme, and inventing one would promise something the business does not
 * offer. Store credit is the real equivalent: the only compensation the
 * claims policy allows.
 */
export function DashboardStats({
  orderCount,
  totalSpentCents,
  itemsOrdered,
  creditCents,
}: {
  orderCount: number;
  totalSpentCents: number;
  itemsOrdered: number;
  creditCents: number;
}) {
  const money = (cents: number) =>
    (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

  const tiles = [
    { icon: Package, value: String(orderCount), label: "Total orders" },
    { icon: DollarSign, value: money(totalSpentCents), label: "Total spent" },
    { icon: Boxes, value: String(itemsOrdered), label: "Items ordered" },
    {
      icon: Wallet,
      // An em dash reads as "nothing here", which is right for a zero balance
      // and avoids a $0.00 that invites "how do I get some?".
      value: creditCents > 0 ? money(creditCents) : "—",
      label: "Store credit",
    },
  ];

  return (
    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {tiles.map(({ icon: Icon, value, label }) => (
        <div key={label} className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-gold-muted bg-surface-accent">
            <Icon className="h-5 w-5 text-gold" strokeWidth={1.4} />
          </span>
          <p className="mt-3 font-heading text-xl font-extrabold text-text-primary">
            {value}
          </p>
          <p className="mt-0.5 text-xs text-text-secondary">{label}</p>
        </div>
      ))}
    </div>
  );
}
