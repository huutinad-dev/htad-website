import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "htad"."projects_rels" ADD COLUMN "partners_id" integer;
  ALTER TABLE "htad"."projects_rels" ADD CONSTRAINT "projects_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "htad"."partners"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_rels_partners_id_idx" ON "htad"."projects_rels" USING btree ("partners_id");`)

  // Hand-added. Projects named their partners in free text ("VPF", "VTVgo × Mobifone"). Where
  // every name in that text is a partner in the Partners list (ignoring case and spaces), pick
  // those partners. A project with any unknown name is left alone and keeps showing its text.
  // The text column itself stays: the code deployed while this runs still reads it.
  await db.execute(sql`
   WITH parts AS (
     SELECT l."_parent_id" AS project_id, t.ord, lower(regexp_replace(t.part, '\\s', '', 'g')) AS key
     FROM "htad"."projects_locales" AS l, regexp_split_to_table(l."partner", '\\s*×\\s*') WITH ORDINALITY AS t(part, ord)
     WHERE l."_locale" = 'en' AND coalesce(l."partner", '') <> ''
   ), matched AS (
     SELECT parts.project_id, parts.ord, p."id" AS partner_id
     FROM parts LEFT JOIN "htad"."partners" AS p ON lower(regexp_replace(p."name", '\\s', '', 'g')) = parts.key
   )
   INSERT INTO "htad"."projects_rels" ("order", "parent_id", "path", "partners_id")
   SELECT m.ord, m.project_id, 'partners', m.partner_id
   FROM matched AS m
   WHERE NOT EXISTS (SELECT 1 FROM matched AS x WHERE x.project_id = m.project_id AND x.partner_id IS NULL);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DELETE FROM "htad"."projects_rels" WHERE "path" = 'partners';
   ALTER TABLE "htad"."projects_rels" DROP CONSTRAINT "projects_rels_partners_fk";
  
  DROP INDEX "htad"."projects_rels_partners_id_idx";
  ALTER TABLE "htad"."projects_rels" DROP COLUMN "partners_id";`)
}
