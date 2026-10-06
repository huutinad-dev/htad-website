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
import { asMedia, asMediaList, asPartnerList, hasRichText, mediaSrc, toGallery } from '@/lib/media'
import { getHome, getService, getServices } from '@/lib/payload'
import type { Project } from '@/payload-types'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const service = await getService(locale, slug)
  if (!service) return {}
  const og = mediaSrc(asMedia(service.cover))
  return {
    title: service.title,
    description: service.excerpt,
    openGraph: og ? { images: [og] } : undefined,
  }
}

export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const [service, services, home] = await Promise.all([
    getService(locale, slug),
    getServices(locale),
    getHome(locale),
  ])
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
        // the excerpt repeats the opening of the body, so it only leads when there is no body
        lead={service.headline || (hasRichText(service.body) ? undefined : service.excerpt)}
        image={cover}
      />

      {/* Intro: one centred reading column */}
      {hasRichText(service.body) && (
        <section className="container-x pt-16 md:pt-24">
          <Reveal className="mx-auto max-w-3xl text-center">
            <RichText data={service.body} className="text-xl md:text-2xl [&_p]:leading-relaxed" />
          </Reveal>
        </section>
      )}

      {/* What we do: the highlights as a grid of numbered cells */}
      {!!service.highlights?.length && (
        <section className="container-x py-16 md:py-24">
          <Stagger className="grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
            {service.highlights.map((h, i) => (
              <StaggerItem
                key={h.id}
                className="flex flex-col gap-6 border-b border-r border-line p-6 md:p-8"
              >
                <span className="display text-3xl text-gold md:text-4xl">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-base leading-relaxed text-white/85 md:text-lg">{h.text}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {partners.length > 0 && (
        <section className="container-x pb-16 pt-16 md:pb-24 md:pt-24">
          <Reveal className="flex flex-col items-center gap-8">
            <p className="eyebrow">{dict.partners}</p>
            <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              {partners.map(({ partner, logo }) => (
                <li key={partner.id}>
                  <PartnerLogo partner={partner}>
                    {/* a fixed height and the logo's own proportions, so wide and tall marks sit together */}
                    <span
                      className="relative block h-14"
                      style={{
                        aspectRatio:
                          logo.width && logo.height ? Math.min(logo.width / logo.height, 4.5) : 2,
                      }}
                      title={partner.name}
                    >
                      <Img media={logo} fit="contain" sizes="240px" />
                    </span>
                  </PartnerLogo>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="container-x pb-24 md:pb-32">
          <Gallery images={gallery} />
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
              <h2 className="display mb-14 text-4xl text-gold md:text-6xl">
                {dict.relatedProjects}
              </h2>
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

      <CtaBanner
        heading={home.cta?.heading}
        text={home.cta?.text}
        href={localePath(locale, `/contact`)}
        dict={dict}
      />
    </>
  )
}
