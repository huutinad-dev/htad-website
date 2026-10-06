import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "htad"."projects" ADD COLUMN "cover_portrait_id" integer;
  ALTER TABLE "htad"."projects" ADD CONSTRAINT "projects_cover_portrait_id_media_id_fk" FOREIGN KEY ("cover_portrait_id") REFERENCES "htad"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "projects_cover_portrait_idx" ON "htad"."projects" USING btree ("cover_portrait_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "htad"."projects" DROP CONSTRAINT "projects_cover_portrait_id_media_id_fk";
  
  DROP INDEX "htad"."projects_cover_portrait_idx";
  ALTER TABLE "htad"."projects" DROP COLUMN "cover_portrait_id";`)
}
