'use client'

import { useEffect, useRef, useState } from 'react'

const HEIGHT = 640

// Facebook's Page Plugin: an iframe showing the fanpage's latest posts, no API key needed.
// The plugin only accepts a fixed pixel width (180–500), so it is sized to its container
// once mounted. If the visitor blocks Facebook embeds the frame stays empty, which is why
// the section around it always carries a plain link to the page as well.
export function FacebookFeed({ pageUrl, title, locale }: { pageUrl: string; title: string; locale: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number | null>(null)

  useEffect(() => {
    if (ref.current) setWidth(Math.max(180, Math.min(500, Math.floor(ref.current.clientWidth))))
  }, [])

  const src =
    width &&
    `https://www.facebook.com/plugins/page.php?${new URLSearchParams({
      href: pageUrl,
      tabs: 'timeline',
      width: String(width),
      height: String(HEIGHT),
      small_header: 'true',
      hide_cover: 'false',
      show_facepile: 'false',
      adapt_container_width: 'true',
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
    })}`

  return (
    // data-lenis-prevent: let the wheel scroll the feed instead of the page
    <div ref={ref} data-lenis-prevent className="mx-auto w-full max-w-[500px] overflow-hidden rounded-sm bg-surface" style={{ height: HEIGHT }}>
      {src && (
        <iframe
          src={src}
          title={title}
          width={width}
          height={HEIGHT}
          loading="lazy"
          className="mx-auto block border-0"
          allow="encrypted-media; picture-in-picture; web-share"
        />
      )}
    </div>
  )
}
