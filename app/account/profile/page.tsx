import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCurrentCustomer } from "@/lib/customer-session";
import { ProfileForm } from "@/app/account/profile/ProfileForm";

export const metadata: Metadata = {
  title: "Edit Profile",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/account/login");

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="page-top bg-background pb-20">
        <div className="mx-auto max-w-[720px] px-4">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-sm font-heading font-bold text-text-secondary transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to your account
          </Link>

          <h1 className="mt-6 font-heading text-3xl font-extrabold text-text-primary">
            Edit profile
          </h1>

          <ProfileForm
            email={customer.email}
            name={customer.name ?? ""}
            organization={customer.organization ?? ""}
            role={customer.role ?? ""}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
