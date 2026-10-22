import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Arrow } from '@/components/ArrowLink'
import { Img } from '@/components/Img'
import { Reveal } from '@/components/motion/Reveal'
import { PRODUCT_CARD_ROWS, ProductCard, StoreLinks } from '@/components/ProductCard'
import { RichText } from '@/components/RichText'
import { SectionHeading } from '@/components/SectionHeading'
import { isLocale, localePath } from '@/i18n/config'
import { getDictionary } from '@/lib/dictionary'
import { asMedia, hasRichText } from '@/lib/media'
import { getProduct, getProducts } from '@/lib/payload'
import { breadcrumbs, JsonLd, pageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string; slug: string }> }

// Rendered ahead and cached like the project pages (ISR, see the layout's `revalidate`).
export async function generateStaticParams({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) return []
  return (await getProducts(params.locale)).filter((p) => p.slug).map((p) => ({ slug: p.slug! }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const product = await getProduct(locale, slug)
  if (!product) return {}
  return pageMetadata(locale, {
    path: `/shop/${product.slug}`,
    title: product.title,
    description: product.excerpt,
    content: product.body,
    image: product.cover,
  })
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const [product, products] = await Promise.all([getProduct(locale, slug), getProducts(locale)])
  if (!product) notFound()
  const dict = getDictionary(locale)
  const others = products.filter((p) => p.id !== product.id).slice(0, 4)
  // several authors as "A & B", "A, B & C" (the same in both languages)
  const authors = (product.authors ?? []).map((name) => name.trim()).filter(Boolean)
  const authorList =
    authors.length > 1 ? `${authors.slice(0, -1).join(', ')} & ${authors.at(-1)}` : (authors[0] ?? '')
  const facts = [
    authors.length > 0 && {
      label: authors.length > 1 ? dict.authors : dict.author,
      value: authorList,
    },
    product.year && { label: dict.published, value: product.year },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact))

  return (
    <>
      <JsonLd
        data={breadcrumbs(locale, [
          { name: dict.nav.home, path: '/' },
          { name: dict.nav.shop, path: '/shop' },
          { name: product.title, path: `/shop/${product.slug}` },
        ])}
      />
      <section className="container-x pb-20 pt-32 md:pb-28 md:pt-40">
        <Reveal>
          <Link
            href={localePath(locale, '/shop')}
            className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/60 transition-colors hover:text-gold"
          >
            <Arrow className="rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
            {dict.allProducts}
          </Link>
        </Reveal>

        <div className="mt-8 grid gap-10 md:mt-12 md:grid-cols-[5fr_7fr] md:gap-16 lg:gap-24">
          {/* the cover stays in view while the description scrolls past it */}
          <Reveal className="md:sticky md:top-28 md:self-start">
            <div className="relative mx-auto aspect-[3/4] max-w-md overflow-hidden rounded-sm bg-surface md:max-w-none">
              <Img media={asMedia(product.cover)} fit="contain" priority sizes="(min-width: 768px) 40vw, 100vw" />
            </div>
          </Reveal>

          <div>
            <Reveal delay={0.1}>
              <h1 className="display text-4xl text-gold sm:text-5xl lg:text-6xl">{product.title}</h1>
              {facts.length > 0 && (
                // the same strip of cells as the facts on a project page
                <dl className="mt-8 flex border-y border-line">
                  {facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="min-w-0 flex-1 border-l border-line px-5 py-6 first:border-l-0 first:pl-0 md:px-8"
                    >
                      <dt className="eyebrow mb-3">{fact.label}</dt>
                      <dd className="text-base md:text-lg">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {product.price && <p className="mt-6 text-2xl font-semibold md:text-3xl">{product.price}</p>}
              {product.excerpt && (
                <p className="mt-6 text-lg leading-relaxed text-white/80 [text-wrap:pretty] md:text-xl">{product.excerpt}</p>
              )}
              <StoreLinks product={product} size="lg" className="mt-10" />
            </Reveal>
            {hasRichText(product.body) && (
              <Reveal delay={0.2} className="mt-14 border-t border-line pt-12 md:mt-16">
                <RichText data={product.body} className="text-lg" />
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="container-x border-t border-line py-20 md:py-28">
          <SectionHeading heading={dict.moreProducts} link={{ href: localePath(locale, '/shop'), label: dict.allProducts }} />
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-8 xl:grid-cols-4">
            {others.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 0.08} className={PRODUCT_CARD_ROWS}>
                <ProductCard product={p} locale={locale} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
