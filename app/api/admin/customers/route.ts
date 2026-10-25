import { NextRequest, NextResponse } from "next/server";
import {
  listCustomers,
  setCustomerStatus,
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
    const status = body?.status as CustomerStatus;

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid customer id." }, { status: 400 });
    }
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
