import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import type { Database } from '@/src/core/database-schema/database.types';
import type { KyselifyDatabase } from 'kysely-supabase'

export type KyselyDatabase = KyselifyDatabase<Database>

export function getKyselyClient() {
  return new Kysely<KyselyDatabase>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.DATABASE_URL
      }),
    }),
  })
}

export type KyselyClient = Kysely<KyselyDatabase>;