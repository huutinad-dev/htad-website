import Image from 'next/image'

import type { Media } from '@/payload-types'
import { mediaSrc } from '@/lib/media'

type Props = {
  media: Media | null
  className?: string
  sizes?: string
  priority?: boolean
  /** Use `contain` for logos. */
  fit?: 'cover' | 'contain'
}

// Fills its (relatively positioned) parent.
export function Img({ media, className, sizes = '100vw', priority, fit = 'cover' }: Props) {
  const src = mediaSrc(media)
  if (!src || !media) return null
  const focal =
    media.focalX != null && media.focalY != null ? `${media.focalX}% ${media.focalY}%` : undefined
  return (
    <Image
      src={src}
      alt={media.alt ?? ''}
      fill
      sizes={sizes}
      priority={priority}
      className={`${fit === 'cover' ? 'object-cover' : 'object-contain'} ${className ?? ''}`}
      style={focal ? { objectPosition: focal } : undefined}
    />
  )
}
