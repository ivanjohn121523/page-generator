import "server-only";
import { Kysely, PostgresDialect, type Generated } from "kysely";
import { Pool } from "pg";
import { getDatabaseUrl } from "@/src/lib/env.server";

export type ProfilesTable = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
};

export type Database = {
  profiles: ProfilesTable;
};

const globalForDb = globalThis as typeof globalThis & {
  pgPool?: Pool;
  kysely?: Kysely<Database>;
};

function getPool() {
  if (!globalForDb.pgPool) {
    globalForDb.pgPool = new Pool({
      connectionString: getDatabaseUrl(),
      max: 5,
    });
  }
  return globalForDb.pgPool;
}

export function getDb() {
  if (!globalForDb.kysely) {
    globalForDb.kysely = new Kysely<Database>({
      dialect: new PostgresDialect({ pool: getPool() }),
    });
  }
  return globalForDb.kysely;
}
