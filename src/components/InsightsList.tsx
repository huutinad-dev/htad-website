'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { ReactNode } from 'react'

type Item = { id: number; type: string; card: ReactNode }

/**
 * Type filter + grid of posts. With no filter, `pinned` (the fanpage card) is the first cell,
 * two rows tall from tablet up, and the posts flow around and after it. Choosing a type shows
 * only posts of that type, without the pinned card.
 * Cards are rendered on the server and passed in.
 */
export function InsightsList({
  items,
  types,
  allLabel,
  emptyLabel,
  pinned,
}: {
  items: Item[]
  types: { slug: string; title: string }[]
  allLabel: string
  emptyLabel: string
  pinned?: ReactNode
}) {
  const router = useRouter()
  const params = useSearchParams()
  const active = params.get('category') ?? 'all'
  const visible = active === 'all' ? items : items.filter((i) => i.type === active)

  const select = (slug: string) => router.replace(slug === 'all' ? '?' : `?category=${slug}`, { scroll: false })
  const tabs = [{ slug: 'all', title: allLabel }, ...types.filter((t) => items.some((i) => i.type === t.slug))]

  return (
    <div>
      <div className="-mx-5 mb-12 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0 md:pb-0">
        {tabs.map((t) => (
          <button
            key={t.slug}
            type="button"
            onClick={() => select(t.slug)}
            className={`relative shrink-0 whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-medium transition-colors duration-300 ${
              active === t.slug ? 'border-gold text-ink' : 'border-white/15 text-white/70 hover:border-white/40 hover:text-white'
            }`}
          >
            {active === t.slug && (
              <motion.span
                layoutId="insight-filter"
                className="absolute inset-0 rounded-full bg-gold"
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            <span className="relative">{t.title}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
        {pinned && active === 'all' && <div className="md:row-span-2">{pinned}</div>}
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.06 }}
            >
              {item.card}
            </motion.div>
          ))}
        </AnimatePresence>
        {visible.length === 0 && <p className="self-center text-muted">{emptyLabel}</p>}
      </div>
    </div>
  )
}
