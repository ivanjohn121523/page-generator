import { getKyselyClient } from "@/src/core/kysely/client";
import {
  requireApiUser,
  UnauthorizedError,
  unauthorizedResponse,
} from "@/src/lib/auth/require-api-user";
import { listWebsitesForOwner } from "@/src/lib/website/database/queries";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await requireApiUser();
    const sites = await listWebsitesForOwner(getKyselyClient(), user.id);
    return NextResponse.json({ sites });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return unauthorizedResponse(error.message);
    }
    return NextResponse.json(
      { error: "Failed to list websites." },
      { status: 500 },
    );
  }
}
