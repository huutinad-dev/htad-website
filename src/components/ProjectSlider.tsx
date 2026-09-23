'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState, type ReactNode } from 'react'

import { Arrow } from './ArrowLink'

// Draggable carousel of (server-rendered) project cards with arrows and a progress bar.
// The viewport is clipped at the content's left edge but extends to the right edge of the screen,
// so upcoming cards peek in from the right.
export function ProjectSlider({
  slides,
  labels,
}: {
  slides: ReactNode[]
  labels: { prev: string; next: string }
}) {
  const [viewportRef, api] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps', skipSnaps: true })
  const [progress, setProgress] = useState(0)
  const [snaps, setSnaps] = useState(slides.length)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const sync = useCallback(() => {
    if (!api) return
    setProgress(Math.max(0, Math.min(1, api.scrollProgress())))
    setSnaps(api.scrollSnapList().length)
    setCanPrev(api.canScrollPrev())
    setCanNext(api.canScrollNext())
  }, [api])

  useEffect(() => {
    if (!api) return
    sync()
    api.on('scroll', sync).on('reInit', sync).on('select', sync)
    return () => {
      api.off('scroll', sync).off('reInit', sync).off('select', sync)
    }
  }, [api, sync])

  return (
    <div>
      {/* Block native image/link dragging so mouse drags reach the carousel */}
      <div
        ref={viewportRef}
        className="mr-[calc(50%-50vw)] cursor-grab select-none overflow-hidden active:cursor-grabbing [&_a]:[-webkit-user-drag:none] [&_img]:[-webkit-user-drag:none]"
        onDragStart={(e) => e.preventDefault()}
      >
        <div className="flex touch-pan-y gap-5 md:gap-8">
          {slides.map((slide, i) => (
            <div key={i} className="min-w-0 shrink-0 basis-[85%] sm:basis-[60%] lg:basis-[40%]">
              {slide}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 flex items-center gap-6">
        <div className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-line">
          <span
            className="absolute inset-y-0 rounded-full bg-gold"
            style={{ width: `${100 / snaps}%`, left: `${progress * (100 - 100 / snaps)}%` }}
          />
        </div>
        <div className="flex gap-2">
          <SliderButton label={labels.prev} disabled={!canPrev} onClick={() => api?.scrollPrev()}>
            <Arrow className="rotate-180" />
          </SliderButton>
          <SliderButton label={labels.next} disabled={!canNext} onClick={() => api?.scrollNext()}>
            <Arrow />
          </SliderButton>
        </div>
      </div>
    </div>
  )
}

function SliderButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-ink disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  )
}
