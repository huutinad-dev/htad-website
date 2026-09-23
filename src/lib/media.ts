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
