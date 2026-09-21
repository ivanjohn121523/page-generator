import "server-only";
import { requireUser } from "@/src/lib/auth/require-user";
import { getDb } from "@/src/lib/db/kysely";

export async function getCurrentProfile() {
  const user = await requireUser();
  const db = getDb();

  return db
    .selectFrom("profiles")
    .selectAll()
    .where("id", "=", user.id)
    .executeTakeFirst();
}

export async function updateCurrentProfile(input: { fullName: string }) {
  const user = await requireUser();
  const db = getDb();

  return db
    .updateTable("profiles")
    .set({
      full_name: input.fullName.trim() || null,
    })
    .where("id", "=", user.id)
    .returningAll()
    .executeTakeFirst();
}
