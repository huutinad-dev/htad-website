'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { ReactNode } from 'react'

import { projectCell, projectColumnClass, projectColumnsClass, splitColumns } from './ProjectCard'

type Item = { id: number; categorySlug: string; card: ReactNode }

// Category filter with animated re-layout. Cards are rendered on the server and passed in.
export function ProjectGrid({
  items,
  categories,
  allLabel,
}: {
  items: Item[]
  categories: { slug: string; title: string }[]
  allLabel: string
}) {
  const router = useRouter()
  const params = useSearchParams()
  const active = params.get('category') ?? 'all'
  const visible = active === 'all' ? items : items.filter((i) => i.categorySlug === active)

  const select = (slug: string) => {
    const url = slug === 'all' ? '?' : `?category=${slug}`
    router.replace(url, { scroll: false })
  }

  const tabs = [{ slug: 'all', title: allLabel }, ...categories.filter((c) => items.some((i) => i.categorySlug === c.slug))]

  return (
    <div>
      <div className="-mx-5 mb-14 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0 md:pb-0">
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
                layoutId="project-filter"
                className="absolute inset-0 rounded-full bg-gold"
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            <span className="relative">{t.title}</span>
          </button>
        ))}
      </div>

      <div className={projectColumnsClass}>
        {splitColumns(visible.map((item, i) => ({ item, i }))).map((column, col) => (
          <div key={col} className={projectColumnClass(col)}>
            <AnimatePresence mode="popLayout" initial={false}>
              {column.map(({ item, i }) => (
                <motion.div
                  key={item.id}
                  layout
                  {...projectCell(i)}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: col * 0.08 }}
                >
                  {item.card}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}
