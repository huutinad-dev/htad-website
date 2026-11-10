export const locales = ['en', 'vi'] as const
export type Locale = (typeof locales)[number]
/** The site's language: Vietnamese, at unprefixed URLs (`/about`). */
export const defaultLocale: Locale = 'vi'
/**
 * Payload's default (and fallback) content locale. Kept English, as the content was written:
 * changing it would change which language empty fields fall back to and what the admin opens in.
 */
export const contentDefaultLocale: Locale = 'en'

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value)

/**
 * Vietnamese, the default, has unprefixed URLs (`/about`); English lives under `/en` (`/en/about`),
 * so each language has its own URL that search engines can index. `src/proxy.ts` rewrites
 * unprefixed URLs to the `[locale]` route as `vi`. A language picked with the header switch is
 * remembered in this cookie, and an unprefixed URL then redirects to its `/en` version.
 */
export const LOCALE_COOKIE = 'htad-locale'

/** `/en/about` → `/about` (also strips the internal `/vi` segment a rewritten pathname may carry). */
export const stripLocalePrefix = (pathname: string) => pathname.replace(/^\/(en|vi)(?=\/|$)/, '')

/** Public URL of a page in a language: `localePath('en', '/about')` → `/en/about`. */
export const localePath = (locale: Locale, path = '') =>
  locale === defaultLocale ? path || '/' : `/${locale}${path === '/' ? '' : path}`
