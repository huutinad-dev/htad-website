import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { CtaBanner } from '@/components/CtaBanner'
import { Img } from '@/components/Img'
import { Parallax } from '@/components/motion/Parallax'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { PageHero } from '@/components/PageHero'
import { RichText } from '@/components/RichText'
import { isLocale, localePath } from '@/i18n/config'
import { getDictionary } from '@/lib/dictionary'
import { asMedia } from '@/lib/media'
import { getAbout, getHome } from '@/lib/payload'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const about = await getAbout(locale)
  return { title: about.heading, description: about.lead ?? undefined }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const [about, home] = await Promise.all([getAbout(locale), getHome(locale)])
  const dict = getDictionary(locale)
  const founder = about.founder

  return (
    <>
      <PageHero title={about.heading} lead={about.lead} />

      <section className="container-x pb-28 md:pb-40">
        <div className="grid gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <Parallax className="aspect-[4/3] rounded-sm">
              <Img media={asMedia(about.image)} sizes="(min-width: 1024px) 50vw, 100vw" />
            </Parallax>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8 lg:pt-10">
            <RichText data={about.body} className="text-lg" />
          </Reveal>
        </div>

        {!!about.pillars?.length && (
          <div className="mt-28">
            <Reveal>
              <p className="eyebrow mb-10">{dict.network}</p>
            </Reveal>
            <Stagger className="grid gap-px overflow-hidden rounded-sm bg-line sm:grid-cols-2 lg:grid-cols-4">
              {about.pillars.map((p, i) => (
                <StaggerItem
                  key={p.id}
                  className="group flex gap-5 bg-ink p-6 transition-colors duration-500 hover:bg-surface sm:block md:p-8"
                >
                  <span className="display w-14 shrink-0 text-4xl text-gold sm:block sm:w-auto md:text-6xl">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="sm:mt-8">
                    <h3 className="text-lg font-bold md:text-xl">{p.title}</h3>
                    {p.text && <p className="mt-2 text-sm leading-relaxed text-muted md:mt-3">{p.text}</p>}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        )}
      </section>

      {founder?.name && (
        <section className="relative overflow-hidden border-t border-line bg-surface/40 py-28 md:py-40">
          <div className="container-x grid items-center gap-16 lg:grid-cols-12">
            <Reveal from="left" className="lg:col-span-5">
              <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-sm bg-gold lg:max-w-none">
                <Img media={asMedia(founder.photo)} sizes="(min-width: 1024px) 40vw, 100vw" />
              </div>
            </Reveal>
            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal>
                <p className="eyebrow mb-6">{founder.role || dict.founder}</p>
              </Reveal>
              <SplitHeading text={founder.name} className="display text-5xl text-gold md:text-7xl" />
              <Reveal delay={0.15} className="mt-10">
                <RichText data={founder.bio} />
              </Reveal>
              {founder.quote && (
                <Reveal delay={0.25}>
                  <blockquote className="mt-12 border-l-2 border-gold pl-6 text-2xl font-semibold italic leading-snug md:text-3xl">
                    “{founder.quote}”
                  </blockquote>
                </Reveal>
              )}
            </div>
          </div>
        </section>
      )}

      <CtaBanner heading={home.cta?.heading} text={home.cta?.text} href={localePath(locale, `/contact`)} dict={dict} />
    </>
  )
}
