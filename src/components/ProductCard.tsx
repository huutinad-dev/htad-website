import Link from 'next/link'

import { localePath, type Locale } from '@/i18n/config'
import { asMedia } from '@/lib/media'
import type { Product } from '@/payload-types'

import { Arrow } from './ArrowLink'
import { Img } from './Img'

/** Rows a card takes in the Shop grid: cover, title, price, excerpt, store links. */
export const PRODUCT_CARD_ROWS = 'row-span-5 grid grid-rows-subgrid gap-y-0'

export const productHref = (product: Product, locale: Locale) =>
  product.slug ? localePath(locale, `/shop/${product.slug}`) : null

/** The product's store links as buttons, the first one highlighted. On a card they stack at the
 * card's width; on the product page (`size="lg"`) they sit side by side. */
export function StoreLinks({
  product,
  size = 'sm',
  className,
}: {
  product: Product
  size?: 'sm' | 'lg'
  className?: string
}) {
  const links = (product.links ?? []).filter((l) => l.url)
  return (
    <div className={`flex gap-2.5 ${size === 'lg' ? 'flex-wrap' : 'flex-col'} ${className ?? ''}`}>
      {links.map((l, i) => (
        <a
          key={l.id ?? l.url}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`group/store inline-flex items-center gap-2.5 rounded-md border font-semibold transition-colors duration-300 ${
            size === 'lg' ? 'h-12 min-w-48 px-5 text-base' : 'h-10 px-3.5 text-sm'
          } ${
            i === 0
              ? 'border-gold bg-gold text-ink hover:border-white hover:bg-white'
              : 'border-white/15 bg-white/[0.04] text-white hover:border-gold hover:text-gold'
          }`}
        >
          <BagIcon className={size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />
          <span className="min-w-0 flex-1 truncate">{l.label}</span>
          <Arrow className="-rotate-45 opacity-70 transition-transform duration-300 group-hover/store:-translate-y-0.5 group-hover/store:translate-x-0.5" />
        </a>
      ))}
    </div>
  )
}

function BagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={`shrink-0 ${className ?? ''}`}>
      <path
        d="M6 8h12l-1 12H7L6 8Zm3 0V7a3 3 0 0 1 6 0v1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// A product (a book): the cover and title open its page, the buttons the stores it is sold in.
// The card's parts sit on the rows of the Shop grid (subgrid), so across a row the titles,
// prices, excerpts and buttons start at the same height whatever each card holds. Every part
// is rendered, empty or not, to keep its row.
export function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const href = productHref(product, locale)
  const cover = (
    <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-surface">
      <Img
        media={asMedia(product.cover)}
        fit="contain"
        sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
        className="transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
      />
    </div>
  )
  return (
    <article className={`group ${PRODUCT_CARD_ROWS}`}>
      {href ? (
        // the title below is the same link for keyboards and screen readers
        <Link href={href} tabIndex={-1} aria-hidden>
          {cover}
        </Link>
      ) : (
        cover
      )}
      <h3 className="pt-5 text-xl font-bold leading-snug md:text-2xl">
        {href ? (
          <Link href={href} className="transition-colors hover:text-gold">
            {product.title}
          </Link>
        ) : (
          product.title
        )}
      </h3>
      <div>{product.price && <p className="pt-2 text-lg font-semibold text-gold">{product.price}</p>}</div>
      <div>{product.excerpt && <p className="line-clamp-3 pt-2 text-sm text-muted">{product.excerpt}</p>}</div>
      <StoreLinks product={product} className="self-start pt-5" />
    </article>
  )
}
