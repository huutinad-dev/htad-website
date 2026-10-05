'use client'

import type { Dictionary } from '@/lib/dictionary'

import { Arrow } from './ArrowLink'
import { FacebookFeed } from './FacebookFeed'
import { SocialIcon } from './SocialLinks'

type Props = {
  url: string
  label: string
  locale: string
  labels: Pick<Dictionary, 'fanpageLive' | 'fanpageShow' | 'fanpageHide' | 'fanpageButton'>
  /** `null` = the default for the screen: open on desktop, collapsed on phones. */
  open: boolean | null
  onToggle: () => void
}

// The fanpage and its latest posts, as a card that opens and collapses.
export function FanpagePanel({ url, label, locale, labels, open, onToggle }: Props) {
  // classes per state; the default state is the only one that depends on the breakpoint
  const feed = open === null ? 'hidden lg:block' : open ? 'block' : 'hidden'
  const chevron = open === null ? 'lg:rotate-180' : open ? 'rotate-180' : ''

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface">
      <div className="flex items-center gap-3 p-4">
        <button type="button" onClick={onToggle} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold text-ink">
            <SocialIcon url={url} />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-semibold leading-tight">{label}</span>
            <span className="mt-1 flex items-center gap-2 text-xs text-muted">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inset-0 animate-ping rounded-full bg-gold/70" />
                <span className="relative h-2 w-2 rounded-full bg-gold" />
              </span>
              {open === null ? (
                <>
                  <span className="truncate lg:hidden">{labels.fanpageShow}</span>
                  <span className="hidden truncate lg:inline">{labels.fanpageLive}</span>
                </>
              ) : (
                <span className="truncate">{open ? labels.fanpageLive : labels.fanpageShow}</span>
              )}
            </span>
          </span>
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group hidden shrink-0 items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-300 hover:border-gold hover:text-gold lg:inline-flex"
        >
          {labels.fanpageButton}
          <Arrow className="-rotate-45 transition-transform duration-300 group-hover:translate-x-0.5" />
        </a>
        <button
          type="button"
          onClick={onToggle}
          aria-label={open === false ? labels.fanpageShow : labels.fanpageHide}
          title={open === false ? labels.fanpageShow : labels.fanpageHide}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors duration-300 hover:border-gold hover:text-gold"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className={`h-4 w-4 transition-transform duration-300 ${chevron}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>

      <div className={`${feed} border-t border-white/10`}>
        {/* the plugin has no dark theme: give it a clean white well instead of fighting it */}
        <div className="h-[520px] bg-white lg:h-[min(34rem,calc(100svh-15rem))]">
          <FacebookFeed pageUrl={url} title={label} locale={locale} />
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center gap-2 border-t border-white/10 px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-gold transition-colors duration-300 hover:bg-gold hover:text-ink lg:hidden"
        >
          {labels.fanpageButton}
          <Arrow className="-rotate-45" />
        </a>
      </div>
    </div>
  )
}
