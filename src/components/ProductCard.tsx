import { asMedia } from '@/lib/media'
import type { Product } from '@/payload-types'

import { ArrowLink } from './ArrowLink'
import { Img } from './Img'

// A product (a book) and the stores it is sold in: the first store is the highlighted button.
export function ProductCard({ product }: { product: Product }) {
  const links = (product.links ?? []).filter((l) => l.url)
  return (
    <article className="flex h-full flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-surface">
        <Img
          media={asMedia(product.cover)}
          fit="contain"
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
        />
      </div>
      <div className="mt-5 flex flex-1 flex-col">
        {product.author && <p className="eyebrow mb-2">{product.author}</p>}
        <h3 className="text-xl font-bold leading-snug md:text-2xl">{product.title}</h3>
        {product.price && <p className="mt-2 text-lg font-semibold text-gold">{product.price}</p>}
        {product.excerpt && <p className="mt-2 line-clamp-3 text-sm text-muted">{product.excerpt}</p>}
        {links.length > 0 && (
          <div className="mt-auto flex flex-col gap-2 pt-5">
            {links.map((l, i) => (
              <ArrowLink
                key={l.id ?? l.url}
                href={l.url}
                external
                variant={i === 0 ? 'solid' : 'outline'}
                className="w-full justify-between !whitespace-normal !px-4 !py-2.5 text-left !text-xs"
              >
                {l.label}
              </ArrowLink>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
