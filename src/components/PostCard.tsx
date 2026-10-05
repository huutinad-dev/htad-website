import Link from 'next/link'

import { localePath, type Locale } from '@/i18n/config'
import type { Dictionary } from '@/lib/dictionary'
import { asMedia, formatDate, hasRichText } from '@/lib/media'
import type { Post } from '@/payload-types'

import { Arrow } from './ArrowLink'
import { Img } from './Img'

// A post without a body is just a pointer to its original post (e.g. on Facebook),
// so its card opens that link instead of an empty article page.
export const postHref = (post: Post, locale: Locale) =>
  !hasRichText(post.body) && post.sourceUrl
    ? { href: post.sourceUrl, external: true }
    : { href: localePath(locale, `/insights/${post.slug}`), external: false }

export function PostCard({
  post,
  locale,
  dict,
  featured,
}: {
  post: Post
  locale: Locale
  dict: Dictionary
  /** Larger card for the newest post at the top of the list. */
  featured?: boolean
}) {
  const { href, external } = postHref(post, locale)
  const inner = (
    // the lead story goes image-beside-text once the list is wide enough (see InsightsList)
    <div className={featured ? '@5xl:grid @5xl:grid-cols-[3fr_2fr] @5xl:items-center @5xl:gap-12' : undefined}>
      <div className={`relative overflow-hidden rounded-sm bg-surface ${featured ? 'aspect-[16/10] sm:aspect-[16/9]' : 'aspect-[4/3]'}`}>
        <Img
          media={asMedia(post.cover)}
          sizes={featured ? '(min-width: 1024px) 60vw, 100vw' : '(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw'}
          priority={featured}
          className="transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/30" />
        <span className="absolute right-4 top-4 flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-gold text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <Arrow className="-rotate-45" />
        </span>
      </div>
      <div className={featured ? 'mt-6 @5xl:mt-0' : 'mt-5'}>
        <p className="eyebrow mb-3">
          {dict.postTypes[post.type]}
          <span className="mx-2 text-white/30">·</span>
          <time dateTime={post.publishedAt} className="text-white/50">
            {formatDate(post.publishedAt, locale)}
          </time>
        </p>
        <h3
          className={`font-bold leading-snug transition-colors group-hover:text-gold ${
            featured ? 'text-2xl sm:text-3xl xl:text-4xl' : 'text-xl md:text-2xl'
          }`}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p className={`text-muted ${featured ? 'mt-3 max-w-2xl text-base md:text-lg' : 'mt-2 line-clamp-2 text-sm'}`}>{post.excerpt}</p>
        )}
      </div>
    </div>
  )
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group block">
      {inner}
    </a>
  ) : (
    <Link href={href} className="group block">
      {inner}
    </Link>
  )
}
