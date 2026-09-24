import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "htad"."services" DROP COLUMN "order";
  ALTER TABLE "htad"."projects" DROP COLUMN "order";
  ALTER TABLE "htad"."project_categories" DROP COLUMN "order";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "htad"."services" ADD COLUMN "order" numeric DEFAULT 0;
  ALTER TABLE "htad"."projects" ADD COLUMN "order" numeric DEFAULT 0;
  ALTER TABLE "htad"."project_categories" ADD COLUMN "order" numeric DEFAULT 0;`)
}
