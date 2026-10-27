import { NextRequest, NextResponse } from "next/server";
import {
  listCustomers,
  setCustomerStatus,
  setEmailVerified,
  type CustomerStatus,
} from "@/lib/customers-db";

// Auth is handled centrally by middleware.ts, which matches /api/admin/:path*.

const STATUSES: CustomerStatus[] = ["pending", "approved", "rejected"];

export async function GET() {
  try {
    const customers = await listCustomers();
    return NextResponse.json({ customers });
  } catch (err) {
    console.error("Failed to list customers:", err);
    return NextResponse.json(
      { error: "Failed to load customers." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const id = Number(body?.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid customer id." }, { status: 400 });
    }

    // Verification is a separate decision from approval: approving an
    // applicant says their research use is plausible, confirming the address
    // says it is theirs. Conflating them is how one approval click hands over
    // somebody else's order history.
    if (typeof body?.emailVerified === "boolean") {
      await setEmailVerified(id, body.emailVerified);
      return NextResponse.json({ ok: true });
    }

    const status = body?.status as CustomerStatus;
    if (!STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    await setCustomerStatus(id, status);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to update customer:", err);
    return NextResponse.json(
      { error: "Failed to update customer." },
      { status: 500 }
    );
  }
}
