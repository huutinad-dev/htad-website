import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "htad"."enum_media_category" AS ENUM('projects', 'services', 'insights', 'shop', 'partners', 'site', 'library');
  ALTER TABLE "htad"."media" ALTER COLUMN "prefix" SET DEFAULT 'media';
  ALTER TABLE "htad"."media" ADD COLUMN "category" "htad"."enum_media_category" DEFAULT 'library' NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "htad"."media" ALTER COLUMN "prefix" SET DEFAULT '';
  ALTER TABLE "htad"."media" DROP COLUMN "category";
  DROP TYPE "htad"."enum_media_category";`)
}
