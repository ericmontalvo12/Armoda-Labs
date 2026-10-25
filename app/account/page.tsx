import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCurrentCustomer } from "@/lib/customer-session";
import {
  getOrdersForEmail,
  getReferralEarnings,
  getReferralForCustomer,
  type ReferralEarnings,
} from "@/lib/customers-db";
import { ReferralPanel } from "@/app/account/ReferralPanel";
import { LogoutButton } from "@/app/account/LogoutButton";

export const metadata: Metadata = {
  title: "Your Account",
  robots: { index: false, follow: false },
};

// Always read fresh: order status and approval state both change behind the
// customer's back, and a cached dashboard showing a stale referral balance
// is worse than a slow one.
export const dynamic = "force-dynamic";

const money = (amount: number, currency: string) =>
  `${currency.toUpperCase() === "USD" ? "$" : ""}${amount.toFixed(2)}`;

export default async function AccountPage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/account/login");

  const [orders, referral] = await Promise.all([
    getOrdersForEmail(customer.email),
    getReferralForCustomer(customer.id),
  ]);

  let earnings: ReferralEarnings | null = null;
  if (referral?.status === "approved" && referral.code) {
    earnings = await getReferralEarnings(referral.code, referral.rateBps);
  }

  const approved = customer.status === "approved";

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="page-top pb-20">
        <div className="mx-auto max-w-[1100px] px-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl font-extrabold text-text-primary">
                {customer.name || "Your account"}
              </h1>
              <p className="mt-2 text-sm text-text-secondary">{customer.email}</p>
            </div>
            <LogoutButton />
          </div>

          {!approved && (
            <div className="mt-8 rounded-[20px] border border-gold-muted bg-surface-elevated p-6">
              <h2 className="font-heading text-sm font-extrabold text-text-primary">
                Account under review
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                You can order and track orders now. Approval unlocks the
                referral program and usually takes two business days.
              </p>
            </div>
          )}

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <section>
              <h2 className="font-heading text-lg font-extrabold text-text-primary">
                Your orders
              </h2>

              {orders.length === 0 ? (
                <div className="mt-5 rounded-[20px] border border-border bg-surface p-10 text-center">
                  <p className="text-sm text-text-secondary">
                    No orders yet.
                  </p>
                  <Link
                    href="/products"
                    className="mt-5 inline-flex h-11 items-center rounded-full border border-border px-6 font-heading text-sm font-bold text-text-primary transition-colors hover:border-gold hover:text-gold"
                  >
                    Browse the catalog
                  </Link>
                </div>
              ) : (
                <ul className="mt-5 space-y-3">
                  {orders.map((order) => (
                    <li
                      key={order.id}
                      className="rounded-[20px] border border-border bg-surface p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-heading text-sm font-extrabold text-text-primary">
                            Order #{order.id}
                          </p>
                          <p className="mt-1 text-xs text-text-muted">
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-heading text-sm font-extrabold text-text-primary">
                            {money(order.amountTotal, order.currency)}
                          </p>
                          <p className="mt-1 text-xs capitalize text-gold">
                            {order.status}
                          </p>
                        </div>
                      </div>

                      {order.lineItems.length > 0 && (
                        <ul className="mt-3 space-y-1 border-t border-border pt-3">
                          {order.lineItems.map((item, i) => (
                            <li key={i} className="text-xs text-text-secondary">
                              {item.quantity} × {item.description}
                            </li>
                          ))}
                        </ul>
                      )}

                      {order.trackingNumber && (
                        <p className="mt-3 text-xs text-text-secondary">
                          {order.carrier ? `${order.carrier}: ` : "Tracking: "}
                          <span className="text-text-primary">
                            {order.trackingNumber}
                          </span>
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <aside>
              <ReferralPanel
                approved={approved}
                referral={referral}
                earnings={earnings}
              />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
