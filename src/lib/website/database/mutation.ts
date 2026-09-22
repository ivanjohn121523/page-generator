
import { Kysely } from 'kysely';
import { KyselyDatabase } from '@/src/core/kysely/client';
import { WebsitesInsertSchema } from '../types';
import { WebsiteCreateValidation } from '../validation';

type Client = Kysely<KyselyDatabase>;
const websiteTable = 'websites';

export async function createWebsite(client: Client, parsedInitialOffersData: WebsitesInsertSchema){
  const validatedWebsite = WebsiteCreateValidation.parse(parsedInitialOffersData);
  const result = await client.insertInto(websiteTable)
    .values(validatedWebsite)
    .returning("id")
    .executeTakeFirst();
  return result?.id ?? null;
}
