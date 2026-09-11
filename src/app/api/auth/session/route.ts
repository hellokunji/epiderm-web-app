import { NextResponse } from "next/server";
import { establishSession } from "@/lib/auth/service";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
} from "@/lib/auth/constants";
import type { AuthUser } from "@/lib/auth/types";

/**
 * Accepts tokens already obtained from user-service (browser → :8001)
 * and stores them in httpOnly cookies for the Next.js app.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      access_token?: string;
      refresh_token?: string;
      user?: AuthUser;
    };

    if (!body.access_token || !body.refresh_token || !body.user) {
      return NextResponse.json(
        { error: "access_token, refresh_token, and user are required" },
        { status: 400 },
      );
    }

    if (
      typeof body.user.id !== "string" ||
      typeof body.user.email !== "string" ||
      typeof body.user.name !== "string"
    ) {
      return NextResponse.json({ error: "Invalid user payload" }, { status: 400 });
    }

    const user = await establishSession({
      user: body.user,
      tokens: {
        accessToken: body.access_token,
        refreshToken: body.refresh_token,
        accessExpiresIn: ACCESS_TOKEN_TTL_SECONDS,
        refreshExpiresIn: REFRESH_TOKEN_TTL_SECONDS,
      },
    });

    return NextResponse.json({
      user,
      access_token: body.access_token,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to establish session" },
      { status: 500 },
    );
  }
}
