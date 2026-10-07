import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Site settings `companyName` becomes localized (EN/VI). Expand step only: the new per-locale
// column is filled with the current name for every locale, and the old `site_settings.company_name`
// stays for the code still deployed. It is dropped in a later migration, once this code is live.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "htad"."site_settings_locales" ADD COLUMN "company_name" varchar;
  UPDATE "htad"."site_settings_locales" l SET "company_name" = s."company_name"
    FROM "htad"."site_settings" s WHERE l."_parent_id" = s."id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "htad"."site_settings_locales" DROP COLUMN "company_name";`)
}
