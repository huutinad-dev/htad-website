'use client'

import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { Arrow } from './ArrowLink'
import { ProjectSlider } from './ProjectSlider'

type Item = {
  href: string
  title: string
  excerpt: string
  image: { src: string; alt: string } | null
}

// Desktop: index-style list where hovering a row swaps the preview image beside it.
// Mobile/tablet: a swipeable slider of image cards (a long list is hard to scan on a phone).
export function ServiceList({
  items,
  labels,
}: {
  items: Item[]
  labels: { prev: string; next: string }
}) {
  // `active` drives the highlighted row (none once the pointer leaves the list);
  // `preview` keeps the last hovered image so the frame never goes empty.
  const [active, setActive] = useState<number | null>(null)
  const [preview, setPreview] = useState(0)
  const image = items[preview]?.image

  // The preview is exactly as tall as the list at rest, so it sits still while the page scrolls.
  // Hovering a row opens its excerpt and makes the list taller, so it is only measured while
  // no excerpt is open: the image doesn't resize under the pointer.
  const listRef = useRef<HTMLUListElement>(null)
  const [restHeight, setRestHeight] = useState<number | null>(null)
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const measure = () => {
      if (list.querySelector('[data-excerpt]')) return
      const next = list.offsetHeight
      if (next > 0) setRestHeight(next)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div className="lg:hidden">
        <ProjectSlider
          labels={labels}
          slides={items.map((item, i) => (
            <ServiceCard key={item.href} item={item} index={i} />
          ))}
        />
      </div>
      <div className="hidden gap-12 lg:grid lg:grid-cols-12">
        <ul ref={listRef} className="self-start border-t border-line lg:col-span-7" onMouseLeave={() => setActive(null)}>
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
                      active === i
                        ? 'text-white lg:translate-x-3'
                        : active === null
                          ? 'text-white'
                          : 'text-white lg:text-white/60'
                    }`}
                  >
                    {item.title}
                  </span>
                  <AnimatePresence initial={false}>
                    {active === i && (
                      <motion.span
                        data-excerpt
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
          <div
            className={`relative overflow-hidden rounded-sm bg-surface ${restHeight ? '' : 'aspect-[4/5]'}`}
            style={restHeight ? { height: restHeight } : undefined}
          >
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
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="40vw"
                    className="object-cover"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  )
}

function ServiceCard({ item, index }: { item: Item; index: number }) {
  return (
    <Link
      href={item.href}
      className="group relative block aspect-[4/5] overflow-hidden rounded-sm bg-surface"
    >
      {item.image && (
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes="(min-width: 640px) 60vw, 85vw"
          className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      <span className="display absolute left-5 top-5 text-3xl text-gold">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
        <h3 className="text-2xl font-bold leading-tight text-white">{item.title}</h3>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold text-ink">
          <Arrow className="-rotate-45" />
        </span>
      </div>
    </Link>
  )
}
