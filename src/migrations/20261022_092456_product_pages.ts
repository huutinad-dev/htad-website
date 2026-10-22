import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "htad"."products" ADD COLUMN "generate_slug" boolean DEFAULT true;
  ALTER TABLE "htad"."products" ADD COLUMN "slug" varchar;
  ALTER TABLE "htad"."products_locales" ADD COLUMN "body" jsonb;`)
  // Existing products get a slug from their English title (ids keep them unique). The column
  // stays nullable: the slug is required by the app, but the code deployed before this one
  // doesn't send it, and its admin must still be able to save a product meanwhile.
  await db.execute(sql`
   UPDATE "htad"."products" p
   SET "slug" = trim(both '-' from regexp_replace(lower(l."title"), '[^a-z0-9]+', '-', 'g')) || '-' || p."id"
   FROM "htad"."products_locales" l
   WHERE l."_parent_id" = p."id" AND l."_locale" = 'en' AND p."slug" IS NULL;
  CREATE UNIQUE INDEX "products_slug_idx" ON "htad"."products" USING btree ("slug");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "htad"."products_slug_idx";
  ALTER TABLE "htad"."products" DROP COLUMN "generate_slug";
  ALTER TABLE "htad"."products" DROP COLUMN "slug";
  ALTER TABLE "htad"."products_locales" DROP COLUMN "body";`)
}
