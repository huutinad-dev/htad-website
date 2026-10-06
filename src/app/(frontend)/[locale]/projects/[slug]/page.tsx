import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArrowLink } from '@/components/ArrowLink'
import { Gallery } from '@/components/Gallery'
import { Img } from '@/components/Img'
import { Reveal } from '@/components/motion/Reveal'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { RichText } from '@/components/RichText'
import { PartnerLogo } from '@/components/PartnerLogo'
import { VideoEmbed } from '@/components/VideoEmbed'
import { isLocale, localePath } from '@/i18n/config'
import { getDictionary } from '@/lib/dictionary'
import { asMedia, asMediaList, asPartnerList, mediaSrc, toGallery, youTubeId } from '@/lib/media'
import { getProject } from '@/lib/payload'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const project = await getProject(locale, slug)
  if (!project) return {}
  const og = mediaSrc(asMedia(project.cover))
  return {
    title: project.title,
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
  const logo = asMedia(project.logo)
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
          {category && (
            <Reveal>
              <Link href={localePath(locale, `/projects?category=${category.slug}`)} className="eyebrow mb-6 inline-block hover:text-white">
                {category.title}
              </Link>
            </Reveal>
          )}
          <SplitHeading as="h1" immediate text={project.title} className="display max-w-6xl text-5xl text-gold sm:text-6xl lg:text-8xl" />
          {project.subtitle && (
            <Reveal delay={0.3}>
              <p className="mt-6 max-w-2xl text-lg text-white/80 md:text-xl">{project.subtitle}</p>
            </Reveal>
          )}
        </div>
      </section>

      {/* Overview */}
      <section className="container-x py-24 md:py-32">
        <div className="grid gap-16 lg:grid-cols-12">
          <aside className="space-y-8 lg:col-span-4">
            <Reveal className="grid grid-cols-2 gap-6 border-t border-line pt-6 lg:grid-cols-1">
              {category && (
                <div>
                  <p className="eyebrow mb-2">{dict.category}</p>
                  <p>{category.title}</p>
                </div>
              )}
              {project.year && (
                <div>
                  <p className="eyebrow mb-2">{dict.year}</p>
                  <p>{project.year}</p>
                </div>
              )}
              {partners.length > 0 ? (
                <div className="col-span-2 lg:col-span-1">
                  <p className="eyebrow mb-4">{dict.partner}</p>
                  <ul className="flex flex-wrap items-center gap-x-8 gap-y-5">
                    {partners.map(({ partner, logo }) => (
                      <li key={partner.id}>
                        <PartnerLogo partner={partner}>
                          {/* a fixed height and the logo's own proportions, so wide and tall marks sit together */}
                          <div
                            className="relative h-10"
                            style={{ aspectRatio: logo.width && logo.height ? Math.min(logo.width / logo.height, 4.5) : 2 }}
                            title={partner.name}
                          >
                            <Img media={logo} fit="contain" sizes="180px" />
                          </div>
                        </PartnerLogo>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                // no partner picked yet: the older free-text line
                project.partner && (
                  <div>
                    <p className="eyebrow mb-2">{dict.partner}</p>
                    <p>{project.partner}</p>
                  </div>
                )
              )}
              {project.role && (
                <div>
                  <p className="eyebrow mb-2">{dict.role}</p>
                  <p>{project.role}</p>
                </div>
              )}
            </Reveal>
            {logo && (
              <Reveal delay={0.1} className="relative h-24 w-48">
                <Img media={logo} fit="contain" sizes="192px" className="object-left" />
              </Reveal>
            )}
            {/* the project's YouTube video: a small player in the side column, played in place */}
            {videoId && (
              <Reveal delay={0.15} className="max-w-sm">
                <VideoEmbed videoId={videoId} label={dict.watchVideo} />
              </Reveal>
            )}
            {project.externalUrl && (
              <Reveal delay={0.15}>
                <ArrowLink href={project.externalUrl} external>
                  {dict.readArticle}
                </ArrowLink>
              </Reveal>
            )}
          </aside>
          <div className="lg:col-span-7 lg:col-start-6">
            {project.body ? (
              <Reveal>
                <RichText data={project.body} className="text-lg md:text-xl" />
              </Reveal>
            ) : (
              project.excerpt && (
                <Reveal>
                  <p className="text-xl leading-relaxed text-white/85 md:text-2xl">{project.excerpt}</p>
                </Reveal>
              )
            )}
          </div>
        </div>
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
