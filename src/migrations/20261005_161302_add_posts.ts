import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "htad"."enum_posts_type" AS ENUM('news', 'event');
  CREATE TYPE "htad"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "htad"."enum__posts_v_version_type" AS ENUM('news', 'event');
  CREATE TYPE "htad"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "htad"."enum__posts_v_published_locale" AS ENUM('en', 'vi');
  CREATE TABLE "htad"."posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cover_id" integer,
  	"source_url" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"type" "htad"."enum_posts_type" DEFAULT 'news',
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "htad"."enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "htad"."posts_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "htad"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "htad"."_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_cover_id" integer,
  	"version_source_url" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_type" "htad"."enum__posts_v_version_type" DEFAULT 'news',
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "htad"."enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "htad"."enum__posts_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "htad"."_posts_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "htad"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "htad"."payload_locked_documents_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "htad"."posts" ADD CONSTRAINT "posts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "htad"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "htad"."posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "htad"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "htad"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "htad"."_posts_v" ADD CONSTRAINT "_posts_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "htad"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "htad"."_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "htad"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_cover_idx" ON "htad"."posts" USING btree ("cover_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "htad"."posts" USING btree ("slug");
  CREATE INDEX "posts_updated_at_idx" ON "htad"."posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "htad"."posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "htad"."posts" USING btree ("_status");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "htad"."posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "htad"."_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_cover_idx" ON "htad"."_posts_v" USING btree ("version_cover_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "htad"."_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "htad"."_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "htad"."_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "htad"."_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "htad"."_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "htad"."_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_snapshot_idx" ON "htad"."_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "htad"."_posts_v" USING btree ("published_locale");
  CREATE INDEX "_posts_v_latest_idx" ON "htad"."_posts_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "htad"."_posts_v_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "htad"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "htad"."posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "htad"."payload_locked_documents_rels" USING btree ("posts_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "htad"."posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "htad"."posts_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "htad"."_posts_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "htad"."_posts_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "htad"."posts" CASCADE;
  DROP TABLE "htad"."posts_locales" CASCADE;
  DROP TABLE "htad"."_posts_v" CASCADE;
  DROP TABLE "htad"."_posts_v_locales" CASCADE;
  ALTER TABLE "htad"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_posts_fk";
  
  DROP INDEX "htad"."payload_locked_documents_rels_posts_id_idx";
  ALTER TABLE "htad"."payload_locked_documents_rels" DROP COLUMN "posts_id";
  DROP TYPE "htad"."enum_posts_type";
  DROP TYPE "htad"."enum_posts_status";
  DROP TYPE "htad"."enum__posts_v_version_type";
  DROP TYPE "htad"."enum__posts_v_version_status";
  DROP TYPE "htad"."enum__posts_v_published_locale";`)
}
