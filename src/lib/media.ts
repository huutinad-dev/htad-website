import type { Media, Partner } from '@/payload-types'

export type MediaRef = number | Media | null | undefined

export const asMedia = (ref: MediaRef): Media | null =>
  ref && typeof ref === 'object' ? ref : null

export const asMediaList = (refs: MediaRef[] | null | undefined): Media[] =>
  (refs ?? []).map(asMedia).filter((m): m is Media => Boolean(m?.url))

// Payload returns absolute URLs when serverURL is set; next/image only needs the path.
// `?v=` changes whenever the media document is saved, so optimized images and CDN copies
// can be cached for a long time and still refresh when an editor replaces a file.
export const mediaSrc = (media: Media | null) => {
  if (!media?.url) return null
  let path = media.url
  try {
    const url = new URL(media.url)
    // files served from this site: a path is enough; files on the public R2 domain stay absolute
    path =
      url.origin === new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').origin
        ? url.pathname
        : url.href
  } catch {
    // already a path
  }
  const version = Date.parse(media.updatedAt)
  return Number.isNaN(version)
    ? path
    : `${path}${path.includes('?') ? '&' : '?'}v=${version.toString(36)}`
}

// Populated partners that have a usable logo (relationship fields hold ids until
// populated), in the order of the Partners list, which editors arrange by drag-and-drop.
// `visible` is not checked here: it only decides the home page strip (getPartners), while a
// partner picked on a project or service always shows there.
export const asPartnerList = (refs: (number | Partner)[] | null | undefined) =>
  (refs ?? [])
    .flatMap((ref) => {
      const logo = typeof ref === 'object' ? asMedia(ref.logo) : null
      return typeof ref === 'object' && logo?.url ? [{ partner: ref, logo }] : []
    })
    .sort((a, b) => (a.partner._order ?? '').localeCompare(b.partner._order ?? ''))

export const youTubeId = (url?: string | null) => {
  if (!url) return null
  const match = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)
  return match?.[1] ?? null
}

export const toGallery = (list: Media[]) =>
  list
    .map((m) => ({ src: mediaSrc(m)!, alt: m.alt ?? '', width: m.width, height: m.height }))
    .filter((g) => g.src)

// English: "05 Oct 2026". Vietnamese spells the month out ("05 tháng 10, 2026"): its short
// form, "thg 10", reads as an odd abbreviation.
export const formatDate = (date: string, locale: string) =>
  new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-GB', {
    day: '2-digit',
    month: locale === 'vi' ? 'long' : 'short',
    year: 'numeric',
  }).format(new Date(date))

// Lexical always stores a root node, so "has a body" means it has some text or media in it.
export const hasRichText = (data: unknown) => {
  const children = (
    data as { root?: { children?: { children?: unknown[]; type?: string }[] } } | null
  )?.root?.children
  return Boolean(
    children?.some((node) => node.type !== 'paragraph' || (node.children?.length ?? 0) > 0),
  )
}
