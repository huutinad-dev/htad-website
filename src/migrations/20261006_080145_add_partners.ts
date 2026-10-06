import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
// Same fractional-index generator Payload's `orderable` uses for drag-and-drop
import { generateNKeysBetween } from 'payload/shared'

// Partners become their own collection. Hand-edited after generation:
// - every logo currently picked on the home page or a service becomes a partner (name from the
//   image's alt text, link from the short-lived media.link) and is selected in the same places;
// - "htad"."media"."link" is deliberately NOT dropped here: the deployment still running while
//   this migrates selects that column, and dropping it would break its image requests until the
//   new deployment is live. It is unused from now on and can be dropped in a later migration.

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "htad"."partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"name" varchar NOT NULL,
  	"logo_id" integer NOT NULL,
  	"link" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "htad"."services_rels" ADD COLUMN "partners_id" integer;
  ALTER TABLE "htad"."payload_locked_documents_rels" ADD COLUMN "partners_id" integer;
  ALTER TABLE "htad"."home_page_rels" ADD COLUMN "partners_id" integer;
  ALTER TABLE "htad"."partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "htad"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "partners__order_idx" ON "htad"."partners" USING btree ("_order");
  CREATE INDEX "partners_logo_idx" ON "htad"."partners" USING btree ("logo_id");
  CREATE INDEX "partners_updated_at_idx" ON "htad"."partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "htad"."partners" USING btree ("created_at");
  ALTER TABLE "htad"."services_rels" ADD CONSTRAINT "services_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "htad"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "htad"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."home_page_rels" ADD CONSTRAINT "home_page_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "htad"."partners"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "services_rels_partners_id_idx" ON "htad"."services_rels" USING btree ("partners_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "htad"."payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "home_page_rels_partners_id_idx" ON "htad"."home_page_rels" USING btree ("partners_id");`)

  // One partner per distinct logo, in the order they appear (home page first, then services).
  const { rows } = await db.execute(sql`
   SELECT m."id", m."alt", m."link"
   FROM (
     SELECT "media_id", min("rank") AS "rank"
     FROM (
       SELECT "media_id", coalesce("order", 0) AS "rank" FROM "htad"."home_page_rels" WHERE "path" = 'partnerLogos' AND "media_id" IS NOT NULL
       UNION ALL
       SELECT "media_id", 100000 + "parent_id" * 1000 + coalesce("order", 0) AS "rank" FROM "htad"."services_rels" WHERE "path" = 'partnerLogos' AND "media_id" IS NOT NULL
     ) AS picked
     GROUP BY "media_id"
   ) AS logos
   JOIN "htad"."media" AS m ON m."id" = logos."media_id"
   ORDER BY logos."rank", m."id"`)
  const keys = generateNKeysBetween(null, null, rows.length)
  for (let i = 0; i < rows.length; i++) {
    const { id, alt, link } = rows[i] as { id: number; alt: string | null; link: string | null }
    await db.execute(
      sql`INSERT INTO "htad"."partners" ("_order", "name", "logo_id", "link") VALUES (${keys[i]}, ${alt || `Partner ${i + 1}`}, ${id}, ${link})`,
    )
  }

  // Add the selections again as partners, keeping their order. The old `partnerLogos` rows stay:
  // the database is shared by local and production, and the code deployed before this change
  // still reads them. They are ignored by the new code and can be deleted in a later migration.
  await db.execute(sql`
   INSERT INTO "htad"."home_page_rels" ("order", "parent_id", "path", "partners_id")
   SELECT r."order", r."parent_id", 'partners', p."id"
   FROM "htad"."home_page_rels" AS r JOIN "htad"."partners" AS p ON p."logo_id" = r."media_id"
   WHERE r."path" = 'partnerLogos';
  INSERT INTO "htad"."services_rels" ("order", "parent_id", "path", "partners_id")
   SELECT r."order", r."parent_id", 'partners', p."id"
   FROM "htad"."services_rels" AS r JOIN "htad"."partners" AS p ON p."logo_id" = r."media_id"
   WHERE r."path" = 'partnerLogos';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // the original `partnerLogos` selections were never removed, so only the new rows go
  await db.execute(sql`
   DELETE FROM "htad"."home_page_rels" WHERE "path" = 'partners';
  DELETE FROM "htad"."services_rels" WHERE "path" = 'partners';`)
  // constraints, indexes and columns first: dropping the table first (as generated) removes
  // the foreign keys with it and the DROP CONSTRAINT statements then fail
  await db.execute(sql`
   ALTER TABLE "htad"."services_rels" DROP CONSTRAINT "services_rels_partners_fk";
  ALTER TABLE "htad"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_partners_fk";
  ALTER TABLE "htad"."home_page_rels" DROP CONSTRAINT "home_page_rels_partners_fk";
  DROP INDEX "htad"."services_rels_partners_id_idx";
  DROP INDEX "htad"."payload_locked_documents_rels_partners_id_idx";
  DROP INDEX "htad"."home_page_rels_partners_id_idx";
  ALTER TABLE "htad"."services_rels" DROP COLUMN "partners_id";
  ALTER TABLE "htad"."payload_locked_documents_rels" DROP COLUMN "partners_id";
  ALTER TABLE "htad"."home_page_rels" DROP COLUMN "partners_id";
  DROP TABLE "htad"."partners";`)
}
