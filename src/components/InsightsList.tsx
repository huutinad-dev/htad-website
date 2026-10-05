'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { ReactNode } from 'react'

type Item = { id: number; type: string; featured: ReactNode; card: ReactNode }

const EASE = [0.16, 1, 0.3, 1] as const

// Type filter + list: the newest post leads as a large card, the rest follow in a grid.
// Cards are rendered on the server and passed in.
export function InsightsList({
  items,
  types,
  allLabel,
}: {
  items: Item[]
  types: { slug: string; title: string }[]
  allLabel: string
}) {
  const router = useRouter()
  const params = useSearchParams()
  const active = params.get('category') ?? 'all'
  const [first, ...rest] = active === 'all' ? items : items.filter((i) => i.type === active)

  const select = (slug: string) => router.replace(slug === 'all' ? '?' : `?category=${slug}`, { scroll: false })
  const tabs = [{ slug: 'all', title: allLabel }, ...types.filter((t) => items.some((i) => i.type === t.slug))]

  return (
    // a container: the cards lay out by the width of this list, not of the viewport
    <div className="@container">
      <div className="-mx-5 mb-10 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
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

      <AnimatePresence mode="popLayout" initial={false}>
        {first && (
          <motion.div
            key={`featured-${first.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {first.featured}
          </motion.div>
        )}
      </AnimatePresence>

      {rest.length > 0 && (
        <div className="mt-12 grid gap-x-8 gap-y-12 border-t border-line pt-12 sm:grid-cols-2 @5xl:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {rest.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.6, ease: EASE, delay: (i % 2) * 0.08 }}
              >
                {item.card}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
