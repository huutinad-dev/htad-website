import type { Dictionary } from '@/lib/dictionary'

import { Arrow } from './ArrowLink'
import { FacebookFeed } from './FacebookFeed'
import { SocialIcon } from './SocialLinks'

type Props = {
  url: string
  label: string
  locale: string
  /** embed Facebook's live page feed (Site settings → Brand); otherwise a compact link card */
  feed: boolean
  labels: Pick<Dictionary, 'fanpageButton' | 'fanpageLead'>
}

// The fanpage as the pinned first "post" of the Insights list. With the feed on, the card has
// the page's live feed where a post has its cover image, and is two posts tall on wider
// screens. With it off (Facebook's plugin currently shows the page header but no posts), it is
// a post-sized card that links to the page.
export function FanpageCard({ url, label, locale, feed, labels }: Props) {
  const footer = (
    <div className="mt-5 flex items-end justify-between gap-6">
      <div className="min-w-0">
        <p className="eyebrow mb-3 flex items-center gap-2">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inset-0 animate-ping rounded-full bg-gold/70" />
            <span className="relative h-2 w-2 rounded-full bg-gold" />
          </span>
          Facebook
        </p>
        <h3 className="text-xl font-bold leading-snug transition-colors group-hover:text-gold md:text-2xl">{label}</h3>
        {!feed && <p className="mt-2 line-clamp-2 text-sm text-muted">{labels.fanpageLead}</p>}
      </div>
      <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-300 group-hover:border-gold group-hover:text-gold">
        {labels.fanpageButton}
        <Arrow className="-rotate-45 transition-transform duration-300 group-hover:translate-x-0.5" />
      </span>
    </div>
  )

  if (!feed)
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="group block">
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-sm bg-surface">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,color-mix(in_srgb,var(--color-gold)_18%,transparent),transparent_65%)] transition-opacity duration-500 group-hover:opacity-60" />
          <span className="relative flex h-24 w-24 items-center justify-center rounded-full border border-gold/40 text-gold transition-transform duration-[1.2s] ease-out-expo group-hover:scale-110">
            <SocialIcon url={url} className="h-10 w-10" />
          </span>
        </div>
        {footer}
      </a>
    )

  return (
    <div className="flex h-full flex-col">
      {/* the plugin has no dark theme: give it a clean white well, framed like a cover image */}
      <div className="relative min-h-[26rem] flex-1 overflow-hidden rounded-sm bg-white">
        <FacebookFeed pageUrl={url} title={label} locale={locale} />
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer" className="group block">
        {footer}
      </a>
    </div>
  )
}
