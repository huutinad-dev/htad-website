import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Reveal } from '@/components/motion/Reveal'
import { PageHero } from '@/components/PageHero'
import { PRODUCT_CARD_ROWS, ProductCard } from '@/components/ProductCard'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/lib/dictionary'
import { getProducts } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)
  return pageMetadata(locale, { path: '/shop', title: dict.nav.shop, description: dict.shopLead })
}

export default async function ShopPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const products = await getProducts(locale)
  const dict = getDictionary(locale)

  return (
    <>
      <PageHero title={dict.nav.shop} lead={dict.shopLead} />
      <section className="container-x pb-24 md:pb-32">
        {products.length ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-8 xl:grid-cols-4">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 0.08} className={PRODUCT_CARD_ROWS}>
                <ProductCard product={p} locale={locale} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted">{dict.noProducts}</p>
        )}
      </section>
    </>
  )
}
