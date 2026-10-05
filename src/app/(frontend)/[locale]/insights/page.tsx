import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { postTypes } from '@/collections/Posts'
import { ArrowLink } from '@/components/ArrowLink'
import { FacebookFeed } from '@/components/FacebookFeed'
import { Reveal } from '@/components/motion/Reveal'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { PageHero } from '@/components/PageHero'
import { PostCard } from '@/components/PostCard'
import { ProjectGrid } from '@/components/ProjectGrid'
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
    categorySlug: p.type,
    card: <PostCard post={p} locale={locale} dict={dict} />,
  }))

  return (
    <>
      <PageHero title={dict.nav.insights} lead={dict.insightsLead} />
      <section className="container-x pb-24 md:pb-32">
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

      {fanpage && (
        <section className="border-t border-line bg-surface/40 py-20 md:py-28">
          <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Reveal>
                <p className="eyebrow mb-6">Facebook · {fanpage.label}</p>
              </Reveal>
              <SplitHeading text={dict.fanpageHeading} className="display text-4xl text-gold sm:text-5xl lg:text-6xl" />
              <Reveal delay={0.2}>
                <p className="mt-6 max-w-md text-lg leading-relaxed text-white/80">{dict.fanpageText}</p>
                <ArrowLink href={fanpage.url} external variant="solid" className="mt-10">
                  {dict.fanpageButton}
                </ArrowLink>
              </Reveal>
            </div>
            <Reveal delay={0.1} from="none">
              <FacebookFeed pageUrl={fanpage.url} title={fanpage.label} locale={locale} />
            </Reveal>
          </div>
        </section>
      )}
    </>
  )
}
