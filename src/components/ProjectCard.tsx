import Link from 'next/link'

import { localePath, type Locale } from '@/i18n/config'
import { asMedia } from '@/lib/media'
import type { Project } from '@/payload-types'

import { Arrow } from './ArrowLink'
import { Img } from './Img'

export function ProjectCard({
  project,
  locale,
  size = 'md',
  showSubtitle = true,
}: {
  project: Project
  locale: Locale
  size?: 'md' | 'lg'
  showSubtitle?: boolean
}) {
  // picked partners by name; projects without any still use the older free-text line
  const partners =
    (project.partners ?? []).flatMap((p) => (typeof p === 'object' && p.visible !== false ? [p.name] : [])).join(' × ') ||
    project.partner
  return (
    <Link href={localePath(locale, `/projects/${project.slug}`)} className="group block">
      <div
        className={`relative overflow-hidden rounded-sm bg-surface ${
          size === 'lg' ? 'aspect-[16/10]' : 'aspect-[4/3]'
        }`}
      >
        <Img
          media={asMedia(project.cover)}
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
          <h3 className="text-xl font-bold leading-snug transition-colors group-hover:text-gold md:text-2xl">
            {project.title}
          </h3>
          {showSubtitle && (partners || project.subtitle) && (
            <p className="mt-1 text-sm text-muted">{partners || project.subtitle}</p>
          )}
        </div>
        {project.year && <span className="shrink-0 text-sm text-white/40">{project.year}</span>}
      </div>
    </Link>
  )
}

/**
 * Staggered two-column layout for project cards.
 * Desktop: two independent columns (even / odd indexes), the right one offset down, so each
 * column stacks with even spacing regardless of card heights. Mobile: the column wrappers are
 * `display: contents` and cells are re-ordered by index, giving a single column in list order.
 * A hairline divider sits between consecutive cards of a column.
 */
export const splitColumns = <T,>(items: T[]) => [items.filter((_, i) => i % 2 === 0), items.filter((_, i) => i % 2 === 1)]

export const projectColumnsClass = 'flex flex-col md:flex-row md:items-start md:gap-8'

export const projectColumnClass = (col: number) =>
  `contents md:flex md:min-w-0 md:flex-1 md:flex-col ${col === 1 ? 'md:pt-16' : ''}`

/** `i` is the card's position in the full list; returns classes + mobile order. */
export const projectCell = (i: number) => ({
  className: [
    i >= 1 && 'mt-8 border-t border-line pt-8',
    i === 1 && 'md:mt-0 md:border-t-0 md:pt-0',
  ]
    .filter(Boolean)
    .join(' '),
  style: { order: i },
})
