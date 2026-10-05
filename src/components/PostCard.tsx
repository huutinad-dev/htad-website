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

export function PostCard({ post, locale, dict }: { post: Post; locale: Locale; dict: Dictionary }) {
  const { href, external } = postHref(post, locale)
  const inner = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-surface">
        <Img
          media={asMedia(post.cover)}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/30" />
        <span className="absolute right-4 top-4 flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-gold text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <Arrow className="-rotate-45" />
        </span>
      </div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <p className="eyebrow mb-2">{dict.postTypes[post.type]}</p>
          <h3 className="text-xl font-bold leading-snug transition-colors group-hover:text-gold md:text-2xl">{post.title}</h3>
          {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-muted">{post.excerpt}</p>}
        </div>
        <time dateTime={post.publishedAt} className="shrink-0 text-sm text-white/40">
          {formatDate(post.publishedAt, locale)}
        </time>
      </div>
    </>
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
