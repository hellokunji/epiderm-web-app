import { NextResponse } from "next/server";
import {
  establishSession,
  loginWithPassword,
} from "@/lib/auth/service";
import { UserServiceError } from "@/lib/api/user-service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const result = await loginWithPassword({
      email: body.email,
      password: body.password,
    });
    const user = await establishSession(result);

    return NextResponse.json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    if (message === "INVALID_CREDENTIALS") {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }
    if (error instanceof UserServiceError) {
      return NextResponse.json(
        { error: error.message || "Login failed" },
        { status: error.status >= 400 && error.status < 600 ? error.status : 502 },
      );
    }
    return NextResponse.json({ error: "Login failed" }, { status: 502 });
  }
}
