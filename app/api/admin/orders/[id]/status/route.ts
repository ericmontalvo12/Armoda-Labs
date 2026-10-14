import { NextRequest, NextResponse } from "next/server";
import { setOrderStatus, type OrderStatus } from "@/lib/orders-db";

const ALLOWED: OrderStatus[] = ["unfulfilled", "fulfilled", "refunded", "cancelled"];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: "Invalid order id." }, { status: 400 });
    }

    const { status } = (await req.json()) as { status?: string };
    if (!status || !ALLOWED.includes(status as OrderStatus)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const order = await setOrderStatus(id, status as OrderStatus);
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (err) {
    console.error("Failed to update status:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
