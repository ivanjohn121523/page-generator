import { Kysely } from "kysely";
import type { Json } from "@/src/core/database-schema/database.types";
import { KyselyDatabase } from "@/src/core/kysely/client";
import type { WebsiteListItem } from "../types";

type Client = Kysely<KyselyDatabase>;

const DEFAULT_PRIMARY_COLOR = "#4f46e5";

function primaryColorFromTheme(theme: Json): string {
  let value: unknown = theme;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      return DEFAULT_PRIMARY_COLOR;
    }
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return DEFAULT_PRIMARY_COLOR;
  }

  const record = value as Record<string, unknown>;
  if (typeof record.primary === "string") {
    return record.primary;
  }

  const colors = record.colors;
  if (colors && typeof colors === "object" && !Array.isArray(colors)) {
    const primary = (colors as Record<string, unknown>).primary;
    if (typeof primary === "string") {
      return primary;
    }
  }

  return DEFAULT_PRIMARY_COLOR;
}

export async function listWebsitesForOwner(
  client: Client,
  ownerId: string,
): Promise<WebsiteListItem[]> {
  const rows = await client
    .selectFrom("websites")
    .leftJoin("pages", "pages.website_id", "websites.id")
    .select([
      "websites.id",
      "websites.name",
      "websites.slug",
      "websites.tagline",
      "websites.theme",
      "websites.created_at",
    ])
    .select((eb) => eb.fn.count("pages.id").as("page_count"))
    .where("websites.owner_id", "=", ownerId)
    .groupBy([
      "websites.id",
      "websites.name",
      "websites.slug",
      "websites.tagline",
      "websites.theme",
      "websites.created_at",
    ])
    .orderBy("websites.created_at", "desc")
    .execute();

  return rows.map((row) => ({
    id: row.id,
    name: row.name ?? "Untitled site",
    slug: row.slug ?? "",
    tagline: row.tagline,
    primaryColor: primaryColorFromTheme(row.theme),
    pageCount: Number(row.page_count ?? 0),
  }));
}
