import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { postTypes } from '@/collections/Posts'
import { FanpageCard } from '@/components/FanpageCard'
import { InsightsList } from '@/components/InsightsList'
import { PageHero } from '@/components/PageHero'
import { PostCard } from '@/components/PostCard'
import { socialNetwork } from '@/components/SocialLinks'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/lib/dictionary'
import { getPosts, getSettings } from '@/lib/payload'

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
  const [posts, settings] = await Promise.all([getPosts(locale), getSettings(locale)])
  const dict = getDictionary(locale)
  // the fanpage is whichever Facebook link is listed first in Site settings → Social links
  const fanpage = (settings.social ?? []).find((s) => socialNetwork(s.url) === 'facebook')

  const items = posts.map((p) => ({
    id: p.id,
    type: p.type,
    card: <PostCard post={p} locale={locale} dict={dict} />,
  }))

  return (
    <>
      <PageHero title={dict.nav.insights} lead={dict.insightsLead} />
      <section className="container-x pb-24 md:pb-32">
        {/* useSearchParams in the list requires a Suspense boundary for static rendering */}
        <Suspense>
          <InsightsList
            items={items}
            types={postTypes.map((t) => ({ slug: t, title: dict.postTypes[t] }))}
            allLabel={dict.all}
            emptyLabel={dict.noInsights}
            // the fanpage is the pinned first card of the list
            pinned={fanpage && <FanpageCard url={fanpage.url} label={fanpage.label} locale={locale} labels={dict} />}
          />
        </Suspense>
      </section>
    </>
  )
}
