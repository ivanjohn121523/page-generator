import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/src/core/supabase/server";
import { isSupabaseConfigured } from "@/src/lib/env";

export class UnauthorizedError extends Error {
  constructor(message = "Sign in to access this API.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export function unauthorizedResponse(message = "Sign in to access this API.") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export async function requireApiUser(): Promise<User> {
  if (!isSupabaseConfigured()) {
    throw new UnauthorizedError();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  return user;
}
