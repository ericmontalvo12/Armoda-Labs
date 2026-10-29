import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCurrentCustomer } from "@/lib/customer-session";
import { LoginForm } from "@/app/account/login/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AccountLoginPage() {
  // Showing a sign-in form to somebody already signed in reads as having
  // been logged out, which is how this looked before.
  const customer = await getCurrentCustomer();
  if (customer) redirect("/account");

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="page-top pb-20">
        <div className="mx-auto max-w-md px-4">
          <LoginForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
