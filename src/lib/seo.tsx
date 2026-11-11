import type { Metadata } from 'next'

import { defaultLocale, localePath, locales, type Locale } from '@/i18n/config'
import { asMedia, mediaSrc, type MediaRef } from '@/lib/media'
import { getSettings } from '@/lib/payload'
import type { SiteSetting } from '@/payload-types'

/**
 * Public origin used for canonical URLs, Open Graph and the sitemap. On Vercel production this is
 * the project's production domain (the custom domain once one is added), so links never point at
 * a branch or deployment alias; elsewhere it is NEXT_PUBLIC_SERVER_URL.
 */
export const siteUrl = () => {
  const production = process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL
  return production ? `https://${production}` : process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
}

export const absoluteUrl = (path: string) => new URL(path, siteUrl()).href

const ogLocale: Record<Locale, string> = { en: 'en_US', vi: 'vi_VN' }

/** The page's URL in every language, plus `x-default` (Vietnamese, the default) for any other language. */
export const languageAlternates = (path: string) => ({
  ...Object.fromEntries(locales.map((l) => [l, localePath(l, path)])),
  'x-default': localePath(defaultLocale, path),
})

/** The text of a Lexical rich-text value: blocks (paragraphs, headings, list items) joined by spaces. */
export const richTextToPlain = (data: unknown): string => {
  type Node = { type?: string; text?: string; children?: Node[] }
  const walk = (node: Node): string => {
    if (node.type === 'linebreak') return ' '
    if (node.text != null) return node.text
    const children = node.children ?? []
    // inline runs (text split by formatting, links) join as they are; blocks get a space between
    const inline = children.some((c) => c.text != null || c.type === 'linebreak')
    return children.map(walk).join(inline ? '' : ' ')
  }
  const root = (data as { root?: Node } | null)?.root
  return root ? walk(root).replace(/\s+/g, ' ').trim() : ''
}

/** About 160 characters (what search results show), cut at a word with an ellipsis. */
export const summarize = (text: string, max = 160) => {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  const space = cut.lastIndexOf(' ')
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,.;:–—-]+$/, '')}…`
}

type PageSeo = {
  /** Path without the language, e.g. `/projects/abc`; the canonical URL adds `/en` for English. */
  path: string
  /** Omitted on the home page, which uses the site title from the layout. */
  title?: string
  description?: string | null
  /** Rich-text body, summarized for the description when the page has none. */
  content?: unknown
  /** Falls back to the Open Graph image in Site settings. */
  image?: MediaRef
  article?: { publishedTime?: string | null; modifiedTime?: string | null }
}

// Next merges metadata shallowly: a page that sets `openGraph` replaces the layout's whole
// object, so every page builds a complete one here (title, description, image, URL, site name).
export async function pageMetadata(locale: Locale, seo: PageSeo): Promise<Metadata> {
  const settings = await getSettings(locale)
  const siteTitle = settings.seoTitle || settings.companyName
  const description =
    summarize(seo.description || richTextToPlain(seo.content)) || settings.seoDescription || undefined
  const url = localePath(locale, seo.path)
  const image = mediaSrc(asMedia(seo.image)) ?? mediaSrc(asMedia(settings.ogImage))
  return {
    ...(seo.title && { title: seo.title }),
    description,
    alternates: { canonical: url, languages: languageAlternates(seo.path) },
    openGraph: {
      ...(seo.article
        ? {
            type: 'article',
            publishedTime: seo.article.publishedTime ?? undefined,
            modifiedTime: seo.article.modifiedTime ?? undefined,
          }
        : { type: 'website' }),
      url,
      siteName: settings.shortName || settings.companyName,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      title: seo.title || siteTitle,
      description,
      images: image ? [image] : undefined,
    },
  }
}

/** Structured data for search engines (schema.org), rendered as a JSON-LD script. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // `<` escaped so content from the CMS can never close the script tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

/** Home › section › page, as a schema.org BreadcrumbList (paths without the language). */
export const breadcrumbs = (locale: Locale, items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: absoluteUrl(localePath(locale, item.path)),
  })),
})

/**
 * Stable `@id`s for the company and the site, so every page's structured data points at the same
 * Organization (search engines and AI answer engines then treat it as one entity, not one per page).
 */
export const organizationId = () => absoluteUrl('/#organization')
export const websiteId = () => absoluteUrl('/#website')
/** Reference to the company from another schema.org node, e.g. `publisher: organizationRef()`. */
export const organizationRef = () => ({ '@id': organizationId() })

/**
 * The company (Organization) and the site (WebSite), rendered on every page by the layout: who
 * HTAd is, what it does, where and how to reach it, and its social profiles.
 */
export function siteGraph(
  settings: SiteSetting,
  extra: { knowsAbout?: string[]; founder?: { name: string; jobTitle?: string | null } | null } = {},
) {
  const logo = mediaSrc(asMedia(settings.logoStacked) ?? asMedia(settings.logo))
  const contact = settings.contact
  const sameAs = (settings.social ?? []).map((s) => s.url).filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId(),
        name: settings.companyName,
        alternateName: settings.shortName || undefined,
        description: settings.seoDescription || undefined,
        slogan: settings.tagline || undefined,
        url: absoluteUrl(localePath(defaultLocale)),
        logo: logo ? absoluteUrl(logo) : undefined,
        image: logo ? absoluteUrl(logo) : undefined,
        email: contact?.email || undefined,
        telephone: contact?.phone || undefined,
        address: contact?.address
          ? {
              '@type': 'PostalAddress',
              streetAddress: contact.address,
              addressLocality: contact.city || undefined,
              addressCountry: 'VN',
            }
          : undefined,
        areaServed: { '@type': 'Country', name: 'Vietnam' },
        knowsAbout: extra.knowsAbout?.length ? extra.knowsAbout : undefined,
        founder: extra.founder?.name
          ? { '@type': 'Person', name: extra.founder.name, jobTitle: extra.founder.jobTitle || undefined }
          : undefined,
        contactPoint: contact?.email || contact?.phone
          ? {
              '@type': 'ContactPoint',
              contactType: 'customer service',
              email: contact.email || undefined,
              telephone: contact.phone || undefined,
              availableLanguage: ['Vietnamese', 'English'],
            }
          : undefined,
        sameAs: sameAs.length ? sameAs : undefined,
      },
      {
        '@type': 'WebSite',
        '@id': websiteId(),
        url: absoluteUrl(localePath(defaultLocale)),
        name: settings.shortName || settings.companyName,
        alternateName: settings.shortName ? settings.companyName : undefined,
        description: settings.seoDescription || undefined,
        inLanguage: locales,
        publisher: organizationRef(),
      },
    ],
  }
}

/** A page of the site as a schema.org WebPage (or a subtype such as AboutPage), in its language. */
export const webPage = (
  locale: Locale,
  page: { type?: string; path: string; name: string; description?: string | null; about?: unknown },
) => ({
  '@context': 'https://schema.org',
  '@type': page.type ?? 'WebPage',
  '@id': `${absoluteUrl(localePath(locale, page.path))}#webpage`,
  url: absoluteUrl(localePath(locale, page.path)),
  name: page.name,
  description: page.description || undefined,
  inLanguage: locale,
  isPartOf: { '@id': websiteId() },
  about: page.about ?? organizationRef(),
})
