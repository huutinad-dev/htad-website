import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "htad"."messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"company" varchar,
  	"message" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "htad"."payload_locked_documents_rels" ADD COLUMN "messages_id" integer;
  CREATE INDEX "messages_updated_at_idx" ON "htad"."messages" USING btree ("updated_at");
  CREATE INDEX "messages_created_at_idx" ON "htad"."messages" USING btree ("created_at");
  ALTER TABLE "htad"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_messages_fk" FOREIGN KEY ("messages_id") REFERENCES "htad"."messages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_messages_id_idx" ON "htad"."payload_locked_documents_rels" USING btree ("messages_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "htad"."messages" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "htad"."messages" CASCADE;
  ALTER TABLE "htad"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_messages_fk";
  
  DROP INDEX "htad"."payload_locked_documents_rels_messages_id_idx";
  ALTER TABLE "htad"."payload_locked_documents_rels" DROP COLUMN "messages_id";`)
}
