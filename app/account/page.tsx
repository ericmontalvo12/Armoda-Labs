import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UserCog, Gift, Users, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCurrentCustomer } from "@/lib/customer-session";
import {
  getOrdersForEmail,
  getReferralEarnings,
  getReferralForCustomer,
  type ReferralEarnings,
} from "@/lib/customers-db";
import { getCreditBalanceCents, listCreditEntries } from "@/lib/store-credit-db";
import { LISTED_PRODUCTS, formatPrice } from "@/lib/catalog";
import { ResendVerification } from "@/app/account/ResendVerification";
import { ReferralPanel } from "@/app/account/ReferralPanel";
import { LogoutButton } from "@/app/account/LogoutButton";
import { DashboardStats } from "@/app/account/DashboardStats";
import { OrderRow } from "@/app/account/OrderRow";

export const metadata: Metadata = {
  title: "Your Account",
  robots: { index: false, follow: false },
};

// Always read fresh: order status, approval state and credit all change
// behind the customer's back, and a cached dashboard is worse than a slow one.
export const dynamic = "force-dynamic";

const CREDIT_LABELS: Record<string, string> = {
  damaged_in_transit: "Damaged in transit",
  not_delivered: "Not delivered",
  wrong_item: "Wrong item",
  shipping_error: "Shipping error",
  goodwill: "Goodwill",
  correction: "Correction",
  redeemed: "Redeemed",
};

