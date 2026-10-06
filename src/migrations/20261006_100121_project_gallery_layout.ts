import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "htad"."enum_projects_gallery_layout" AS ENUM('landscape', 'portrait');
  ALTER TABLE "htad"."projects" ADD COLUMN "gallery_layout" "htad"."enum_projects_gallery_layout" DEFAULT 'landscape';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "htad"."projects" DROP COLUMN "gallery_layout";
  DROP TYPE "htad"."enum_projects_gallery_layout";`)
}
