import type { ReactNode } from 'react'

import type { Partner } from '@/payload-types'

// A partner's logo. If the partner has a link (Partners → Link in the CMS), the logo opens it.
export function PartnerLogo({ partner, children }: { partner: Partner; children: ReactNode }) {
  const href = partner.link?.trim()
  if (!href || !/^https?:\/\//i.test(href)) return <>{children}</>
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={partner.name}
      className="block transition-opacity duration-300 hover:opacity-70"
    >
      {children}
    </a>
  )
}
