import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/customer-session";
import {
  updateCustomerProfile,
  updateCustomerPassword,
  getCustomerWithHash,
} from "@/lib/customers-db";
import { hashPassword, verifyPassword } from "@/lib/customer-auth";

const MIN_PASSWORD_LENGTH = 10;

export async function POST(req: Request) {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) {
      return NextResponse.json({ error: "Sign in first." }, { status: 401 });
    }

    const body = (await req.json()) as Record<string, unknown>;
    const str = (v: unknown, max: number) =>
      typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null;

    await updateCustomerProfile(customer.id, {
      name: str(body.name, 120),
      organization: str(body.organization, 160),
      role: str(body.role, 120),
    });

    // A password change is optional, and only happens when the current one
    // is supplied. Without that check, anyone with a stolen session cookie
    // could lock the real owner out.
    const newPassword = body.newPassword;
    if (typeof newPassword === "string" && newPassword.length > 0) {
      const currentPassword = body.currentPassword;
      if (typeof currentPassword !== "string" || !currentPassword) {
        return NextResponse.json(
          { error: "Enter your current password to change it." },
          { status: 400 }
        );
      }
      if (newPassword.length < MIN_PASSWORD_LENGTH) {
        return NextResponse.json(
          { error: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.` },
          { status: 400 }
        );
      }
      const stored = await getCustomerWithHash(customer.id);
      if (!stored || !(await verifyPassword(currentPassword, stored.passwordHash))) {
        return NextResponse.json(
          { error: "Current password is incorrect." },
          { status: 403 }
        );
      }
      await updateCustomerPassword(customer.id, await hashPassword(newPassword));
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Profile update failed:", err);
    return NextResponse.json({ error: "Could not save that." }, { status: 500 });
  }
}
