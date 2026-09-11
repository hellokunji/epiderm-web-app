import { NextResponse } from "next/server";
import { submitConsult } from "@/lib/consult/clinic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const { consult, status } = await submitConsult(formData);
    console.log("consult", consult);
    return NextResponse.json(consult, { status });
  } catch (error) {
    const status =
      error && typeof error === "object" && "status" in error
        ? Number((error as { status: number }).status)
        : 502;
    if (status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Submit failed";
    return NextResponse.json(
      { error: message },
      { status: status >= 400 ? status : 502 },
    );
  }
}
