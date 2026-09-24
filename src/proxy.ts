import { NextResponse, type NextRequest } from 'next/server'

import { defaultLocale, isLocale, LOCALE_COOKIE } from './i18n/config'

const ONE_YEAR = 60 * 60 * 24 * 365

// URLs carry no language. The chosen language lives in a cookie (default English) and each
// request is rewritten internally to the `[locale]` route, e.g. `/about` → `/vi/about`.
// Old prefixed links (`/vi/about`, `/en/about`) redirect to the clean URL and set the cookie.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const [, first] = pathname.split('/')

  if (isLocale(first)) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(first.length + 1) || '/'
    const res = NextResponse.redirect(url, 307)
    res.cookies.set(LOCALE_COOKIE, first, { path: '/', maxAge: ONE_YEAR, sameSite: 'lax' })
    return res
  }

  const cookie = request.cookies.get(LOCALE_COOKIE)?.value ?? ''
  const locale = isLocale(cookie) ? cookie : defaultLocale
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  // Skip Payload (admin, API), Next internals and any file with an extension.
  matcher: ['/((?!admin|api|_next|.*\\..*).*)'],
}
