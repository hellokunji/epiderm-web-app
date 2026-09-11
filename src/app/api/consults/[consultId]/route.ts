import { NextResponse } from "next/server";
import { loadConsult } from "@/lib/consult/clinic";

type RouteContext = { params: Promise<{ consultId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { consultId } = await context.params;
  if (!consultId) {
    return NextResponse.json({ error: "Missing consult id" }, { status: 400 });
  }

  try {
    const consult = await loadConsult(consultId);
    return NextResponse.json(consult);
  } catch (error) {
    const status =
      error && typeof error === "object" && "status" in error
        ? Number((error as { status: number }).status)
        : 502;
    if (status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Consult not found" },
      { status: status >= 400 ? status : 404 },
    );
  }
}
