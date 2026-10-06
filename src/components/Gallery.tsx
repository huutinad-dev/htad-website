'use client'

import { useLenis } from 'lenis/react'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

export type GalleryImage = { src: string; alt: string; width?: number | null; height?: number | null }

export type GalleryLayout = 'landscape' | 'portrait'

// Columns per layout: wide images get fewer, wider columns; tall images more, narrower ones.
const COLUMNS: Record<GalleryLayout, string> = {
  landscape: 'columns-1 sm:columns-2 lg:columns-3',
  portrait: 'columns-2 md:columns-3 lg:columns-4',
}

// Masonry gallery: every image in its own proportions (nothing is cropped), stacked in columns.
// The layout (chosen per project in the admin) sets the number of columns. Click an image to
// open it in a lightbox with a thumbnail strip (arrows / Esc / buttons).
export function Gallery({ images, layout = 'landscape' }: { images: GalleryImage[]; layout?: GalleryLayout }) {
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

  const gridSizes =
    layout === 'portrait'
      ? '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw'
      : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'

  // ref callback for the current thumbnail
  const scrollThumbIntoView = (el: HTMLButtonElement | null) =>
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })

  if (!images.length) return null
  const current = open !== null ? images[open] : null

  return (
    <>
      <div className={`gap-2 md:gap-3 ${COLUMNS[layout]}`}>
        {images.map((img, i) => {
          const ratio = img.width && img.height ? img.width / img.height : 4 / 3
          return (
            <motion.button
              key={img.src}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={img.alt || `${i + 1} / ${images.length}`}
              className="group relative mb-2 block w-full break-inside-avoid overflow-hidden rounded-sm bg-surface md:mb-3"
              style={{ aspectRatio: ratio }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -5% 0px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.08 }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes={gridSizes}
                className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/30" />
              <span className="absolute right-3 top-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-gold text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M15 4h5v5M9 20H4v-5M20 4l-6 6M4 20l6-6" />
                </svg>
              </span>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-ink/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            role="dialog"
            aria-modal
          >
            <div className="relative min-h-0 flex-1 p-4 pb-2 md:px-20 md:pt-16">
              <motion.div
                key={current.src}
                className="relative h-full w-full"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* the grid's copy of this image is already in the browser cache (same sizes, so the
                    same file is picked): it shows at once, and the sharp copy fades in over it */}
                <Image src={current.src} alt="" fill sizes={gridSizes} className="object-contain" />
                <LightboxImage key={current.src} src={current.src} alt={current.alt} />
              </motion.div>
            </div>

            {/* the images either side load in the background, so the arrows switch instantly */}
            <div aria-hidden className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0">
              {[-1, 1].map((d) => {
                const img = images[(open! + d + images.length) % images.length]
                return img === current ? null : (
                  <div key={img.src} className="relative h-px w-px">
                    <Image src={img.src} alt="" fill sizes={LIGHTBOX_SIZES} loading="eager" />
                  </div>
                )
              })}
            </div>

            {/* thumbnail strip: jump to any image; the current one is outlined and kept in view */}
            {images.length > 1 && (
              <div
                data-lenis-prevent
                className="flex shrink-0 gap-2 overflow-x-auto px-4 pb-2 pt-2 [scrollbar-width:none] md:justify-center-safe"
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((img, i) => (
                  <button
                    key={img.src}
                    type="button"
                    ref={i === open ? scrollThumbIntoView : undefined}
                    aria-label={`${i + 1} / ${images.length}`}
                    aria-current={i === open}
                    onClick={() => setOpen(i)}
                    className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-sm transition-opacity duration-300 md:h-16 md:w-24 ${
                      i === open ? 'opacity-100 outline outline-2 outline-offset-2 outline-gold' : 'opacity-40 hover:opacity-80'
                    }`}
                  >
                    <Image src={img.src} alt="" fill sizes="96px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
            <p className="shrink-0 pb-4 pt-1 text-center text-xs tracking-widest text-white/60">
              {open! + 1} / {images.length}
            </p>
            <LightboxButton label="Close" className="right-4 top-4" onClick={close}>
              <path d="M6 6l12 12M18 6 6 18" />
            </LightboxButton>
            {images.length > 1 && (
              <>
                <LightboxButton label="Previous" className="left-4 top-[45%] -translate-y-1/2" onClick={() => step(-1)}>
                  <path d="m15 6-6 6 6 6" />
                </LightboxButton>
                <LightboxButton label="Next" className="right-4 top-[45%] -translate-y-1/2" onClick={() => step(1)}>
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

// Lightbox width: the image box, not the whole screen (smaller files than '100vw' on large displays)
const LIGHTBOX_SIZES = '(min-width: 768px) calc(100vw - 10rem), 100vw'

// The full-size image of the lightbox, transparent until it has loaded.
function LightboxImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={LIGHTBOX_SIZES}
      priority
      onLoad={() => setLoaded(true)}
      className={`object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
    />
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
