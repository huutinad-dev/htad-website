import type React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ArrowLink } from '@/components/ArrowLink'
import { Gallery } from '@/components/Gallery'
import { Img } from '@/components/Img'
import { Reveal } from '@/components/motion/Reveal'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { RichText } from '@/components/RichText'
import { PartnerLogo } from '@/components/PartnerLogo'
import { VideoEmbed } from '@/components/VideoEmbed'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/lib/dictionary'
import { asMedia, asMediaList, asPartnerList, mediaSrc, oneLine, toGallery, youTubeId } from '@/lib/media'
import { getProject, getProjects } from '@/lib/payload'

type Props = { params: Promise<{ locale: string; slug: string }> }

type Fact = { label: string; value: React.ReactNode; wide?: boolean }

// Every project is rendered ahead and cached like the other pages (ISR, see the layout's
// `revalidate`); without this list the page was rendered from scratch on every visit. New
// projects added later are rendered on their first visit and cached from then on.
export async function generateStaticParams({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) return []
  return (await getProjects(params.locale)).map((doc) => ({ slug: doc.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const project = await getProject(locale, slug)
  if (!project) return {}
  const og = mediaSrc(asMedia(project.cover))
  return {
    title: oneLine(project.title),
    description: project.excerpt ?? undefined,
    openGraph: og ? { images: [og] } : undefined,
  }
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const project = await getProject(locale, slug)
  if (!project) notFound()
  const dict = getDictionary(locale)

  const cover = asMedia(project.cover)
  const gallery = toGallery(asMediaList(project.gallery))
  const category = typeof project.category === 'object' ? project.category : null
  const videoId = youTubeId(project.videoUrl)
  const partners = asPartnerList(project.partners)

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-svh items-end overflow-hidden">
        <div className="absolute inset-0">
          <Img media={cover} priority className="animate-kenburns" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/40 to-ink" />
        </div>
        <div className="container-x relative pb-16 pt-40 md:pb-24">
          <SplitHeading
            as="h1"
            immediate
            text={project.title}
            className="display max-w-6xl text-5xl text-gold sm:text-6xl lg:text-8xl"
          />
          {project.subtitle && (
            <Reveal delay={0.3}>
              <p className="mt-6 max-w-2xl text-lg text-white/80 md:text-xl">{project.subtitle}</p>
            </Reveal>
          )}
        </div>
      </section>

      {/* Facts: one strip across the page, each fact in its own cell */}
      <section className="container-x pt-14 md:pt-20">
        <Reveal>
          <dl className="grid grid-cols-2 border-y border-line md:flex md:flex-wrap">
            {(
              [
                category && { label: dict.category, value: <span>{category.title}</span> },
                project.year && { label: dict.year, value: <span>{project.year}</span> },
                (partners.length > 0 || project.partner) && {
                  label: dict.partner,
                  wide: true,
                  value:
                    partners.length > 0 ? (
                      <span className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        {partners.map(({ partner, logo }) => (
                          <PartnerLogo key={partner.id} partner={partner}>
                            {/* a fixed height and the logo's own proportions, so wide and tall marks sit together */}
                            <span
                              className="relative block h-8"
                              style={{
                                aspectRatio:
                                  logo.width && logo.height
                                    ? Math.min(logo.width / logo.height, 4.5)
                                    : 2,
                              }}
                              title={partner.name}
                            >
                              <Img media={logo} fit="contain" sizes="160px" />
                            </span>
                          </PartnerLogo>
                        ))}
                      </span>
                    ) : (
                      <span>{project.partner}</span>
                    ),
                },
                project.role && {
                  label: dict.role,
                  value: <span>{project.role}</span>,
                  wide: true,
                },
              ] as (Fact | false | null | undefined | '')[]
            )
              .filter((fact): fact is Fact => Boolean(fact))
              .map((fact) => (
                <div
                  key={fact.label}
                  className={`border-line py-6 pr-6 md:flex-1 md:border-l md:px-8 md:first:border-l-0 md:first:pl-0 ${
                    fact.wide ? 'col-span-2 border-t md:col-span-1 md:border-t-0' : ''
                  } ${fact.wide ? 'md:flex-[1.6]' : ''}`}
                >
                  <dt className="eyebrow mb-3">{fact.label}</dt>
                  <dd className="text-base md:text-lg">{fact.value}</dd>
                </div>
              ))}
          </dl>
        </Reveal>
      </section>

      {/* Story: one comfortable reading column */}
      <section className="container-x py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          {project.body ? (
            <Reveal>
              <RichText data={project.body} className="text-lg md:text-xl" />
            </Reveal>
          ) : (
            project.excerpt && (
              <Reveal>
                <p className="text-xl leading-relaxed text-white/85 md:text-2xl">
                  {project.excerpt}
                </p>
              </Reveal>
            )
          )}
          {project.externalUrl && (
            <Reveal delay={0.1} className="mt-12 flex justify-center">
              <ArrowLink href={project.externalUrl} external>
                {dict.readArticle}
              </ArrowLink>
            </Reveal>
          )}
        </div>

        {/* Film: the project's YouTube video, wider than the text, played in place */}
        {videoId && (
          <Reveal delay={0.1} className="mx-auto mt-16 max-w-5xl md:mt-20">
            <VideoEmbed videoId={videoId} label={dict.watchVideo} />
          </Reveal>
        )}
      </section>

      {/* Slogan: centred on a single line (the type shrinks to fit the width) */}
      {project.quote && (
        <section className="container-x pb-16 text-center md:pb-24">
          <SplitHeading
            as="p"
            text={project.quote.replace(/\s*\n\s*/g, ' ')}
            className="display fit-line text-gold [--fit-max:3rem] sm:[--fit-max:4.5rem] md:[--fit-pad:5rem] xl:[--fit-max:6rem]"
          />
        </section>
      )}

      {gallery.length > 0 && (
        <section className="container-x pb-24 md:pb-32">
          <Gallery images={gallery} layout={project.galleryLayout ?? 'landscape'} />
        </section>
      )}
    </>
  )
}
