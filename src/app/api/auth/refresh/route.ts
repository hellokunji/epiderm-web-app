import { NextResponse } from "next/server";
import { destroySession, establishSession, refreshSession } from "@/lib/auth/service";

export async function POST() {
  const result = await refreshSession();
  if (!result) {
    await destroySession();
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }

  const user = await establishSession(result);
  return NextResponse.json({
    user,
    access_token: result.tokens.accessToken,
    accessExpiresIn: result.tokens.accessExpiresIn,
  });
}
