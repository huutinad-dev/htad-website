import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArrowLink } from '@/components/ArrowLink'
import { Gallery } from '@/components/Gallery'
import { Img } from '@/components/Img'
import { Reveal } from '@/components/motion/Reveal'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { RichText } from '@/components/RichText'
import { VideoButton } from '@/components/VideoButton'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/lib/dictionary'
import { asMedia, asMediaList, mediaSrc, toGallery, youTubeId } from '@/lib/media'
import { getProject, getProjects } from '@/lib/payload'

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
  const [project, projects] = await Promise.all([getProject(locale, slug), getProjects(locale)])
  if (!project) notFound()
  const dict = getDictionary(locale)

  const cover = asMedia(project.cover)
  const logo = asMedia(project.logo)
  const gallery = toGallery(asMediaList(project.gallery))
  const category = typeof project.category === 'object' ? project.category : null
  const videoId = youTubeId(project.videoUrl)
  const next = projects[(projects.findIndex((p) => p.id === project.id) + 1) % projects.length]
  const nextCover = asMedia(next?.cover)

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-svh items-end overflow-hidden">
        <div className="absolute inset-0">
          <Img media={cover} priority className="animate-kenburns" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/40 to-ink" />
        </div>
        {videoId && (
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <Reveal delay={0.5} from="none">
              <VideoButton videoId={videoId} label={dict.watchVideo} variant="round" />
            </Reveal>
          </div>
        )}
        <div className="container-x relative pb-16 pt-40 md:pb-24">
          {category && (
            <Reveal>
              <Link href={`/${locale}/projects?category=${category.slug}`} className="eyebrow mb-6 inline-block hover:text-white">
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
            </Reveal>
            {logo && (
              <Reveal delay={0.1} className="relative h-24 w-48">
                <Img media={logo} fit="contain" sizes="192px" className="object-left" />
              </Reveal>
            )}
            <Reveal delay={0.15} className="flex flex-wrap gap-3">
              {videoId && <VideoButton videoId={videoId} label={dict.watchVideo} />}
              {project.externalUrl && (
                <ArrowLink href={project.externalUrl} external>
                  {dict.readArticle}
                </ArrowLink>
              )}
            </Reveal>
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
            {project.quote && (
              <Reveal delay={0.1}>
                <p className="display mt-14 text-4xl text-gold md:text-6xl">{project.quote}</p>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="container-x pb-24 md:pb-32">
          <Gallery images={gallery} columns={gallery.length > 3 ? 3 : 2} />
        </section>
      )}

      {/* Next project */}
      {next && next.id !== project.id && (
        <Link href={`/${locale}/projects/${next.slug}`} className="group relative block overflow-hidden border-t border-line">
          <div className="absolute inset-0 opacity-40 transition-opacity duration-700 group-hover:opacity-70">
            <Img media={nextCover} sizes="100vw" className="transition-transform duration-[1.5s] ease-out-expo group-hover:scale-105" />
            <div className="absolute inset-0 bg-ink/60" />
          </div>
          <div className="container-x relative py-28 md:py-40">
            <p className="eyebrow mb-6">{dict.nextProject}</p>
            <p className="display max-w-5xl text-5xl text-white transition-colors duration-500 group-hover:text-gold md:text-8xl">
              {next.title}
            </p>
          </div>
        </Link>
      )}
    </>
  )
}
