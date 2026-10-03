import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "htad"."projects_locales" ADD COLUMN "partner" varchar;
  ALTER TABLE "htad"."projects_locales" ADD COLUMN "role" varchar;
  ALTER TABLE "htad"."site_settings_locales" ADD COLUMN "contact_page_heading" varchar;
  ALTER TABLE "htad"."site_settings_locales" ADD COLUMN "contact_page_lead" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "htad"."projects_locales" DROP COLUMN "partner";
  ALTER TABLE "htad"."projects_locales" DROP COLUMN "role";
  ALTER TABLE "htad"."site_settings_locales" DROP COLUMN "contact_page_heading";
  ALTER TABLE "htad"."site_settings_locales" DROP COLUMN "contact_page_lead";`)
}
