import type React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Arrow } from '@/components/ArrowLink'
import { Stagger, StaggerItem } from '@/components/motion/Reveal'
import { PageHero } from '@/components/PageHero'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/lib/dictionary'
import { getHome, getSettings } from '@/lib/payload'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return { title: getDictionary(locale).contactUs }
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const [settings, home] = await Promise.all([getSettings(locale), getHome(locale)])
  const dict = getDictionary(locale)
  const c = settings.contact ?? {}

  const rows = [
    c.phone && { icon: 'phone', label: dict.phone, value: c.phone, href: `tel:${c.phone.replace(/[^\d+]/g, '')}` },
    c.email && { icon: 'mail', label: dict.email, value: c.email, href: `mailto:${c.email}` },
    c.address && { icon: 'pin', label: dict.address, value: c.address, href: c.mapUrl || null, external: true },
  ].filter(Boolean) as { icon: IconName; label: string; value: string; href: string | null; external?: boolean }[]

  return (
    <>
      <PageHero title={home.cta?.heading || dict.contactUs} lead={home.cta?.text} />

      <section className="container-x pb-20 md:pb-32">
        {/* Same cards on every screen: horizontal rows stacked on phones/tablets,
            3 vertical cards on desktop so values (email, address) never break mid-word. */}
        <Stagger className="mx-auto grid max-w-2xl gap-3 md:gap-4 lg:max-w-6xl lg:grid-cols-3 lg:gap-5">
          {rows.map((row) => {
            const content = (
              <>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold transition-colors duration-500 group-hover:bg-gold group-hover:text-ink md:h-14 md:w-14">
                  <ContactIcon name={row.icon} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="eyebrow block !text-white/40">{row.label}</span>
                  <span className="mt-1 block whitespace-pre-line break-words text-base font-semibold leading-snug transition-colors duration-300 group-hover:text-gold md:mt-2 md:text-xl lg:text-lg xl:text-xl">
                    {row.value}
                  </span>
                </span>
                {row.href && (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-ink md:h-11 md:w-11 lg:absolute lg:right-6 lg:top-6">
                    <Arrow className="-rotate-45" />
                  </span>
                )}
              </>
            )
            const cls =
              'group relative flex h-full items-center gap-4 rounded-2xl border border-line bg-surface/60 p-4 transition-colors duration-500 hover:border-gold/40 md:gap-5 md:p-6 lg:flex-col lg:items-start lg:p-8'
            return (
              <StaggerItem key={row.label}>
                {row.href ? (
                  <a href={row.href} {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className={cls}>
                    {content}
                  </a>
                ) : (
                  <div className={cls}>{content}</div>
                )}
              </StaggerItem>
            )
          })}
        </Stagger>
      </section>
    </>
  )
}

type IconName = 'phone' | 'mail' | 'pin'

function ContactIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    pin: (
      <>
        <path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z" />
        <circle cx="12" cy="9" r="2.5" />
      </>
    ),
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths[name]}
    </svg>
  )
}
