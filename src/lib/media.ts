import type { Media } from '@/payload-types'

export type MediaRef = number | Media | null | undefined

export const asMedia = (ref: MediaRef): Media | null => (ref && typeof ref === 'object' ? ref : null)

export const asMediaList = (refs: MediaRef[] | null | undefined): Media[] =>
  (refs ?? []).map(asMedia).filter((m): m is Media => Boolean(m?.url))

// Payload returns absolute URLs when serverURL is set; next/image only needs the path.
export const mediaSrc = (media: Media | null) => {
  if (!media?.url) return null
  try {
    return new URL(media.url).pathname
  } catch {
    return media.url
  }
}

export const youTubeId = (url?: string | null) => {
  if (!url) return null
  const match = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)
  return match?.[1] ?? null
}

export const toGallery = (list: Media[]) =>
  list
    .map((m) => ({ src: mediaSrc(m)!, alt: m.alt, width: m.width, height: m.height }))
    .filter((g) => g.src)

export const formatDate = (date: string, locale: string) =>
  new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(date),
  )

// Lexical always stores a root node, so "has a body" means it has some text or media in it.
export const hasRichText = (data: unknown) => {
  const children = (data as { root?: { children?: { children?: unknown[]; type?: string }[] } } | null)?.root?.children
  return Boolean(children?.some((node) => node.type !== 'paragraph' || (node.children?.length ?? 0) > 0))
}
