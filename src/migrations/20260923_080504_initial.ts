import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE SCHEMA IF NOT EXISTS "htad";
   CREATE TYPE "htad"."_locales" AS ENUM('en', 'vi');
  CREATE TABLE "htad"."services_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "htad"."_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "htad"."services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cover_id" integer NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "htad"."services_locales" (
  	"title" varchar NOT NULL,
  	"headline" varchar,
  	"excerpt" varchar NOT NULL,
  	"body" jsonb,
  	"gallery_caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "htad"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "htad"."services_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"projects_id" integer
  );
  
  CREATE TABLE "htad"."projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cover_id" integer NOT NULL,
  	"logo_id" integer,
  	"video_url" varchar,
  	"external_url" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"category_id" integer NOT NULL,
  	"year" varchar,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "htad"."projects_locales" (
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"excerpt" varchar,
  	"body" jsonb,
  	"quote" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "htad"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "htad"."projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "htad"."project_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "htad"."project_categories_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "htad"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "htad"."media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar
  );
  
  CREATE TABLE "htad"."users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "htad"."users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "htad"."payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "htad"."payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "htad"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"projects_id" integer,
  	"project_categories_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "htad"."payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "htad"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "htad"."payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "htad"."home_page_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "htad"."_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "htad"."home_page_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "htad"."_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric NOT NULL,
  	"prefix" varchar,
  	"suffix" varchar,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "htad"."home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "htad"."home_page_locales" (
  	"hero_eyebrow" varchar,
  	"hero_title" varchar NOT NULL,
  	"hero_subtitle" varchar,
  	"intro_eyebrow" varchar,
  	"intro_heading" varchar,
  	"intro_text" varchar,
  	"services_section_eyebrow" varchar,
  	"services_section_heading" varchar,
  	"services_section_text" varchar,
  	"projects_section_eyebrow" varchar,
  	"projects_section_heading" varchar,
  	"projects_section_text" varchar,
  	"cta_heading" varchar,
  	"cta_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "htad"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "htad"."home_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"projects_id" integer
  );
  
  CREATE TABLE "htad"."about_page_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "htad"."_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "htad"."about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"founder_name" varchar NOT NULL,
  	"founder_photo_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "htad"."about_page_locales" (
  	"heading" varchar NOT NULL,
  	"lead" varchar,
  	"body" jsonb,
  	"founder_role" varchar,
  	"founder_bio" jsonb,
  	"founder_quote" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "htad"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "htad"."site_settings_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "htad"."site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company_name" varchar NOT NULL,
  	"short_name" varchar,
  	"logo_id" integer,
  	"logo_stacked_id" integer,
  	"contact_phone" varchar,
  	"contact_email" varchar,
  	"contact_website" varchar,
  	"contact_map_url" varchar,
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "htad"."site_settings_locales" (
  	"tagline" varchar,
  	"contact_address" varchar,
  	"contact_city" varchar,
  	"footer_headline" varchar,
  	"footer_text" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "htad"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "htad"."services_highlights" ADD CONSTRAINT "services_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "htad"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."services" ADD CONSTRAINT "services_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "htad"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "htad"."services_locales" ADD CONSTRAINT "services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "htad"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."services_rels" ADD CONSTRAINT "services_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "htad"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."services_rels" ADD CONSTRAINT "services_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "htad"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."services_rels" ADD CONSTRAINT "services_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "htad"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."projects" ADD CONSTRAINT "projects_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "htad"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "htad"."projects" ADD CONSTRAINT "projects_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "htad"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "htad"."projects" ADD CONSTRAINT "projects_category_id_project_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "htad"."project_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "htad"."projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "htad"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "htad"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."projects_rels" ADD CONSTRAINT "projects_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "htad"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."project_categories_locales" ADD CONSTRAINT "project_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "htad"."project_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "htad"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "htad"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "htad"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "htad"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_project_categories_fk" FOREIGN KEY ("project_categories_id") REFERENCES "htad"."project_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "htad"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "htad"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "htad"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "htad"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."home_page_marquee" ADD CONSTRAINT "home_page_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "htad"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."home_page_stats" ADD CONSTRAINT "home_page_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "htad"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."home_page" ADD CONSTRAINT "home_page_intro_image_id_media_id_fk" FOREIGN KEY ("intro_image_id") REFERENCES "htad"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "htad"."home_page_locales" ADD CONSTRAINT "home_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "htad"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."home_page_rels" ADD CONSTRAINT "home_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "htad"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."home_page_rels" ADD CONSTRAINT "home_page_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "htad"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."home_page_rels" ADD CONSTRAINT "home_page_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "htad"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."about_page_pillars" ADD CONSTRAINT "about_page_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "htad"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."about_page" ADD CONSTRAINT "about_page_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "htad"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "htad"."about_page" ADD CONSTRAINT "about_page_founder_photo_id_media_id_fk" FOREIGN KEY ("founder_photo_id") REFERENCES "htad"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "htad"."about_page_locales" ADD CONSTRAINT "about_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "htad"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."site_settings_social" ADD CONSTRAINT "site_settings_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "htad"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "htad"."site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "htad"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "htad"."site_settings" ADD CONSTRAINT "site_settings_logo_stacked_id_media_id_fk" FOREIGN KEY ("logo_stacked_id") REFERENCES "htad"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "htad"."site_settings" ADD CONSTRAINT "site_settings_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "htad"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "htad"."site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "htad"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "services_highlights_order_idx" ON "htad"."services_highlights" USING btree ("_order");
  CREATE INDEX "services_highlights_parent_id_idx" ON "htad"."services_highlights" USING btree ("_parent_id");
  CREATE INDEX "services_highlights_locale_idx" ON "htad"."services_highlights" USING btree ("_locale");
  CREATE INDEX "services_cover_idx" ON "htad"."services" USING btree ("cover_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "htad"."services" USING btree ("slug");
  CREATE INDEX "services_updated_at_idx" ON "htad"."services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "htad"."services" USING btree ("created_at");
  CREATE UNIQUE INDEX "services_locales_locale_parent_id_unique" ON "htad"."services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_rels_order_idx" ON "htad"."services_rels" USING btree ("order");
  CREATE INDEX "services_rels_parent_idx" ON "htad"."services_rels" USING btree ("parent_id");
  CREATE INDEX "services_rels_path_idx" ON "htad"."services_rels" USING btree ("path");
  CREATE INDEX "services_rels_media_id_idx" ON "htad"."services_rels" USING btree ("media_id");
  CREATE INDEX "services_rels_projects_id_idx" ON "htad"."services_rels" USING btree ("projects_id");
  CREATE INDEX "projects_cover_idx" ON "htad"."projects" USING btree ("cover_id");
  CREATE INDEX "projects_logo_idx" ON "htad"."projects" USING btree ("logo_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "htad"."projects" USING btree ("slug");
  CREATE INDEX "projects_category_idx" ON "htad"."projects" USING btree ("category_id");
  CREATE INDEX "projects_updated_at_idx" ON "htad"."projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "htad"."projects" USING btree ("created_at");
  CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "htad"."projects_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_rels_order_idx" ON "htad"."projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "htad"."projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "htad"."projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_media_id_idx" ON "htad"."projects_rels" USING btree ("media_id");
  CREATE UNIQUE INDEX "project_categories_slug_idx" ON "htad"."project_categories" USING btree ("slug");
  CREATE INDEX "project_categories_updated_at_idx" ON "htad"."project_categories" USING btree ("updated_at");
  CREATE INDEX "project_categories_created_at_idx" ON "htad"."project_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "project_categories_locales_locale_parent_id_unique" ON "htad"."project_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_updated_at_idx" ON "htad"."media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "htad"."media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "htad"."media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "htad"."media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "htad"."media" USING btree ("sizes_card_filename");
  CREATE INDEX "users_sessions_order_idx" ON "htad"."users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "htad"."users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "htad"."users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "htad"."users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "htad"."users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "htad"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "htad"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "htad"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "htad"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "htad"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "htad"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "htad"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "htad"."payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "htad"."payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_project_categories_id_idx" ON "htad"."payload_locked_documents_rels" USING btree ("project_categories_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "htad"."payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "htad"."payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "htad"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "htad"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "htad"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "htad"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "htad"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "htad"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "htad"."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "htad"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "htad"."payload_migrations" USING btree ("created_at");
  CREATE INDEX "home_page_marquee_order_idx" ON "htad"."home_page_marquee" USING btree ("_order");
  CREATE INDEX "home_page_marquee_parent_id_idx" ON "htad"."home_page_marquee" USING btree ("_parent_id");
  CREATE INDEX "home_page_marquee_locale_idx" ON "htad"."home_page_marquee" USING btree ("_locale");
  CREATE INDEX "home_page_stats_order_idx" ON "htad"."home_page_stats" USING btree ("_order");
  CREATE INDEX "home_page_stats_parent_id_idx" ON "htad"."home_page_stats" USING btree ("_parent_id");
  CREATE INDEX "home_page_stats_locale_idx" ON "htad"."home_page_stats" USING btree ("_locale");
  CREATE INDEX "home_page_intro_intro_image_idx" ON "htad"."home_page" USING btree ("intro_image_id");
  CREATE UNIQUE INDEX "home_page_locales_locale_parent_id_unique" ON "htad"."home_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_rels_order_idx" ON "htad"."home_page_rels" USING btree ("order");
  CREATE INDEX "home_page_rels_parent_idx" ON "htad"."home_page_rels" USING btree ("parent_id");
  CREATE INDEX "home_page_rels_path_idx" ON "htad"."home_page_rels" USING btree ("path");
  CREATE INDEX "home_page_rels_media_id_idx" ON "htad"."home_page_rels" USING btree ("media_id");
  CREATE INDEX "home_page_rels_projects_id_idx" ON "htad"."home_page_rels" USING btree ("projects_id");
  CREATE INDEX "about_page_pillars_order_idx" ON "htad"."about_page_pillars" USING btree ("_order");
  CREATE INDEX "about_page_pillars_parent_id_idx" ON "htad"."about_page_pillars" USING btree ("_parent_id");
  CREATE INDEX "about_page_pillars_locale_idx" ON "htad"."about_page_pillars" USING btree ("_locale");
  CREATE INDEX "about_page_image_idx" ON "htad"."about_page" USING btree ("image_id");
  CREATE INDEX "about_page_founder_founder_photo_idx" ON "htad"."about_page" USING btree ("founder_photo_id");
  CREATE UNIQUE INDEX "about_page_locales_locale_parent_id_unique" ON "htad"."about_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_social_order_idx" ON "htad"."site_settings_social" USING btree ("_order");
  CREATE INDEX "site_settings_social_parent_id_idx" ON "htad"."site_settings_social" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "htad"."site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_logo_stacked_idx" ON "htad"."site_settings" USING btree ("logo_stacked_id");
  CREATE INDEX "site_settings_og_image_idx" ON "htad"."site_settings" USING btree ("og_image_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "htad"."site_settings_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "htad"."services_highlights" CASCADE;
  DROP TABLE "htad"."services" CASCADE;
  DROP TABLE "htad"."services_locales" CASCADE;
  DROP TABLE "htad"."services_rels" CASCADE;
  DROP TABLE "htad"."projects" CASCADE;
  DROP TABLE "htad"."projects_locales" CASCADE;
  DROP TABLE "htad"."projects_rels" CASCADE;
  DROP TABLE "htad"."project_categories" CASCADE;
  DROP TABLE "htad"."project_categories_locales" CASCADE;
  DROP TABLE "htad"."media" CASCADE;
  DROP TABLE "htad"."users_sessions" CASCADE;
  DROP TABLE "htad"."users" CASCADE;
  DROP TABLE "htad"."payload_kv" CASCADE;
  DROP TABLE "htad"."payload_locked_documents" CASCADE;
  DROP TABLE "htad"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "htad"."payload_preferences" CASCADE;
  DROP TABLE "htad"."payload_preferences_rels" CASCADE;
  DROP TABLE "htad"."payload_migrations" CASCADE;
  DROP TABLE "htad"."home_page_marquee" CASCADE;
  DROP TABLE "htad"."home_page_stats" CASCADE;
  DROP TABLE "htad"."home_page" CASCADE;
  DROP TABLE "htad"."home_page_locales" CASCADE;
  DROP TABLE "htad"."home_page_rels" CASCADE;
  DROP TABLE "htad"."about_page_pillars" CASCADE;
  DROP TABLE "htad"."about_page" CASCADE;
  DROP TABLE "htad"."about_page_locales" CASCADE;
  DROP TABLE "htad"."site_settings_social" CASCADE;
  DROP TABLE "htad"."site_settings" CASCADE;
  DROP TABLE "htad"."site_settings_locales" CASCADE;
  DROP TYPE "htad"."_locales";`)
}
