import { NextResponse, type NextRequest } from 'next/server'

import { defaultLocale, LOCALE_COOKIE, localePath } from './i18n/config'

// English URLs carry no language (`/about`) and are rewritten internally to the `[locale]` route
// (`/en/about`); Vietnamese URLs (`/vi/about`) already match that route and are served as they are.
// - `/en/...` is not a public URL: it redirects to the unprefixed one.
// - A visitor who picked Vietnamese with the header switch (cookie) and opens an unprefixed URL is
//   sent to its `/vi` version. Crawlers send no cookie, so each URL always shows one language.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const [, first] = pathname.split('/')
  const url = request.nextUrl.clone()

  if (first === 'vi') return NextResponse.next()

  if (first === defaultLocale) {
    url.pathname = pathname.slice(first.length + 1) || '/'
    return NextResponse.redirect(url, 308)
  }

  if (request.cookies.get(LOCALE_COOKIE)?.value === 'vi') {
    url.pathname = localePath('vi', pathname)
    return NextResponse.redirect(url, 307)
  }

  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  // Skip Payload (admin, API), Next internals and any file with an extension.
  matcher: ['/((?!admin|api|_next|.*\\..*).*)'],
}
