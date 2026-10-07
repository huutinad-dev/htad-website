import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Contract step of 20261007_051210: the company name now lives per locale in
// site_settings_locales, and the deployed code no longer reads the old column.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "htad"."site_settings" DROP COLUMN "company_name";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "htad"."site_settings" ADD COLUMN "company_name" varchar;
  UPDATE "htad"."site_settings" s SET "company_name" = l."company_name"
    FROM "htad"."site_settings_locales" l WHERE l."_parent_id" = s."id" AND l."_locale" = 'en';`)
}
