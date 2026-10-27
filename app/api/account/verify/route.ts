import { NextRequest, NextResponse } from "next/server";
import { readVerificationToken } from "@/lib/customer-auth";
import { getCustomerById, setEmailVerified } from "@/lib/customers-db";
import { sendVerificationEmail } from "@/lib/send-verification";
import { getCurrentCustomer } from "@/lib/customer-session";

/**
 * GET is the link in the email. It redirects rather than returning JSON,
 * because a person clicked it in a mail client.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const home = new URL("/account", req.nextUrl.origin);

  try {
    const id = await readVerificationToken(token, async (customerId) => {
      const customer = await getCustomerById(customerId);
      return customer?.email ?? null;
    });

    if (id === null) {
      home.searchParams.set("verify", "invalid");
      return NextResponse.redirect(home);
    }

    await setEmailVerified(id, true);
    home.searchParams.set("verify", "ok");
    return NextResponse.redirect(home);
  } catch (err) {
    console.error("Email verification failed:", err);
    home.searchParams.set("verify", "error");
    return NextResponse.redirect(home);
  }
}

/** POST resends the link to the signed-in customer's own address. */
export async function POST(req: NextRequest) {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) {
      return NextResponse.json({ error: "Sign in first." }, { status: 401 });
    }
    if (customer.emailVerifiedAt) {
      return NextResponse.json({ ok: true, alreadyVerified: true });
    }

    // The address is read from the session's account, never from the body,
    // so this cannot be used to mail a link for somebody else's account.
    const { sent } = await sendVerificationEmail({
      customerId: customer.id,
      email: customer.email,
      name: customer.name,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin,
    });

    return NextResponse.json({ ok: true, sent });
  } catch (err) {
    console.error("Could not resend verification:", err);
    return NextResponse.json(
      { error: "Could not send that right now." },
      { status: 500 }
    );
  }
}
