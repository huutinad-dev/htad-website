import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Contract step for 20261006_080145_add_partners, written by hand (there is no schema change
// for Payload to generate: its schema already lacks both). Run only once the code that reads
// partners was live: it removes what the previous deployment still needed.
// - the old `partnerLogos` selections, each of which now exists as a partner selection;
// - "htad"."media"."link", which moved to "htad"."partners"."link".
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DELETE FROM "htad"."home_page_rels" WHERE "path" = 'partnerLogos';
  DELETE FROM "htad"."services_rels" WHERE "path" = 'partnerLogos';
  ALTER TABLE "htad"."media" DROP COLUMN IF EXISTS "link";`)
}

// Restores the column only; the deleted selections are equivalent to the partner selections.
export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "htad"."media" ADD COLUMN IF NOT EXISTS "link" varchar;`)
}
