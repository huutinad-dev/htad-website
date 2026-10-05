'use client'

import { useState, type ReactNode } from 'react'

import type { Dictionary } from '@/lib/dictionary'

import { FanpagePanel } from './FanpagePanel'
import { Reveal } from './motion/Reveal'

type Props = {
  children: ReactNode
  fanpage: { url: string; label: string } | null
  locale: string
  labels: Pick<Dictionary, 'fanpageLive' | 'fanpageShow' | 'fanpageHide' | 'fanpageButton'>
}

/**
 * Body of the Insights page, under the page hero. Desktop: articles on the left and the
 * fanpage feed in a sticky right column, so the page title keeps the top to itself.
 * Collapsing the feed turns it into a small centred card above the articles, which then take
 * the full width. Phones always start with that small card; the feed opens in place on tap.
 */
export function InsightsLayout({ children, fanpage, locale, labels }: Props) {
  // null = default for the screen (open on desktop, collapsed on phones) until the visitor toggles
  const [open, setOpen] = useState<boolean | null>(null)
  const toggle = () =>
    setOpen((value) => (value === null ? !window.matchMedia('(min-width: 1024px)').matches : !value))
  const sidebar = Boolean(fanpage) && open !== false

  return (
    <div
      className={`container-x grid gap-x-14 gap-y-10 pb-24 md:pb-32 ${
        sidebar ? 'lg:grid-cols-[minmax(0,1fr)_24rem] xl:grid-cols-[minmax(0,1fr)_26rem]' : ''
      }`}
    >
      {fanpage && (
        <aside className={sidebar ? 'lg:col-start-2 lg:row-start-1' : 'mx-auto w-full max-w-md'}>
          <div className="lg:sticky lg:top-24">
            <Reveal delay={0.2} from="none">
              <FanpagePanel {...fanpage} locale={locale} labels={labels} open={open} onToggle={toggle} />
            </Reveal>
          </div>
        </aside>
      )}

      <section className={sidebar ? 'lg:col-start-1 lg:row-start-1' : ''}>{children}</section>
    </div>
  )
}
