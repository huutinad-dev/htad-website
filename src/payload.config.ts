import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { en } from '@payloadcms/translations/languages/en'
import { vi } from '@payloadcms/translations/languages/vi'
import path from 'path'
import { payloadTheme } from 'payload-theme'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Services } from './collections/Services'
import { Projects } from './collections/Projects'
import { ProjectCategories } from './collections/ProjectCategories'
import { Posts } from './collections/Posts'
import { Messages } from './collections/Messages'
import { Partners } from './collections/Partners'
import { SiteSettings } from './globals/SiteSettings'
import { HomePage } from './globals/HomePage'
import { AboutPage } from './globals/AboutPage'
import { adminThemeVi } from './i18n/adminTheme'
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
      // the interface language follows the content locale chosen in the header
      providers: ['/components/admin/LanguageFollowsLocale#LanguageFollowsLocale'],
      // EN / VI switch in the header, beside the user menu
      actions: ['/components/admin/LocaleSwitch#LocaleSwitch'],
    },
  },
  i18n: {
    supportedLanguages: { en, vi },
    fallbackLanguage: 'en',
    translations: { vi: { payloadTheme: adminThemeVi } },
  },
  localization: {
    locales: locales.map((code) => ({
      code,
      label: code === 'vi' ? 'Tiếng Việt' : 'English',
    })),
    defaultLocale,
    fallback: true,
  },
  collections: [Services, Projects, ProjectCategories, Posts, Partners, Media, Messages, Users],
  globals: [HomePage, AboutPage, SiteSettings],
  editor: lexicalEditor(),
  // Email (contact form, password reset) goes through Resend once RESEND_API_KEY is set;
  // without it Payload only logs emails to the console. EMAIL_FROM must be an address on a
  // domain verified in Resend — the default only delivers to the Resend account's own email.
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        defaultFromName: 'HTAd Website',
      })
    : undefined,
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
    // Admin look and feel (dashboard, icon sidebar, ⌘K palette). Remove this entry and the
    // import in app/(payload)/custom.scss to go back to the stock Payload admin.
    payloadTheme({
      accent: '#ffbd01',
      font: 'inter',
      logo: '/brand/logo-horizontal.png',
      logoHeight: 34,
      icon: '/brand/emblem.png',
      nav: {
        icons: {
          services: 'briefcase',
          projects: 'folder-kanban',
          'project-categories': 'tags',
          posts: 'newspaper',
          partners: 'handshake',
          media: 'image',
          messages: 'mail',
          users: 'users',
          'home-page': 'house',
          'about-page': 'info',
          'site-settings': 'settings',
        },
      },
    }),
    // Uploads go to Cloudflare R2 (S3-compatible) when the R2_* variables are set (always on
    // Vercel, whose filesystem is read-only). Without them, files stay in the local /media folder.
    // Files are still served through /api/media/file/<filename>, so stored URLs don't change.
    s3Storage({
      enabled: r2Enabled,
      // keep the adapter's fields (e.g. _objectKey) in the schema even when disabled,
      // so local and Vercel share one database schema / migration history
      alwaysInsertFields: true,
      // an explicit (empty) prefix keeps the `prefix` column in the schema whether or not R2 is
      // configured; without it, generating a migration with R2 on wants to drop that column
      collections: { media: { prefix: '' } },
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
