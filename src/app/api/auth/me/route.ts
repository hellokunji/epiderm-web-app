import { NextResponse } from "next/server";
import {
  readAccessToken,
  readAuthUser,
  readRefreshToken,
} from "@/lib/auth/cookies";
import {
  destroySession,
  establishSession,
  refreshSession,
} from "@/lib/auth/service";

export async function GET() {
  const user = await readAuthUser();
  const access = await readAccessToken();
  const refresh = await readRefreshToken();

  if (user && access) {
    return NextResponse.json({ user, access_token: access });
  }

  if (user && refresh) {
    // Access cookie missing/expired — rotate via refresh token
    const result = await refreshSession();
    if (!result) {
      await destroySession();
      return NextResponse.json({ user: null }, { status: 401 });
    }
    const nextUser = await establishSession(result);
    return NextResponse.json({
      user: nextUser,
      access_token: result.tokens.accessToken,
    });
  }

  if (!refresh) {
    await destroySession();
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const result = await refreshSession();
  if (!result) {
    await destroySession();
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const nextUser = await establishSession(result);
  return NextResponse.json({
    user: nextUser,
    access_token: result.tokens.accessToken,
  });
}
