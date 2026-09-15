import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/server";

export async function proxyUserUpload(
  request: Request,
  backendPath: string,
  missingMessage: string,
) {
  const incoming = await request.formData().catch(() => null);
  const file = incoming?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: missingMessage }, { status: 400 });
  }

  const form = new FormData();
  form.append("file", file, file.name);

  try {
    const res = await backendFetch("user", backendPath, {
      method: "POST",
      body: form,
    });
    const payload = await res.json().catch(() => null);
    if (res.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(payload, { status: res.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
