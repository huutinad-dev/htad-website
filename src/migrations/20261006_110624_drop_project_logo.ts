import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "htad"."projects" DROP CONSTRAINT "projects_logo_id_media_id_fk";
  
  DROP INDEX "htad"."projects_logo_idx";
  ALTER TABLE "htad"."projects" DROP COLUMN "logo_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "htad"."projects" ADD COLUMN "logo_id" integer;
  ALTER TABLE "htad"."projects" ADD CONSTRAINT "projects_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "htad"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "projects_logo_idx" ON "htad"."projects" USING btree ("logo_id");`)
}
