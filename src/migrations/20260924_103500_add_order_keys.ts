import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
// Same fractional-index generator Payload's `orderable` uses for drag-and-drop
import { generateNKeysBetween } from 'payload/shared'

const TABLES = ['services', 'projects', 'project_categories'] as const

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "htad"."services" ADD COLUMN "_order" varchar;
  ALTER TABLE "htad"."projects" ADD COLUMN "_order" varchar;
  ALTER TABLE "htad"."project_categories" ADD COLUMN "_order" varchar;
  CREATE INDEX "services__order_idx" ON "htad"."services" USING btree ("_order");
  CREATE INDEX "projects__order_idx" ON "htad"."projects" USING btree ("_order");
  CREATE INDEX "project_categories__order_idx" ON "htad"."project_categories" USING btree ("_order");`)

  // Seed _order from the legacy numeric `order` column so the current sequence is kept.
  for (const table of TABLES) {
    const { rows } = await db.execute(
      sql.raw(`SELECT "id" FROM "htad"."${table}" ORDER BY "order" ASC NULLS LAST, "id" ASC`),
    )
    const keys = generateNKeysBetween(null, null, rows.length)
    for (let i = 0; i < rows.length; i++) {
      await db.execute(sql`UPDATE ${sql.raw(`"htad"."${table}"`)} SET "_order" = ${keys[i]} WHERE "id" = ${rows[i].id}`)
    }
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "htad"."services__order_idx";
  DROP INDEX "htad"."projects__order_idx";
  DROP INDEX "htad"."project_categories__order_idx";
  ALTER TABLE "htad"."services" DROP COLUMN "_order";
  ALTER TABLE "htad"."projects" DROP COLUMN "_order";
  ALTER TABLE "htad"."project_categories" DROP COLUMN "_order";`)
}
