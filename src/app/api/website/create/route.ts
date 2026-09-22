import { getKyselyClient } from "@/src/core/kysely/client";
import {
  requireApiUser,
  UnauthorizedError,
  unauthorizedResponse,
} from "@/src/lib/auth/require-api-user";
import { createWebsite } from "@/src/lib/website/database/mutation";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const user = await requireApiUser();
    const client = getKyselyClient();
    const data = await request.json();
    const newWebsite = {
      owner_id: user.id,
      name: data.name,
      slug: data.slug,
      tagline: data.tagline,
      theme: data.theme,
      metadata: data.metadata,
    };
    const newSite = await createWebsite(client, newWebsite);
    return NextResponse.json({ site: newSite });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return unauthorizedResponse(error.message);
    }
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: `Validation error for create website: ${error.message}` },
        { status: 400 },
      );
    }
    console.log(error)
    return NextResponse.json(
      { error: "Failed to create website.", detail: JSON.stringify(error)},
      { status: 500 },
    );
  }
}