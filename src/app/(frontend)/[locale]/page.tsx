import { notFound } from 'next/navigation'

import { CtaBanner } from '@/components/CtaBanner'
import { HeroSlider } from '@/components/HeroSlider'
import { Img } from '@/components/Img'
import { Marquee } from '@/components/Marquee'
import { Counter } from '@/components/motion/Counter'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { PartnerLogo } from '@/components/PartnerLogo'
import { ProjectCard } from '@/components/ProjectCard'
import { ProjectSlider } from '@/components/ProjectSlider'
import { SectionHeading } from '@/components/SectionHeading'
import { ServiceList } from '@/components/ServiceList'
import { isLocale, localePath } from '@/i18n/config'
import { getDictionary } from '@/lib/dictionary'
import { asMedia, asMediaList, asPartnerList, mediaSrc } from '@/lib/media'
import { getHome, getPartners, getProjects, getServices } from '@/lib/payload'
import type { Project } from '@/payload-types'

// Partner logos have very different shapes (shields vs. wide wordmarks). Giving each the
// same visual area, rather than the same height, makes them read as equally weighted.
const LOGO_AREA = 26 // em², e.g. ~8.3em × 3.1em for a wordmark
const logoBox = (w?: number | null, h?: number | null) => {
  const ratio = w && h ? w / h : 2
  const height = Math.min(Math.sqrt(LOGO_AREA / ratio), 5.5)
  return { width: +(height * ratio).toFixed(2), height: +height.toFixed(2) }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const [home, services, allProjects, allPartners] = await Promise.all([
    getHome(locale),
    getServices(locale),
    getProjects(locale),
    getPartners(),
  ])
  const dict = getDictionary(locale)

  const slides = asMediaList(home.hero?.slides).map((m) => ({ src: mediaSrc(m)!, alt: m.alt ?? '' }))
  const chosen = (home.featuredProjects ?? []).filter((p): p is Project => typeof p === 'object')
  const featured = (chosen.length ? chosen : allProjects.filter((p) => p.featured)).slice(0, 8)
  const partners = asPartnerList(allPartners)

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-svh items-end overflow-hidden">
        <HeroSlider slides={slides} />
        <div className="container-x relative z-10 pb-24 pt-40 md:pb-32">
          {home.hero?.eyebrow && (
            <Reveal delay={0.1}>
              <p className="eyebrow mb-8">{home.hero.eyebrow}</p>
            </Reveal>
          )}
          <SplitHeading
            as="h1"
            immediate
            delay={0.2}
            text={home.hero?.title ?? ''}
            className="display text-[11.5vw] text-gold [text-wrap:balance] md:fit-line md:[--fit-max:8.5vw] md:[--fit-pad:5rem]"
          />
          <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            {home.hero?.subtitle && (
              <Reveal delay={0.6}>
                <p className="whitespace-pre-line text-lg leading-relaxed text-white/85 md:text-xl">{home.hero.subtitle}</p>
              </Reveal>
            )}
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">{dict.scroll}</span>
          <span className="relative h-12 w-px overflow-hidden bg-white/20">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2s_ease-in-out_infinite] bg-gold" />
          </span>
        </div>
      </section>

      <Marquee items={(home.marquee ?? []).map((m) => m.text)} />

      {/* Partners */}
      {partners.length > 0 && (
        <section className="border-y border-line py-12 md:py-16">
          <div className="container-x">
            <Reveal>
              <p className="eyebrow mb-10 text-center !text-2xl !font-bold md:mb-12">{dict.partners}</p>
            </Reveal>
            <Stagger className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 md:gap-x-16">
              {partners.map(({ partner, logo }) => {
                const { width, height } = logoBox(logo.width, logo.height)
                return (
                  <StaggerItem key={partner.id}>
                    {/* sized in em so the whole row scales down on small screens */}
                    <PartnerLogo partner={partner}>
                      <div className="relative text-[11px] md:text-base" style={{ width: `${width}em`, height: `${height}em` }}>
                        <Img media={logo} fit="contain" sizes="200px" />
                      </div>
                    </PartnerLogo>
                  </StaggerItem>
                )
              })}
            </Stagger>
          </div>
        </section>
      )}

      {/* Key figures */}
      {!!home.stats?.length && (
        <section className="relative overflow-hidden border-b border-line py-14 md:py-20">
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[60rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[100px]" />
          <Stagger className="container-x relative grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4 lg:gap-x-10">
            {home.stats.map((s) => (
              <StaggerItem key={s.id} className="border-t-2 border-gold pt-6 text-center">
                <p className="display flex justify-center text-6xl leading-none text-gold sm:text-7xl xl:text-8xl">
                  <Counter value={s.value} prefix={s.prefix ?? ''} suffix={s.suffix ?? ''} />
                </p>
                <p className="mx-auto mt-4 max-w-[16rem] text-xs font-semibold uppercase leading-relaxed tracking-[0.14em] text-white/70 sm:text-sm">
                  {s.label}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {/* Services */}
      <section className="border-t border-line bg-surface/40 py-20 md:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow={home.servicesSection?.eyebrow}
            heading={home.servicesSection?.heading}
            link={{ href: localePath(locale, `/services`), label: dict.allServices }}
            className="mb-10 md:mb-14"
          />
          <ServiceList
            items={services.map((s) => {
              const cover = asMedia(s.cover)
              const src = mediaSrc(cover)
              return {
                href: localePath(locale, `/services/${s.slug}`),
                title: s.title,
                excerpt: s.excerpt,
                image: src ? { src, alt: cover!.alt ?? '' } : null,
              }
            })}
            labels={{ prev: dict.previous, next: dict.next }}
          />
        </div>
      </section>

      {/* Featured projects */}
      <section className="container-x py-20 md:py-28">
        <SectionHeading
          eyebrow={home.projectsSection?.eyebrow}
          heading={home.projectsSection?.heading}
          link={{ href: localePath(locale, `/projects`), label: dict.allProjects }}
          className="mb-10 md:mb-14"
        />
        <Reveal>
          <ProjectSlider
            slides={featured.map((p) => (
              <ProjectCard key={p.id} project={p} locale={locale} showSubtitle={false} />
            ))}
            labels={{ prev: dict.previous, next: dict.next }}
          />
        </Reveal>
      </section>

      <CtaBanner heading={home.cta?.heading} text={home.cta?.text} href={localePath(locale, `/contact`)} dict={dict} />
    </>
  )
}
