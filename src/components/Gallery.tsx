'use client'

import { useLenis } from 'lenis/react'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

export type GalleryImage = { src: string; alt: string; width?: number | null; height?: number | null }

// Masonry-style grid; click an image to open it in a lightbox (arrows / Esc / swipe-free buttons).
export function Gallery({ images, columns = 3 }: { images: GalleryImage[]; columns?: 2 | 3 }) {
  const [open, setOpen] = useState<number | null>(null)
  const lenis = useLenis()

  const close = useCallback(() => setOpen(null), [])
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + images.length) % images.length)),
    [images.length],
  )

  useEffect(() => {
    if (open === null) {
      lenis?.start()
      return
    }
    lenis?.stop()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close, step, lenis])

  if (!images.length) return null
  const current = open !== null ? images[open] : null

  return (
    <>
      <div className={`gap-4 ${columns === 3 ? 'columns-1 sm:columns-2 lg:columns-3' : 'columns-1 sm:columns-2'}`}>
        {images.map((img, i) => (
          <motion.button
            key={img.src}
            type="button"
            onClick={() => setOpen(i)}
            className="group relative mb-4 block w-full overflow-hidden rounded-sm bg-surface"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -5% 0px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: (i % columns) * 0.08 }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={img.width ?? 800}
              height={img.height ?? 600}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="h-auto w-full transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
            />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm md:p-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            role="dialog"
            aria-modal
          >
            <motion.div
              key={current.src}
              className="relative h-full w-full"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
            </motion.div>
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs tracking-widest text-white/60">
              {open! + 1} / {images.length}
            </p>
            <LightboxButton label="Close" className="right-4 top-4" onClick={close}>
              <path d="M6 6l12 12M18 6 6 18" />
            </LightboxButton>
            {images.length > 1 && (
              <>
                <LightboxButton label="Previous" className="left-4 top-1/2 -translate-y-1/2" onClick={() => step(-1)}>
                  <path d="m15 6-6 6 6 6" />
                </LightboxButton>
                <LightboxButton label="Next" className="right-4 top-1/2 -translate-y-1/2" onClick={() => step(1)}>
                  <path d="m9 6 6 6-6 6" />
                </LightboxButton>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function LightboxButton({
  label,
  className,
  onClick,
  children,
}: {
  label: string
  className: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`absolute flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-gold hover:text-gold ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        {children}
      </svg>
    </button>
  )
}
