import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Img } from '@/components/Img'
import { Reveal } from '@/components/motion/Reveal'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { PageHero } from '@/components/PageHero'
import { RichText } from '@/components/RichText'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/lib/dictionary'
import { asMedia } from '@/lib/media'
import { getAbout } from '@/lib/payload'

type Props = { params: Promise<{ locale: string }> }

/** Tallest the About image is drawn, in rem (a square logo is then this wide too). */
const IMAGE_MAX_REM = 26

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const about = await getAbout(locale)
  return { title: about.heading, description: about.lead ?? undefined }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const about = await getAbout(locale)
  const dict = getDictionary(locale)
  const founder = about.founder
  const image = asMedia(about.image)
  const imageRatio = image?.width && image?.height ? image.width / image.height : 4 / 3

  return (
    <>
      <PageHero title={about.heading} lead={about.lead} />

      <section className="container-x pb-16 md:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <Reveal>
            <RichText data={about.body} className="text-justify text-lg" />
          </Reveal>
          {image && (
            <Reveal delay={0.1}>
              {/* Shown whole, in its own proportions, and no taller than IMAGE_MAX_REM: the
                  image may be a photo or a logo, so nothing is cropped to a fixed frame. */}
              <div
                className="relative mx-auto w-full"
                style={{ aspectRatio: imageRatio, maxWidth: `${Math.min(imageRatio * IMAGE_MAX_REM, 44)}rem` }}
              >
                <Img media={image} fit="contain" sizes="(min-width: 1024px) 50vw, 100vw" />
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {founder?.name && (
        <section className="relative overflow-hidden border-t border-line bg-surface/40 py-16 md:py-24">
          <div className="container-x grid items-center gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
            <Reveal from="left" className="lg:col-span-5">
              <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-sm bg-gold lg:max-w-none">
                <Img media={asMedia(founder.photo)} sizes="(min-width: 1024px) 40vw, 100vw" />
              </div>
            </Reveal>
            <div className="lg:col-span-7">
              {/* Desktop: the tops of the name's capitals line up with the top of the photo.
                  The label floats above that line, and the negative margin removes the space
                  between the top of the heading's box and its capitals: 0.2em of padding that
                  SplitHeading keeps for accents, plus the line's own leading (larger in
                  Vietnamese, whose line height leaves room for stacked accents). */}
              <div className="relative">
                <Reveal className="lg:absolute lg:bottom-full lg:left-0">
                  <p className="eyebrow mb-6 lg:mb-2">{founder.role || dict.founder}</p>
                </Reveal>
                <SplitHeading
                  text={founder.name}
                  className="display text-5xl text-gold md:text-7xl lg:-mt-[0.28em] lg:[&:lang(vi)]:-mt-[0.41em]"
                />
              </div>
              <Reveal delay={0.15} className="mt-10">
                <RichText data={founder.bio} className="text-justify" />
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
    </>
  )
}
