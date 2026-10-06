import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Arrow } from '@/components/ArrowLink'
import { CtaBanner } from '@/components/CtaBanner'
import { Gallery } from '@/components/Gallery'
import { Img } from '@/components/Img'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import { PageHero } from '@/components/PageHero'
import { PartnerLogo } from '@/components/PartnerLogo'
import { ProjectCard } from '@/components/ProjectCard'
import { RichText } from '@/components/RichText'
import { isLocale, localePath } from '@/i18n/config'
import { getDictionary } from '@/lib/dictionary'
import { asMedia, asMediaList, asPartnerList, mediaSrc, toGallery } from '@/lib/media'
import { getHome, getService, getServices } from '@/lib/payload'
import type { Project } from '@/payload-types'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const service = await getService(locale, slug)
  if (!service) return {}
  const og = mediaSrc(asMedia(service.cover))
  return { title: service.title, description: service.excerpt, openGraph: og ? { images: [og] } : undefined }
}

export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const [service, services, home] = await Promise.all([getService(locale, slug), getServices(locale), getHome(locale)])
  if (!service) notFound()
  const dict = getDictionary(locale)

  const cover = asMedia(service.cover)
  const gallery = toGallery(asMediaList(service.gallery))
  const partners = asPartnerList(service.partners)
  const related = (service.relatedProjects ?? []).filter((p): p is Project => typeof p === 'object')
  const others = services.filter((s) => s.id !== service.id)

  return (
    <>
      <PageHero
        title={service.title}
        lead={service.headline || service.excerpt}
        image={cover}
      />

      <section className="container-x py-24 md:py-32">
        <div className="grid gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <RichText data={service.body} className="text-lg md:text-xl" />
          </Reveal>
          <div className="space-y-10 lg:col-span-4 lg:col-start-9">
            {!!service.highlights?.length && (
              <Stagger className="border-t border-line">
                {service.highlights.map((h) => (
                  <StaggerItem key={h.id} className="flex gap-4 border-b border-line py-5">
                    <span className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-gold" />
                    <span className="text-white/85">{h.text}</span>
                  </StaggerItem>
                ))}
              </Stagger>
            )}
            {partners.length > 0 && (
              <Reveal delay={0.1} className="flex flex-wrap items-center gap-8">
                {partners.map(({ partner, logo }) => (
                  <PartnerLogo key={partner.id} partner={partner}>
                    <div className="relative h-24 w-32">
                      <Img media={logo} fit="contain" sizes="128px" />
                    </div>
                  </PartnerLogo>
                ))}
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="container-x pb-24 md:pb-32">
          <Reveal>
            <p className="eyebrow mb-8">{dict.gallery}</p>
          </Reveal>
          <Gallery images={gallery} columns={gallery.length > 2 ? 3 : 2} />
          {service.galleryCaption && (
            <Reveal>
              <p className="mt-4 max-w-2xl text-sm italic text-muted">{service.galleryCaption}</p>
            </Reveal>
          )}
        </section>
      )}

      {related.length > 0 && (
        <section className="border-t border-line py-24 md:py-32">
          <div className="container-x">
            <Reveal>
              <h2 className="display mb-14 text-4xl text-gold md:text-6xl">{dict.relatedProjects}</h2>
            </Reveal>
            <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08}>
                  <ProjectCard project={p} locale={locale} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-line py-24">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow mb-8">{dict.otherServices}</p>
          </Reveal>
          <Stagger className="flex flex-wrap gap-3">
            {others.map((s) => (
              <StaggerItem key={s.id}>
                <Link
                  href={localePath(locale, `/services/${s.slug}`)}
                  className="group inline-flex items-center gap-3 rounded-full border border-white/15 px-6 py-3 transition-colors hover:border-gold hover:text-gold"
                >
                  {s.title}
                  <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CtaBanner heading={home.cta?.heading} text={home.cta?.text} href={localePath(locale, `/contact`)} dict={dict} />
    </>
  )
}
