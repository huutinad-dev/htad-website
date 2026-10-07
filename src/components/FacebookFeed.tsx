'use client'

import { useEffect, useRef, useState } from 'react'

type Size = { width: number; height: number }

// Height of the plugin's small page header. Facebook currently renders it broken (an empty box
// over a clipped page name), and the card already names the page, so the frame is made this much
// taller and shifted up to hide it inside the card's overflow-hidden well.
const HEADER = 70

// Facebook's Page Plugin: an iframe showing the fanpage's latest posts, no API key needed.
// The plugin only accepts a fixed pixel size (width 180–500), so it is sized to its container
// and re-sized when the container changes noticeably. If the visitor blocks Facebook embeds
// the frame stays empty, which is why the card around it always links to the page as well.
export function FacebookFeed({ pageUrl, title, locale }: { pageUrl: string; title: string; locale: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<Size | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let timer: ReturnType<typeof setTimeout>
    const measure = () => {
      if (!el.clientWidth || !el.clientHeight) return
      const next = { width: Math.max(180, Math.min(500, Math.floor(el.clientWidth))), height: Math.floor(el.clientHeight) }
      // a new size reloads the feed, so ignore small shifts
      setSize((prev) => (prev && Math.abs(prev.width - next.width) < 24 && Math.abs(prev.height - next.height) < 48 ? prev : next))
    }
    const observer = new ResizeObserver(() => {
      clearTimeout(timer)
      timer = setTimeout(measure, 250)
    })
    observer.observe(el)
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  const src =
    size &&
    `https://www.facebook.com/plugins/page.php?${new URLSearchParams({
      href: pageUrl,
      tabs: 'timeline',
      width: String(size.width),
      height: String(size.height + HEADER),
      small_header: 'true',
      hide_cover: 'true',
      show_facepile: 'false',
      adapt_container_width: 'true',
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
    })}`

  return (
    // data-lenis-prevent: let the wheel scroll the feed instead of the page
    <div ref={ref} data-lenis-prevent className="absolute inset-0">
      {src && (
        <iframe
          src={src}
          title={title}
          width={size.width}
          height={size.height + HEADER}
          loading="lazy"
          className="mx-auto block border-0"
          style={{ marginTop: -HEADER }}
          allow="encrypted-media; picture-in-picture; web-share"
        />
      )}
    </div>
  )
}
