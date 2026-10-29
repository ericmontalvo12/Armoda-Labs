import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, MapPin, LifeBuoy } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCurrentCustomer } from "@/lib/customer-session";
import { getOrderForEmail } from "@/lib/customers-db";
import { OrderProgress } from "@/app/account/orders/[id]/OrderProgress";

export const metadata: Metadata = {
  title: "Order",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/account/login");

  // An unconfirmed address cannot read orders filed under it, same rule the
  // dashboard applies. Without this, the gate there would be cosmetic.
  if (!customer.emailVerifiedAt) redirect("/account");

  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId) || orderId < 1) notFound();

  const order = await getOrderForEmail(customer.email, orderId);
  if (!order) notFound();

  const items = order.lineItemsDetailed;
  // Only the total is authoritative: Stripe is not asked for a line-level
  // breakdown, so shipping and discounts are not stored separately. Showing
  // an invented subtotal would be worse than showing none.
  const itemsTotal = items.reduce((sum, li) => sum + li.amountTotal, 0);
  const difference = Math.round((order.amountTotal - itemsTotal) * 100) / 100;

  const addressLines = [
    order.shippingName,
    order.addressLine1,
    order.addressLine2,
    [order.city, order.state, order.postalCode].filter(Boolean).join(", "),
    order.country,
  ].filter(Boolean) as string[];

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="page-top bg-background pb-20">
        <div className="mx-auto max-w-[840px] px-4">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-sm font-heading font-bold text-text-secondary transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to your account
          </Link>

          <h1 className="mt-6 font-heading text-3xl font-extrabold text-text-primary">
            Order <span className="text-gold-text">#{order.id}</span>
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Placed{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          <section className="mt-8 rounded-[20px] border border-border bg-surface p-6">
            <p className="text-xs font-heading font-bold uppercase tracking-wider text-text-muted">
              Delivery status
            </p>
            <OrderProgress
              status={order.status}
              placedAt={order.createdAt}
              carrier={order.carrier}
              trackingNumber={order.trackingNumber}
            />
          </section>

          <section className="mt-6 rounded-[20px] border border-border bg-surface p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-heading text-lg font-extrabold text-text-primary">
                Items in this order
              </h2>
              <span className="text-xs text-text-muted">
                {items.length} {items.length === 1 ? "product" : "products"}
              </span>
            </div>

            <ul className="mt-5 divide-y divide-border">
              {items.map((item, i) => (
                <li
                  key={`${item.description}-${i}`}
                  className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="font-heading text-sm font-bold text-text-primary">
                      {item.description}
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                      Quantity {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 font-heading text-sm font-bold text-text-primary">
                    {money(item.amountTotal)}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-6 rounded-[20px] border border-border bg-surface p-6">
            <h2 className="font-heading text-lg font-extrabold text-text-primary">
              Order summary
            </h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-text-secondary">Items</dt>
                <dd className="text-text-primary">{money(itemsTotal)}</dd>
              </div>
              {difference !== 0 && (
                <div className="flex justify-between">
                  <dt className="text-text-secondary">
                    {difference > 0 ? "Shipping and tax" : "Discount"}
                  </dt>
                  <dd className="text-text-primary">
                    {difference > 0 ? "" : "−"}
                    {money(Math.abs(difference))}
                  </dd>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-3">
                <dt className="font-heading font-bold text-text-primary">Total</dt>
                <dd className="font-heading text-lg font-extrabold text-gold-text">
                  {money(order.amountTotal)}
                </dd>
              </div>
            </dl>
          </section>

          {addressLines.length > 0 && (
            <section className="mt-6 rounded-[20px] border border-border bg-surface p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-muted bg-surface-accent">
                  <MapPin className="h-5 w-5 text-gold" strokeWidth={1.4} />
                </span>
                <div>
                  <h2 className="font-heading text-sm font-bold text-text-primary">
                    Shipping address
                  </h2>
                  <address className="mt-1 text-sm not-italic leading-relaxed text-text-secondary">
                    {addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </div>
              </div>
            </section>
          )}

          <section className="mt-6 rounded-[20px] border border-border bg-surface p-6">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-muted bg-surface-accent">
                <LifeBuoy className="h-5 w-5 text-gold" strokeWidth={1.4} />
              </span>
              <div>
                <h2 className="font-heading text-sm font-bold text-text-primary">
                  Need help?
                </h2>
                <p className="mt-1 text-sm text-text-secondary">
                  All sales are final. Where we can verify something went wrong
                  with an order, we resolve it with store credit, and we never
                  ask for the product back.
                </p>
                <Link
                  href="/contact"
                  className="mt-4 inline-flex h-11 items-center rounded-full bg-primary px-6 font-heading text-sm font-bold text-on-primary transition-colors hover:bg-primary-hover"
                >
                  Contact support
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
