import { NextResponse } from "next/server";
import {
  establishSession,
  signupWithPassword,
} from "@/lib/auth/service";
import { UserServiceError } from "@/lib/api/user-service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      name?: string;
    };

    if (!body.email || !body.password || !body.name) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 },
      );
    }

    // Backend password column is VARCHAR(15)
    if (body.password.length < 1 || body.password.length > 15) {
      return NextResponse.json(
        { error: "Password must be 1–15 characters" },
        { status: 400 },
      );
    }

    const result = await signupWithPassword({
      email: body.email,
      password: body.password,
      name: body.name,
    });
    const user = await establishSession(result);

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signup failed";
    if (message === "EMAIL_TAKEN") {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }
    if (error instanceof UserServiceError) {
      return NextResponse.json(
        { error: error.message || "Signup failed" },
        { status: error.status >= 400 && error.status < 600 ? error.status : 502 },
      );
    }
    return NextResponse.json({ error: "Signup failed" }, { status: 502 });
  }
}
