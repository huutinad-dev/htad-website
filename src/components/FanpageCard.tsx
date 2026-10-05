import type { Dictionary } from '@/lib/dictionary'

import { Arrow } from './ArrowLink'
import { FacebookFeed } from './FacebookFeed'

type Props = {
  url: string
  label: string
  locale: string
  labels: Pick<Dictionary, 'fanpageLive' | 'fanpageButton'>
}

// The fanpage as the pinned first "post" of the Insights list: where a post has its cover
// image, this card has the page's live feed. It is two posts tall on wider screens.
export function FanpageCard({ url, label, locale, labels }: Props) {
  return (
    <div className="flex h-full flex-col">
      {/* the plugin has no dark theme: give it a clean white well, framed like a cover image */}
      <div className="relative min-h-[26rem] flex-1 overflow-hidden rounded-sm bg-white">
        <FacebookFeed pageUrl={url} title={label} locale={locale} />
      </div>
      <div className="mt-5 flex items-end justify-between gap-6">
        <div className="min-w-0">
          <p className="eyebrow mb-3 flex items-center gap-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inset-0 animate-ping rounded-full bg-gold/70" />
              <span className="relative h-2 w-2 rounded-full bg-gold" />
            </span>
            Facebook
            <span className="text-white/30">·</span>
            <span className="truncate text-white/50">{labels.fanpageLive}</span>
          </p>
          <h3 className="text-xl font-bold leading-snug md:text-2xl">{label}</h3>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-300 hover:border-gold hover:text-gold"
        >
          {labels.fanpageButton}
          <Arrow className="-rotate-45 transition-transform duration-300 group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  )
}
