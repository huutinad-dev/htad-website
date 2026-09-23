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
    c.phone && { label: dict.phone, value: c.phone, href: `tel:${c.phone.replace(/[^\d+]/g, '')}` },
    c.email && { label: dict.email, value: c.email, href: `mailto:${c.email}` },
    website && { label: dict.website, value: c.website!, href: website, external: true },
    c.address && { label: dict.address, value: c.address, href: c.mapUrl || null, external: true },
  ].filter(Boolean) as { label: string; value: string; href: string | null; external?: boolean }[]

  return (
    <>
      <PageHero title={home.cta?.heading || dict.contactUs} lead={home.cta?.text} />

      <section className="container-x pb-28 md:pb-40">
        <div className="grid gap-16 lg:grid-cols-12">
          <Stagger className="border-t border-line lg:col-span-8">
            {rows.map((row) => {
              const content = (
                <>
                  <span className="eyebrow w-32 shrink-0 pt-2 !text-white/40">{row.label}</span>
                  <span className="flex-1 whitespace-pre-line text-2xl font-semibold leading-snug transition-colors duration-300 group-hover:text-gold md:text-4xl">
                    {row.value}
                  </span>
                  {row.href && (
                    <span className="mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                      <Arrow className="-rotate-45" />
                    </span>
                  )}
                </>
              )
              return (
                <StaggerItem key={row.label} className="border-b border-line">
                  {row.href ? (
                    <a
                      href={row.href}
                      {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="group flex flex-col gap-3 py-8 md:flex-row md:items-start md:gap-8"
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="group flex flex-col gap-3 py-8 md:flex-row md:items-start md:gap-8">{content}</div>
                  )}
                </StaggerItem>
              )
            })}
          </Stagger>

          <Reveal from="right" className="flex items-start justify-center lg:col-span-3 lg:col-start-10">
            <div className="relative aspect-[352/418] w-full max-w-[220px]">
              <Img media={asMedia(settings.logoStacked)} fit="contain" sizes="320px" />
            </div>
          </Reveal>
        </div>

        {c.mapUrl && (
          <Reveal className="mt-10">
            <a href={c.mapUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-gold underline underline-offset-4 hover:text-white">
              {dict.openMap}
            </a>
          </Reveal>
        )}
      </section>
    </>
  )
}
