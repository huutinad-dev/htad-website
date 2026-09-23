'use client'

import { useLenis } from 'lenis/react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

// "Watch video" button that opens an embedded YouTube player in a modal.
export function VideoButton({ videoId, label, variant = 'pill' }: { videoId: string; label: string; variant?: 'pill' | 'round' }) {
  const [open, setOpen] = useState(false)
  const lenis = useLenis()

  useEffect(() => {
    if (!open) {
      lenis?.start()
      return
    }
    lenis?.stop()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, lenis])

  const play = (
    <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-px" fill="currentColor" aria-hidden>
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" />
    </svg>
  )

  return (
    <>
      {variant === 'round' ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={label}
          className="group relative flex h-24 w-24 items-center justify-center rounded-full bg-gold text-ink transition-transform duration-500 hover:scale-110"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-gold/40" />
          <span className="relative scale-150">{play}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group inline-flex items-center gap-3 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-ink transition-colors hover:bg-white"
        >
          {play}
          {label}
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal
          >
            <motion.div
              className="aspect-video w-full max-w-6xl overflow-hidden rounded-sm bg-black"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
                title={label}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </motion.div>
            <button
              type="button"
              aria-label="Close"
              className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white hover:border-gold hover:text-gold"
              onClick={() => setOpen(false)}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
