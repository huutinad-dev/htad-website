import type React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Arrow } from '@/components/ArrowLink'
import { Img } from '@/components/Img'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import { PageHero } from '@/components/PageHero'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/lib/dictionary'
import { asMedia } from '@/lib/media'
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
  const website = c.website ? (c.website.startsWith('http') ? c.website : `https://${c.website}`) : null

  const rows = [
    c.phone && { icon: 'phone', label: dict.phone, value: c.phone, href: `tel:${c.phone.replace(/[^\d+]/g, '')}` },
    c.email && { icon: 'mail', label: dict.email, value: c.email, href: `mailto:${c.email}` },
    website && { icon: 'web', label: dict.website, value: c.website!, href: website, external: true },
    c.address && { icon: 'pin', label: dict.address, value: c.address, href: c.mapUrl || null, external: true },
  ].filter(Boolean) as { icon: IconName; label: string; value: string; href: string | null; external?: boolean }[]

  return (
    <>
      <PageHero title={home.cta?.heading || dict.contactUs} lead={home.cta?.text} />

      <section className="container-x pb-20 md:pb-40">
        <div className="grid gap-16 lg:grid-cols-12">
          {/* Mobile: compact tappable cards (icon · label/value · arrow on one row).
              Desktop: large editorial rows. */}
          <Stagger className="grid gap-3 md:gap-0 md:border-t md:border-line lg:col-span-8">
            {rows.map((row) => {
              const content = (
                <>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold md:hidden">
                    <ContactIcon name={row.icon} />
                  </span>
                  <span className="min-w-0 flex-1 md:flex md:items-start md:gap-8">
                    <span className="eyebrow block !text-white/40 md:w-32 md:shrink-0 md:pt-2">{row.label}</span>
                    <span className="mt-1 block break-words text-base font-semibold leading-snug transition-colors duration-300 group-hover:text-gold md:mt-0 md:flex-1 md:whitespace-pre-line md:text-4xl">
                      {row.value}
                    </span>
                  </span>
                  {row.href && (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-ink md:mt-1 md:h-11 md:w-11">
                      <Arrow className="-rotate-45" />
                    </span>
                  )}
                </>
              )
              const cls =
                'group flex items-center gap-4 rounded-2xl border border-line bg-surface/60 p-4 md:items-start md:gap-8 md:rounded-none md:border-0 md:border-b md:bg-transparent md:px-0 md:py-8'
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

          <Reveal from="right" className="hidden items-start justify-center lg:col-span-3 lg:col-start-10 lg:flex">
            <div className="relative aspect-[352/418] w-full max-w-[220px]">
              <Img media={asMedia(settings.logoStacked)} fit="contain" sizes="320px" />
            </div>
          </Reveal>
        </div>

        {c.mapUrl && (
          <Reveal className="mt-8 hidden md:block md:mt-10">
            <a href={c.mapUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-gold underline underline-offset-4 hover:text-white">
              {dict.openMap}
            </a>
          </Reveal>
        )}
      </section>
    </>
  )
}

type IconName = 'phone' | 'mail' | 'web' | 'pin'

function ContactIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    web: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
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
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths[name]}
    </svg>
  )
}
