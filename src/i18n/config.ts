export const locales = ['en', 'vi'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value)

/**
 * English, the default, has unprefixed URLs (`/about`); Vietnamese lives under `/vi` (`/vi/about`),
 * so each language has its own URL that search engines can index. `src/proxy.ts` rewrites
 * unprefixed URLs to the `[locale]` route as `en`. A language picked with the header switch is
 * remembered in this cookie, and an unprefixed URL then redirects to its `/vi` version.
 */
export const LOCALE_COOKIE = 'htad-locale'

/** `/vi/about` → `/about` (also strips the internal `/en` segment a rewritten pathname may carry). */
export const stripLocalePrefix = (pathname: string) => pathname.replace(/^\/(en|vi)(?=\/|$)/, '')

/** Public URL of a page in a language: `localePath('vi', '/about')` → `/vi/about`. */
export const localePath = (locale: Locale, path = '') =>
  locale === defaultLocale ? path || '/' : `/${locale}${path === '/' ? '' : path}`
