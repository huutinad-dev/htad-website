'use client'

import { AnimatePresence, motion } from 'motion/react'
import { SafeImage as Image } from '@/components/SafeImage'
import { useEffect, useState } from 'react'

type Slide = { src: string; alt: string }

// Full-bleed crossfading background with a slow Ken Burns zoom.
export function HeroSlider({ slides, interval = 6000 }: { slides: Slide[]; interval?: number }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), interval)
    return () => clearInterval(id)
  }, [slides.length, interval])

  const slide = slides[index]
  if (!slide) return null

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.src}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className="animate-kenburns object-cover"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/50 to-ink" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-transparent" />

      {slides.length > 1 && (
        <div className="absolute bottom-10 right-5 z-10 flex gap-2 md:right-10">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className="relative h-0.5 w-10 overflow-hidden bg-white/25"
            >
              {i === index && (
                <motion.span
                  className="absolute inset-y-0 left-0 bg-gold"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: interval / 1000, ease: 'linear' }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
