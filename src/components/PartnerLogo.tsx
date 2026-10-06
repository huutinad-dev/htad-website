import type { ReactNode } from 'react'

import type { Media } from '@/payload-types'

// A partner logo. If the image has a link set in the CMS (Media → Link), the logo opens it.
export function PartnerLogo({ media, children }: { media: Media; children: ReactNode }) {
  const href = media.link?.trim()
  if (!href || !/^https?:\/\//i.test(href)) return <>{children}</>
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={media.alt}
      className="block transition-opacity duration-300 hover:opacity-70"
    >
      {children}
    </a>
  )
}
