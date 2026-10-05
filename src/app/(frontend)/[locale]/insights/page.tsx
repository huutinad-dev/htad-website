import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { postTypes } from '@/collections/Posts'
import { PageHero } from '@/components/PageHero'
import { PostCard } from '@/components/PostCard'
import { ProjectGrid } from '@/components/ProjectGrid'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/lib/dictionary'
import { getPosts } from '@/lib/payload'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)
  return { title: dict.nav.insights, description: dict.insightsLead }
}

export default async function InsightsPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const posts = await getPosts(locale)
  const dict = getDictionary(locale)

  const items = posts.map((p) => ({
    id: p.id,
    categorySlug: p.type,
    card: <PostCard post={p} locale={locale} dict={dict} />,
  }))

  return (
    <>
      <PageHero title={dict.nav.insights} lead={dict.insightsLead} />
      <section className="container-x pb-28 md:pb-40">
        {items.length === 0 ? (
          <p className="text-center text-muted">{dict.noInsights}</p>
        ) : (
          // useSearchParams in the grid requires a Suspense boundary for static rendering
          <Suspense>
            <ProjectGrid
              items={items}
              categories={postTypes.map((t) => ({ slug: t, title: dict.postTypes[t] }))}
              allLabel={dict.all}
            />
          </Suspense>
        )}
      </section>
    </>
  )
}
