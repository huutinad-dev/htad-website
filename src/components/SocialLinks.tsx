import type React from 'react'

export type SocialLink = { label: string; url: string }
type Network = 'facebook' | 'youtube' | 'instagram' | 'tiktok' | 'linkedin' | 'link'

export const socialNetwork = (url: string): Network => {
  const host = url.toLowerCase()
  if (host.includes('facebook.com') || host.includes('fb.com')) return 'facebook'
  if (host.includes('youtube.com') || host.includes('youtu.be')) return 'youtube'
  if (host.includes('instagram.com')) return 'instagram'
  if (host.includes('tiktok.com')) return 'tiktok'
  if (host.includes('linkedin.com')) return 'linkedin'
  return 'link'
}

const paths: Record<Network, React.ReactNode> = {
  facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v7h4v-7h3l1-4h-4V8Z" />,
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10 9 5 3-5 3V9Z" fill="currentColor" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </>
  ),
  tiktok: <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.4 2.6 2.2 4.4 5 4.6" />,
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10v6M8 7.5v.01M12 16v-6M12 13a2.5 2.5 0 0 1 5 0v3" />
    </>
  ),
  link: <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />,
}

export function SocialIcon({ url, className = 'h-5 w-5' }: { url: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths[socialNetwork(url)]}
    </svg>
  )
}

// Round icon buttons with the label as tooltip / accessible name.
export function SocialLinks({ items, className = '' }: { items: SocialLink[]; className?: string }) {
  if (!items.length) return null
  return (
    <ul className={`flex flex-wrap gap-3 ${className}`}>
      {items.map((s) => (
        <li key={s.url}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            title={s.label}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-ink"
          >
            <SocialIcon url={s.url} />
          </a>
        </li>
      ))}
    </ul>
  )
}
