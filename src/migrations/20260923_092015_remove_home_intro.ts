import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "htad"."home_page" DROP CONSTRAINT "home_page_intro_image_id_media_id_fk";
  
  DROP INDEX "htad"."home_page_intro_intro_image_idx";
  ALTER TABLE "htad"."home_page" DROP COLUMN "intro_image_id";
  ALTER TABLE "htad"."home_page_locales" DROP COLUMN "intro_eyebrow";
  ALTER TABLE "htad"."home_page_locales" DROP COLUMN "intro_heading";
  ALTER TABLE "htad"."home_page_locales" DROP COLUMN "intro_text";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "htad"."home_page" ADD COLUMN "intro_image_id" integer;
  ALTER TABLE "htad"."home_page_locales" ADD COLUMN "intro_eyebrow" varchar;
  ALTER TABLE "htad"."home_page_locales" ADD COLUMN "intro_heading" varchar;
  ALTER TABLE "htad"."home_page_locales" ADD COLUMN "intro_text" varchar;
  ALTER TABLE "htad"."home_page" ADD CONSTRAINT "home_page_intro_image_id_media_id_fk" FOREIGN KEY ("intro_image_id") REFERENCES "htad"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_page_intro_intro_image_idx" ON "htad"."home_page" USING btree ("intro_image_id");`)
}
