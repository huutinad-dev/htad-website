import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ArrowLink } from '@/components/ArrowLink'
import { Img } from '@/components/Img'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { PostCard } from '@/components/PostCard'
import { RichText } from '@/components/RichText'
import { isLocale, localePath } from '@/i18n/config'
import { getDictionary } from '@/lib/dictionary'
import { asMedia, formatDate, hasRichText, mediaSrc } from '@/lib/media'
import { getPost, getPosts } from '@/lib/payload'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const post = await getPost(locale, slug)
  if (!post) return {}
  const og = mediaSrc(asMedia(post.cover))
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: { type: 'article', publishedTime: post.publishedAt, images: og ? [og] : undefined },
  }
}

export default async function InsightPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const [post, posts] = await Promise.all([getPost(locale, slug), getPosts(locale)])
  if (!post) notFound()
  const dict = getDictionary(locale)
  const more = posts.filter((p) => p.id !== post.id).slice(0, 2)

  return (
    <>
      <section className="relative flex min-h-[80svh] items-end overflow-hidden">
        <div className="absolute inset-0">
          <Img media={asMedia(post.cover)} priority className="animate-kenburns" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/50 to-ink" />
        </div>
        <div className="container-x relative pb-16 pt-40 md:pb-24">
          <Reveal>
            <p className="eyebrow mb-6">
              {dict.postTypes[post.type]} · <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
            </p>
          </Reveal>
          <SplitHeading as="h1" immediate text={post.title} className="display max-w-5xl text-4xl text-gold sm:text-5xl lg:text-7xl" />
        </div>
      </section>

      <article className="container-x py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          {post.excerpt && (
            <Reveal>
              <p className="text-xl leading-relaxed text-white/85 md:text-2xl">{post.excerpt}</p>
            </Reveal>
          )}
          {hasRichText(post.body) && (
            <Reveal delay={0.1}>
              <RichText data={post.body} className="mt-10 text-lg" />
            </Reveal>
          )}
          <Reveal delay={0.15} className="mt-12 flex flex-wrap gap-3">
            {post.sourceUrl && (
              <ArrowLink href={post.sourceUrl} external variant="solid">
                {dict.viewOriginal}
              </ArrowLink>
            )}
            <ArrowLink href={localePath(locale, '/insights')}>{dict.allInsights}</ArrowLink>
          </Reveal>
        </div>
      </article>

      {more.length > 0 && (
        <section className="container-x border-t border-line py-20 md:py-28">
          <p className="eyebrow mb-10">{dict.moreInsights}</p>
          <Stagger className="grid gap-10 md:grid-cols-2 md:gap-8">
            {more.map((p) => (
              <StaggerItem key={p.id}>
                <PostCard post={p} locale={locale} dict={dict} />
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}
    </>
  )
}
