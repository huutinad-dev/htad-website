import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArrowLink } from '@/components/ArrowLink'
import { CtaBanner } from '@/components/CtaBanner'
import { Img } from '@/components/Img'
import { Parallax } from '@/components/motion/Parallax'
import { Reveal } from '@/components/motion/Reveal'
import { PageHero } from '@/components/PageHero'
import { isLocale, localePath } from '@/i18n/config'
import { getDictionary } from '@/lib/dictionary'
import { asMedia } from '@/lib/media'
import { getHome, getServices } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const home = await getHome(locale)
  return pageMetadata(locale, {
    path: '/services',
    title: getDictionary(locale).nav.services,
    description: home.servicesSection?.text,
  })
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const [services, home] = await Promise.all([getServices(locale), getHome(locale)])
  const dict = getDictionary(locale)

  return (
    <>
      <PageHero
        title={home.servicesSection?.heading || dict.nav.services}
        lead={home.servicesSection?.text}
      />

      <section className="container-x space-y-28 pb-28 md:space-y-40 md:pb-40">
        {services.map((s, i) => {
          const flip = i % 2 === 1
          return (
            <article key={s.id} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
              <Reveal from={flip ? 'right' : 'left'} className={`lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}>
                <Link href={localePath(locale, `/services/${s.slug}`)} className="group block">
                  <Parallax className="aspect-[16/10] rounded-sm" amount={8}>
                    <Img
                      media={asMedia(s.cover)}
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      className="transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
                    />
                  </Parallax>
                </Link>
              </Reveal>
              <div className={`lg:col-span-5 ${flip ? 'lg:order-1' : ''}`}>
                <Reveal>
                  <span className="display text-7xl text-white/10 md:text-8xl">{String(i + 1).padStart(2, '0')}</span>
                </Reveal>
                <Reveal delay={0.05}>
                  <h2 className="display -mt-6 text-4xl text-gold md:text-5xl">{s.title}</h2>
                </Reveal>
                <Reveal delay={0.12}>
                  <p className="mt-6 text-lg leading-relaxed text-muted">{s.excerpt}</p>
                </Reveal>
                <Reveal delay={0.24} className="mt-10">
                  <ArrowLink href={localePath(locale, `/services/${s.slug}`)}>{dict.learnMore}</ArrowLink>
                </Reveal>
              </div>
            </article>
          )
        })}
      </section>

      <CtaBanner heading={home.cta?.heading} text={home.cta?.text} href={localePath(locale, `/contact`)} dict={dict} />
    </>
  )
}
