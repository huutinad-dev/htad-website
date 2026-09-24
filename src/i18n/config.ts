export const locales = ['en', 'vi'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value)

/**
 * The language is not part of the URL: it's remembered in this cookie (and mirrored to
 * localStorage). `src/proxy.ts` reads the cookie and rewrites `/about` to the `[locale]` route.
 */
export const LOCALE_COOKIE = 'htad-locale'

/** Public URL for a page. Kept as a helper so links stay in one place if URLs change again. */
/** `/vi/about` → `/about` (used when a pathname still carries the internal locale segment). */
export const stripLocalePrefix = (pathname: string) => pathname.replace(/^\/(en|vi)(?=\/|$)/, '')

export const localePath = (_locale: Locale, path = '') => path || '/'
