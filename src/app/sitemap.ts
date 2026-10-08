import type { MetadataRoute } from 'next'

import { postHref } from '@/components/PostCard'
import { defaultLocale, localePath, locales } from '@/i18n/config'
import { getAbout, getHome, getPosts, getProjects, getServices, getSettings } from '@/lib/payload'
import { absoluteUrl, languageAlternates } from '@/lib/seo'

// Rebuilt with the pages (same 10-minute window), so new projects and posts are listed soon after
// they are published.
export const revalidate = 600

// Every page in both languages (`/about`, `/vi/about`), each entry naming its other-language
// versions. Slugs and dates are shared by the languages, so they are read once.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, home, about, services, projects, posts] = await Promise.all([
    getSettings(defaultLocale),
    getHome(defaultLocale),
    getAbout(defaultLocale),
    getServices(defaultLocale),
    getProjects(defaultLocale),
    getPosts(defaultLocale),
  ])
  const page = (path: string, updatedAt?: string | null) =>
    locales.map((locale) => ({
      url: absoluteUrl(localePath(locale, path)),
      lastModified: updatedAt ?? undefined,
      alternates: {
        languages: Object.fromEntries(
          Object.entries(languageAlternates(path)).map(([l, url]) => [l, absoluteUrl(url)]),
        ),
      },
    }))
  return [
    ...page('/', home.updatedAt),
    ...page('/about', about.updatedAt),
    ...page('/services', home.updatedAt),
    ...services.flatMap((s) => page(`/services/${s.slug}`, s.updatedAt)),
    ...page('/projects', home.updatedAt),
    ...projects.flatMap((p) => page(`/projects/${p.slug}`, p.updatedAt)),
    ...page('/insights', posts[0]?.updatedAt),
    // link-only posts open their original (e.g. on Facebook) from the list, so are not pages to list
    ...posts
      .filter((p) => !postHref(p, defaultLocale).external)
      .flatMap((p) => page(`/insights/${p.slug}`, p.updatedAt)),
    ...page('/contact', settings.updatedAt),
  ]
}
