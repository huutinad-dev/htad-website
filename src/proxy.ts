import { NextResponse, type NextRequest } from 'next/server'

import { defaultLocale, LOCALE_COOKIE, localePath, locales } from './i18n/config'

// Vietnamese URLs carry no language (`/about`) and are rewritten internally to the `[locale]`
// route (`/vi/about`); English URLs (`/en/about`) already match that route and are served as they are.
// - `/vi/...` is not a public URL: it redirects to the unprefixed one (also keeps links from when
//   Vietnamese lived under `/vi` working).
// - A visitor who picked English with the header switch (cookie) and opens an unprefixed URL is
//   sent to its `/en` version. Crawlers send no cookie, so each URL always shows one language.
const otherLocales = locales.filter((l) => l !== defaultLocale)

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const [, first] = pathname.split('/')
  const url = request.nextUrl.clone()

  if ((otherLocales as readonly string[]).includes(first)) return NextResponse.next()

  if (first === defaultLocale) {
    url.pathname = pathname.slice(first.length + 1) || '/'
    return NextResponse.redirect(url, 308)
  }

  const picked = otherLocales.find((l) => l === request.cookies.get(LOCALE_COOKIE)?.value)
  if (picked) {
    url.pathname = localePath(picked, pathname)
    return NextResponse.redirect(url, 307)
  }

  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  // Skip Payload (admin, API), Next internals and any file with an extension.
  matcher: ['/((?!admin|api|_next|.*\\..*).*)'],
}
