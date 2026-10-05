import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { en } from '@payloadcms/translations/languages/en'
import { vi } from '@payloadcms/translations/languages/vi'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Services } from './collections/Services'
import { Projects } from './collections/Projects'
import { ProjectCategories } from './collections/ProjectCategories'
import { SiteSettings } from './globals/SiteSettings'
import { HomePage } from './globals/HomePage'
import { AboutPage } from './globals/AboutPage'
import { locales, defaultLocale } from './i18n/config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const r2Enabled = Boolean(
  process.env.R2_BUCKET &&
    process.env.R2_ENDPOINT &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY,
)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' · HTAd CMS',
      icons: [{ rel: 'icon', type: 'image/png', url: '/brand/emblem.png' }],
    },
    components: {
      graphics: {
        Logo: '/components/admin/Logo#AdminLogo',
        Icon: '/components/admin/Logo#AdminIcon',
      },
    },
  },
  i18n: {
    supportedLanguages: { en, vi },
    fallbackLanguage: 'en',
  },
  localization: {
    locales: locales.map((code) => ({
      code,
      label: code === 'vi' ? 'Tiếng Việt' : 'English',
    })),
    defaultLocale,
    fallback: true,
  },
  collections: [Services, Projects, ProjectCategories, Media, Users],
  globals: [HomePage, AboutPage, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
      ssl: process.env.DATABASE_URL?.includes('localhost')
        ? undefined
        : { rejectUnauthorized: false },
    },
    // The database is shared with another application: keep every Payload table
    // inside its own schema and never let Payload auto-push schema changes.
    // Schema changes go through reviewed migrations only (see README).
    schemaName: process.env.DATABASE_SCHEMA || 'htad',
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins: [
    // Uploads go to Cloudflare R2 (S3-compatible) when the R2_* variables are set (always on
    // Vercel, whose filesystem is read-only). Without them, files stay in the local /media folder.
    // Files are still served through /api/media/file/<filename>, so stored URLs don't change.
    s3Storage({
      enabled: r2Enabled,
      // keep the adapter's fields (e.g. _objectKey) in the schema even when disabled,
      // so local and Vercel share one database schema / migration history
      alwaysInsertFields: true,
      collections: { media: true },
      bucket: process.env.R2_BUCKET || '',
      config: {
        endpoint: process.env.R2_ENDPOINT,
        region: 'auto',
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
      },
    }),
  ],
})
