import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/customer-auth";
import { createCustomer, getCustomerByEmail } from "@/lib/customers-db";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 10;

export async function POST(req: Request) {
  try {
    const {
      email, password, name, organization, role, certified,
      researchUse, expectedVolume,
    } =
      (await req.json()) as Record<string, unknown>;

    if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` },
        { status: 400 }
      );
    }
    // The eligibility certification is a condition of holding an account,
    // so it is enforced here and not only in the form.
    if (certified !== true) {
      return NextResponse.json(
        { error: "The eligibility certification is required." },
        { status: 400 }
      );
    }

    const customer = await createCustomer({
      email: email.trim(),
      passwordHash: await hashPassword(password),
      name: typeof name === "string" ? name.trim() : undefined,
      organization: typeof organization === "string" ? organization.trim() : undefined,
      role: typeof role === "string" ? role.trim() : undefined,
      // Free text, and the main thing an approval is judged on. Capped so a
      // paste of an entire protocol cannot bloat the row.
      researchUse:
        typeof researchUse === "string" ? researchUse.trim().slice(0, 2000) : undefined,
      expectedVolume:
        typeof expectedVolume === "string" ? expectedVolume.trim().slice(0, 200) : undefined,
    });

    // An address already registered returns the same shape as a new one.
    // Saying "that email is taken" would let anyone test which addresses
    // hold accounts here, which in this category is worth protecting.
    if (!customer) {
      const existing = await getCustomerByEmail(email.trim());
      if (existing) return NextResponse.json({ ok: true });
      return NextResponse.json({ error: "Could not create the account." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("Account registration failed:", err);
    return NextResponse.json({ error: "Could not create the account." }, { status: 500 });
  }
}