export default async function AccountPage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/account/login");

  // Orders and store credit are filed under an email address, and nobody
  // proves they own the address they typed at registration. Until that is
  // confirmed this account does not get to see what is filed under it.
  const verified = customer.emailVerifiedAt != null;
  const canEmail = Boolean(process.env.GHL_VERIFY_WEBHOOK_URL);

  const [orders, referral, creditCents, creditEntries] = await Promise.all([
    verified ? getOrdersForEmail(customer.email) : Promise.resolve([]),
    getReferralForCustomer(customer.id),
    verified ? getCreditBalanceCents(customer.email) : Promise.resolve(0),
    verified ? listCreditEntries(customer.email) : Promise.resolve([]),
  ]);

  let earnings: ReferralEarnings | null = null;
  if (referral?.status === "approved" && referral.code) {
    earnings = await getReferralEarnings(referral.code, referral.rateBps);
  }

  // Totals are derived from the orders already loaded rather than queried
  // again, so the tiles and the list below can never disagree. Refunded and
  // cancelled orders are excluded from money spent for the same reason the
  // referral commission excludes them: they did not stick.
  const counted = orders.filter(
    (o) => o.status !== "refunded" && o.status !== "cancelled"
  );
  const totalSpentCents = Math.round(
    counted.reduce((sum, o) => sum + o.amountTotal, 0) * 100
  );
  const itemsOrdered = counted.reduce(
    (sum, o) => sum + o.lineItems.reduce((n, li) => n + (li.quantity || 0), 0),
    0
  );

  const memberSince = new Date(customer.createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const picks = LISTED_PRODUCTS.slice(0, 4);
  const firstName = customer.name?.split(" ")[0] ?? "there";

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="page-top bg-background pb-20">
        <div className="mx-auto max-w-[1280px] px-4">
          {/* Welcome panel */}
          <section className="relative overflow-hidden rounded-[24px] border border-border bg-surface px-6 py-10 sm:px-10">
            <span className="absolute left-10 top-0 h-[3px] w-28 bg-gold" />
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm text-text-secondary">Welcome back,</p>
                <h1 className="mt-1 font-heading text-4xl font-extrabold text-text-primary">
                  {firstName}
                </h1>
                <p className="mt-3 inline-flex items-center rounded-full border border-gold-muted px-4 py-1.5 text-xs font-heading font-bold uppercase tracking-wider text-gold-text">
                  Member since {memberSince}
                </p>
              </div>
              <LogoutButton />
            </div>

            <DashboardStats
              orderCount={counted.length}
              totalSpentCents={totalSpentCents}
              itemsOrdered={itemsOrdered}
              creditCents={creditCents}
            />
          </section>

          {!verified && (
            <section className="mt-6 rounded-[20px] border border-gold-muted bg-surface p-6">
              <p className="text-xs font-heading font-bold uppercase tracking-wider text-gold-text">
                Email not yet confirmed
              </p>
              <p className="mt-2 text-sm text-text-secondary">
                {canEmail ? (
                  <>
                    We sent a confirmation link to {customer.email}. Your orders
                    and any store credit stay hidden until you open it, because
                    both are filed under that address.
                  </>
                ) : (
                  <>
                    We confirm every address by hand before linking it to order
                    history or store credit. Contact us and we will confirm{" "}
                    {customer.email}. Nothing is lost in the meantime.
                  </>
                )}
              </p>
              {canEmail && <ResendVerification />}
            </section>
          )}

          {/* Quick links. Only destinations that exist: the reference's
              "Edit Address" has no equivalent here, because addresses arrive
              from the payment processor per order and are not stored to edit. */}
          <section className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link
              href="/account/profile"
              className="group flex items-center gap-4 rounded-[18px] border border-border bg-surface p-5 transition-colors hover:border-gold"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-muted bg-surface-accent">
                <UserCog className="h-5 w-5 text-gold" strokeWidth={1.4} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-heading text-sm font-bold text-text-primary">
                  Edit profile
                </span>
                <span className="block text-xs text-text-secondary">
                  Name, organization and password
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-text-muted transition-colors group-hover:text-gold" />
            </Link>

            <Link
              href="/lab-results"
              className="group flex items-center gap-4 rounded-[18px] border border-border bg-surface p-5 transition-colors hover:border-gold"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-muted bg-surface-accent">
                <Gift className="h-5 w-5 text-gold" strokeWidth={1.4} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-heading text-sm font-bold text-text-primary">
                  Certificates of analysis
                </span>
                <span className="block text-xs text-text-secondary">
                  Look up a lot number
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-text-muted transition-colors group-hover:text-gold" />
            </Link>
          </section>

          {/* Recent orders */}
          <section className="mt-10">
            <div className="flex items-baseline justify-between">
              <h2 className="font-heading text-xl font-extrabold text-text-primary">
                Recent orders
              </h2>
              {orders.length > 4 && (
                <span className="text-xs text-text-muted">
                  Showing 4 of {orders.length}
                </span>
              )}
            </div>

            {!verified ? (
              <div className="mt-5 rounded-[20px] border border-border bg-surface p-10 text-center">
                <p className="text-sm text-text-secondary">
                  Hidden until your address is confirmed. This does not mean you
                  have no orders.
                </p>
              </div>
            ) : orders.length === 0 ? (
              <div className="mt-5 rounded-[20px] border border-border bg-surface p-10 text-center">
                <p className="text-sm text-text-secondary">No orders yet.</p>
                <Link
                  href="/products"
                  className="mt-5 inline-flex h-11 items-center rounded-full border border-border px-6 font-heading text-sm font-bold text-text-primary transition-colors hover:border-gold hover:text-gold"
                >
                  Browse the catalog
                </Link>
              </div>
            ) : (
              <ul className="mt-5 space-y-4">
                {orders.slice(0, 4).map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </ul>
            )}
          </section>

          {/* Store credit and the referral program */}
          <section className="mt-10 grid gap-5 lg:grid-cols-2">
            <div className="rounded-[20px] border border-gold-muted bg-surface-elevated p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-muted bg-surface-accent">
                <Gift className="h-5 w-5 text-gold" strokeWidth={1.4} />
              </span>
              <h3 className="mt-4 font-heading text-lg font-extrabold text-text-primary">
                Store credit
              </h3>
              {creditCents > 0 ? (
                <>
                  <p className="mt-2 font-heading text-3xl font-extrabold text-text-primary">
                    {(creditCents / 100).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </p>
                  <ul className="mt-4 space-y-2 border-t border-border pt-4">
                    {creditEntries.slice(0, 4).map((entry) => (
                      <li
                        key={entry.id}
                        className="flex items-baseline justify-between gap-4 text-sm"
                      >
                        <span className="text-text-secondary">
                          {entry.note ??
                            CREDIT_LABELS[entry.reason] ??
                            "Adjustment"}
                          <span className="ml-2 text-xs text-text-muted">
                            {new Date(entry.createdAt).toLocaleDateString("en-US")}
                          </span>
                        </span>
                        <span className="shrink-0 font-heading font-bold text-text-primary">
                          {entry.amountCents > 0 ? "+" : ""}
                          {(entry.amountCents / 100).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="mt-2 text-sm text-text-secondary">
                  Store credit is how we resolve a verified problem with an
                  order. It does not expire and is not exchangeable for cash.
                </p>
              )}
            </div>

            <div className="rounded-[20px] border border-border bg-surface p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-muted bg-surface-accent">
                <Users className="h-5 w-5 text-gold" strokeWidth={1.4} />
              </span>
              <h3 className="mt-4 font-heading text-lg font-extrabold text-text-primary">
                Referral program
              </h3>
              <div className="mt-3">
                <ReferralPanel
                  approved={customer.status === "approved"}
                  referral={referral}
                  earnings={earnings}
                />
              </div>
            </div>
          </section>

          {/* Catalog shortcut */}
          <section className="mt-12">
            <div className="flex items-baseline justify-between">
              <h2 className="font-heading text-xl font-extrabold text-text-primary">
                From the catalog
              </h2>
              <Link
                href="/products"
                className="text-sm font-heading font-bold text-gold-text hover:underline"
              >
                Shop all
              </Link>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {picks.map((product) => (
                <Link
                  key={product.slug}
                  href={`/products/${product.slug}`}
                  className="group rounded-[18px] border border-border bg-surface p-5 transition-colors hover:border-gold"
                >
                  <p className="font-heading text-sm font-bold text-text-primary">
                    {product.name}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">
                    {product.spec}
                  </p>
                  <p className="mt-3 font-heading text-sm font-bold text-gold-text">
                    {product.priceCents > 0
                      ? formatPrice(product.priceCents)
                      : "Price on request"}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
