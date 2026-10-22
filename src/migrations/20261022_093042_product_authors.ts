import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "htad"."products_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "htad"."products_texts" ADD CONSTRAINT "products_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "htad"."products"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_texts_order_parent" ON "htad"."products_texts" USING btree ("order","parent_id");`)
  // copy (not move) the single author into the new list; `author` stays for the deployed code
  await db.execute(sql`
   INSERT INTO "htad"."products_texts" ("order", "parent_id", "path", "text")
   SELECT 1, "id", 'authors', "author" FROM "htad"."products" WHERE coalesce("author", '') <> '';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "htad"."products_texts" CASCADE;`)
}
