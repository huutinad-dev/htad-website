'use client'

import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { Arrow } from './ArrowLink'

type Item = { href: string; title: string; excerpt: string; image: { src: string; alt: string } | null }

// Index-style list: hovering a row swaps the sticky preview image on desktop.
export function ServiceList({ items }: { items: Item[] }) {
  // `active` drives the highlighted row (none once the pointer leaves the list);
  // `preview` keeps the last hovered image so the frame never goes empty.
  const [active, setActive] = useState<number | null>(null)
  const [preview, setPreview] = useState(0)
  const image = items[preview]?.image

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <ul className="border-t border-line lg:col-span-7" onMouseLeave={() => setActive(null)}>
        {items.map((item, i) => (
          <motion.li
            key={item.href}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
            className="border-b border-line"
            onMouseEnter={() => {
              setActive(i)
              setPreview(i)
            }}
          >
            <Link href={item.href} className="group flex items-start gap-6 py-7 md:gap-10">
              <span className="display w-10 shrink-0 pt-0.5 text-2xl text-gold md:w-14 md:text-4xl">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="flex-1">
                <span
                  className={`block text-2xl font-bold transition-all duration-500 md:text-4xl ${
                    active === i ? 'text-white lg:translate-x-3' : active === null ? 'text-white' : 'text-white lg:text-white/60'
                  }`}
                >
                  {item.title}
                </span>
                <AnimatePresence initial={false}>
                  {active === i && (
                    <motion.span
                      className="hidden overflow-hidden lg:block"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <span className="block max-w-xl pt-3 text-sm leading-relaxed text-muted lg:translate-x-3">
                        {item.excerpt}
                      </span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              <span className="mt-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                <Arrow className="-rotate-45 transition-transform duration-500 group-hover:rotate-0" />
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>

      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-28 aspect-[4/5] overflow-hidden rounded-sm bg-surface">
          <AnimatePresence initial={false}>
            {image && (
              <motion.div
                key={image.src}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image src={image.src} alt={image.alt} fill sizes="40vw" className="object-cover" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
