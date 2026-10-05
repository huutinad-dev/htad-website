'use client'

import { useEffect, useRef, useState } from 'react'

// Facebook's Page Plugin: an iframe showing the fanpage's latest posts, no API key needed.
// The plugin only accepts a fixed pixel size (width 180–500), so it fills its container and
// is sized once that container is visible — it may start out hidden (collapsed on mobile).
// If the visitor blocks Facebook embeds the frame stays empty, which is why the panel around
// it always carries a plain link to the page as well.
export function FacebookFeed({ pageUrl, title, locale }: { pageUrl: string; title: string; locale: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ width: number; height: number } | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(() => {
      if (!el.clientWidth || !el.clientHeight) return
      setSize({ width: Math.max(180, Math.min(500, Math.floor(el.clientWidth))), height: Math.floor(el.clientHeight) })
      // sized once: re-sizing would reload the feed and lose the visitor's scroll position
      observer.disconnect()
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const src =
    size &&
    `https://www.facebook.com/plugins/page.php?${new URLSearchParams({
      href: pageUrl,
      tabs: 'timeline',
      width: String(size.width),
      height: String(size.height),
      small_header: 'true',
      hide_cover: 'true',
      show_facepile: 'false',
      adapt_container_width: 'true',
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
    })}`

  return (
    // data-lenis-prevent: let the wheel scroll the feed instead of the page
    <div ref={ref} data-lenis-prevent className="h-full w-full">
      {src && (
        <iframe
          src={src}
          title={title}
          width={size.width}
          height={size.height}
          loading="lazy"
          className="mx-auto block border-0"
          allow="encrypted-media; picture-in-picture; web-share"
        />
      )}
    </div>
  )
}
