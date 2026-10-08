'use client'

import { useLenis } from 'lenis/react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { SafeImage as Image } from '@/components/SafeImage'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'

import { LOCALE_COOKIE, localePath, stripLocalePrefix, type Locale } from '@/i18n/config'
import type { Dictionary } from '@/lib/dictionary'

import { SocialLinks, type SocialLink } from './SocialLinks'

type Props = {
  locale: Locale
  dict: Dictionary
  logo: { src: string; alt: string } | null
  email?: string | null
  social: SocialLink[]
}

const EASE = [0.16, 1, 0.3, 1] as const

export function Header({ locale, dict, logo, email, social }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setSolid(y > 40)
    setHidden(y > 240 && y > prev)
  })

  const lenis = useLenis()
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (open) lenis?.stop()
    else lenis?.start()
  }, [open, lenis])

  const links = [
    { href: localePath(locale), label: dict.nav.home },
    { href: localePath(locale, `/projects`), label: dict.nav.projects },
    { href: localePath(locale, `/about`), label: dict.nav.about },
    { href: localePath(locale, `/services`), label: dict.nav.services },
    { href: localePath(locale, `/insights`), label: dict.nav.insights },
    { href: localePath(locale, `/contact`), label: dict.nav.contact },
  ]
  const router = useRouter()
  // keep the localStorage mirror in sync with the language the server actually rendered
  useEffect(() => {
    try {
      localStorage.setItem(LOCALE_COOKIE, locale)
    } catch {}
  }, [locale])
  // the page's path without its language (`/vi/about` → `/about`), to compare links and switch language
  const path = stripLocalePrefix(pathname) || '/'
  const isActive = (href: string) => {
    const target = stripLocalePrefix(href) || '/'
    return target === '/' ? path === '/' : path.startsWith(target)
  }
  // The other language is another URL (`/about` ↔ `/vi/about`), a server render away. Show the
  // choice at once (the toggle switches immediately and the page dims while the new text loads)
  // instead of a click that seems to do nothing for a moment.
  const [switching, startSwitch] = useTransition()
  const [pendingLocale, setPendingLocale] = useState<Locale | null>(null)
  const shownLocale = switching && pendingLocale ? pendingLocale : locale
  useEffect(() => {
    document.documentElement.toggleAttribute('data-switching-locale', switching)
  }, [switching])

  const switchTo = (target: Locale) => {
    if (target === locale || switching) return
    setPendingLocale(target)
    document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=31536000; samesite=lax`
    try {
      localStorage.setItem(LOCALE_COOKIE, target)
    } catch {
      // storage unavailable (private mode); the cookie is what the server uses
    }
    // same page, same filter (`?category=`), other language
    startSwitch(() => router.push(`${localePath(target, path)}${window.location.search}`, { scroll: false }))
  }

  return (
    <>
      <motion.header
        // the border is always there and only its colour changes: adding it on scroll made it
        // fade in from the default border colour (white), which flashed a white line
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${
          solid && !open ? 'border-white/5 bg-ink/80 backdrop-blur-md' : 'border-transparent bg-transparent'
        }`}
        animate={{ y: hidden && !open ? '-100%' : '0%' }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div className="container-x flex h-20 items-center justify-between">
          <Link href={localePath(locale)} className="relative z-10 block h-11 w-[142px] md:h-14 md:w-[165px]" aria-label="Home">
            {logo && <Image src={logo.src} alt={logo.alt} fill priority sizes="165px" className="object-contain object-left" />}
          </Link>

          <nav className="hidden items-center gap-9 lg:flex">
            {links.slice(1).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`group relative text-sm font-medium uppercase tracking-wider transition-colors ${
                  isActive(l.href) ? 'text-gold' : 'text-white/80 hover:text-white'
                }`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-gold transition-all duration-500 ${
                    isActive(l.href) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </nav>

          <div className="relative z-10 flex items-center gap-5">
            <div className="flex items-center gap-1 text-xs font-semibold tracking-wider">
              {(['en', 'vi'] as const).map((l, i) => (
                <span key={l} className="flex items-center gap-1">
                  {i > 0 && <span className="text-white/30">/</span>}
                  <button
                    type="button"
                    onClick={() => switchTo(l)}
                    className={l === shownLocale ? 'text-gold' : 'text-white/60 transition-colors hover:text-white'}
                    aria-pressed={l === shownLocale}
                    lang={l}
                  >
                    {l.toUpperCase()}
                  </button>
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-white/20 lg:hidden"
              aria-label={open ? dict.close : dict.menu}
              aria-expanded={open}
            >
              <span className={`h-px w-5 bg-white transition-transform duration-300 ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
              <span className={`h-px w-5 bg-white transition-transform duration-300 ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-5 pb-10 pt-28 lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <nav className="flex flex-col gap-2">
              {links.map((l, i) => (
                <span key={l.href} className="overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.2 + i * 0.06 }}
                  >
                    <Link
                      href={l.href}
                      className={`display block text-5xl ${isActive(l.href) ? 'text-gold' : 'text-white'}`}
                    >
                      {l.label}
                    </Link>
                  </motion.span>
                </span>
              ))}
            </nav>
            <motion.div
              className="space-y-5 text-sm text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <SocialLinks items={social} />
              {email && (
                <a href={`mailto:${email}`} className="block">
                  {email}
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
