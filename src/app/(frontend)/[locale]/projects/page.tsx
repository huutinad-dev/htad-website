import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { PageHero } from '@/components/PageHero'
import { ProjectCard } from '@/components/ProjectCard'
import { ProjectGrid } from '@/components/ProjectGrid'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/lib/dictionary'
import { getCategories, getHome, getProjects } from '@/lib/payload'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const home = await getHome(locale)
  return {
    title: home.projectsSection?.heading || getDictionary(locale).nav.projects,
    description: home.projectsSection?.text ?? undefined,
  }
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const [projects, categories, home] = await Promise.all([getProjects(locale), getCategories(locale), getHome(locale)])
  const dict = getDictionary(locale)

  const items = projects.map((p) => ({
    id: p.id,
    categorySlug: typeof p.category === 'object' ? p.category.slug : '',
    card: <ProjectCard project={p} locale={locale} />,
  }))

  return (
    <>
      <PageHero
        title={home.projectsSection?.heading || dict.nav.projects}
        lead={home.projectsSection?.text}
      />
      <section className="container-x pb-28 md:pb-40">
        {/* useSearchParams in the grid requires a Suspense boundary for static rendering */}
        <Suspense>
          <ProjectGrid
            items={items}
            // hide filters with no project yet
            categories={categories
              .filter((c) => items.some((i) => i.categorySlug === c.slug))
              .map((c) => ({ slug: c.slug, title: c.title }))}
            allLabel={dict.all}
          />
        </Suspense>
      </section>
    </>
  )
}
