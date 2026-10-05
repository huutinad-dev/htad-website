import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// The founder's name becomes translatable. Hand-edited: the generated version dropped the
// existing name. Here it is copied into every locale first, and the Vietnamese copy gets
// its diacritics.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "htad"."about_page_locales" ADD COLUMN "founder_name" varchar;
  UPDATE "htad"."about_page_locales" AS l SET "founder_name" = a."founder_name" FROM "htad"."about_page" AS a WHERE l."_parent_id" = a."id";
  UPDATE "htad"."about_page_locales" SET "founder_name" = 'Nguyễn Bá Phú' WHERE "_locale" = 'vi' AND "founder_name" = 'Nguyen Ba Phu';
  ALTER TABLE "htad"."about_page_locales" ALTER COLUMN "founder_name" SET NOT NULL;
  ALTER TABLE "htad"."about_page" DROP COLUMN "founder_name";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "htad"."about_page" ADD COLUMN "founder_name" varchar;
  UPDATE "htad"."about_page" AS a SET "founder_name" = l."founder_name" FROM "htad"."about_page_locales" AS l WHERE l."_parent_id" = a."id" AND l."_locale" = 'en';
  UPDATE "htad"."about_page" AS a SET "founder_name" = l."founder_name" FROM "htad"."about_page_locales" AS l WHERE l."_parent_id" = a."id" AND a."founder_name" IS NULL;
  ALTER TABLE "htad"."about_page" ALTER COLUMN "founder_name" SET NOT NULL;
  ALTER TABLE "htad"."about_page_locales" DROP COLUMN "founder_name";`)
}
