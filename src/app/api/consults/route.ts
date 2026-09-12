import { NextResponse } from "next/server";
import { submitConsult } from "@/lib/consult/clinic";
import type { ConsultSubmitPayload } from "@/lib/consult/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as ConsultSubmitPayload | null;
    if (!body || typeof body !== "object" || !body.category) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const { status, payload } = await submitConsult(body);
    return NextResponse.json(payload, { status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Submit failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
