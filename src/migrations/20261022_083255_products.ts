import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "htad"."products_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "htad"."products_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "htad"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "htad"."products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"author" varchar,
  	"cover_id" integer NOT NULL,
  	"price" varchar,
  	"visible" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "htad"."products_locales" (
  	"title" varchar NOT NULL,
  	"excerpt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "htad"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "htad"."payload_locked_documents_rels" ADD COLUMN "products_id" integer;
  ALTER TABLE "htad"."products_links" ADD CONSTRAINT "products_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "htad"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."products_links_locales" ADD CONSTRAINT "products_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "htad"."products_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."products" ADD CONSTRAINT "products_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "htad"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "htad"."products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "htad"."products"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_links_order_idx" ON "htad"."products_links" USING btree ("_order");
  CREATE INDEX "products_links_parent_id_idx" ON "htad"."products_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_links_locales_locale_parent_id_unique" ON "htad"."products_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products__order_idx" ON "htad"."products" USING btree ("_order");
  CREATE INDEX "products_cover_idx" ON "htad"."products" USING btree ("cover_id");
  CREATE INDEX "products_updated_at_idx" ON "htad"."products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "htad"."products" USING btree ("created_at");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "htad"."products_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "htad"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "htad"."products"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "htad"."payload_locked_documents_rels" USING btree ("products_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "htad"."products_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "htad"."products_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "htad"."products" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "htad"."products_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "htad"."products_links" CASCADE;
  DROP TABLE "htad"."products_links_locales" CASCADE;
  DROP TABLE "htad"."products" CASCADE;
  DROP TABLE "htad"."products_locales" CASCADE;
  ALTER TABLE "htad"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_products_fk";
  
  DROP INDEX "htad"."payload_locked_documents_rels_products_id_idx";
  ALTER TABLE "htad"."payload_locked_documents_rels" DROP COLUMN "products_id";`)
}
