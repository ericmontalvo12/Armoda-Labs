import { NextRequest, NextResponse } from "next/server";
import { getOrderStats, listOrders, type OrderStatus } from "@/lib/orders-db";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const [{ orders, total }, stats] = await Promise.all([
      listOrders({
        search: sp.get("search") ?? undefined,
        status: (sp.get("status") as OrderStatus | "all" | null) ?? "all",
        limit: Number(sp.get("limit") ?? 50),
        offset: Number(sp.get("offset") ?? 0),
      }),
      getOrderStats(),
    ]);
    return NextResponse.json({ orders, total, stats });
  } catch (err) {
    console.error("Failed to list orders:", err);
    return NextResponse.json({ error: "Failed to load orders." }, { status: 500 });
  }
}
