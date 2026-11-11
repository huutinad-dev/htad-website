import { postHref } from '@/components/PostCard'
import { localePath, type Locale } from '@/i18n/config'
import { getDictionary } from '@/lib/dictionary'
import { oneLine } from '@/lib/media'
import { getAbout, getHome, getPosts, getProducts, getProjects, getServices, getSettings } from '@/lib/payload'
import { absoluteUrl, richTextToPlain, summarize } from '@/lib/seo'

/**
 * The site as Markdown for AI assistants and answer engines (https://llmstxt.org): `/llms.txt` is
 * an index (what HTAd is, every page with a one-line summary) and `/llms-full.txt` adds the full
 * text of each page, so an assistant can answer about HTAd from one file. Vietnamese first (the
 * site's language), then English. Everything comes from the CMS, so it stays current.
 */

const heading: Record<Locale, string> = { vi: 'Tiếng Việt', en: 'English' }
const contactLabels: Record<Locale, { email: string; phone: string; address: string; website: string }> = {
  vi: { email: 'Email', phone: 'Điện thoại', address: 'Địa chỉ', website: 'Website' },
  en: { email: 'Email', phone: 'Phone', address: 'Address', website: 'Website' },
}

/** One line of Markdown text: no line breaks, so it cannot break a list item. */
const flat = (text?: string | null) => (text ?? '').replace(/\s+/g, ' ').trim()

/** An index line: the page and a one-sentence summary (a long excerpt is cut, as in search results). */
const link = (title: string, path: string, locale: Locale, summary?: string | null) =>
  `- [${flat(title)}](${absoluteUrl(localePath(locale, path))})${flat(summary) ? `: ${summarize(flat(summary), 200)}` : ''}`

type Entry = { title: string; path: string; summary?: string | null; body?: unknown; facts?: string[] }

async function sections(locale: Locale) {
  const [settings, home, about, services, projects, posts, products] = await Promise.all([
    getSettings(locale),
    getHome(locale),
    getAbout(locale),
    getServices(locale),
    getProjects(locale),
    getPosts(locale),
    getProducts(locale),
  ])
  const dict = getDictionary(locale)
  const c = settings.contact ?? {}
  const l = contactLabels[locale]
  const contact = [
    c.email && `${l.email}: ${c.email}`,
    c.phone && `${l.phone}: ${c.phone}`,
    // the address often ends with the city already
    c.address &&
      `${l.address}: ${flat(c.city && !c.address.includes(c.city) ? `${c.address}, ${c.city}` : c.address)}`,
    `${l.website}: ${absoluteUrl(localePath(locale))}`,
    ...(settings.social ?? []).map((s) => `${s.label}: ${s.url}`),
  ].filter(Boolean) as string[]

  const groups: { title: string; entries: Entry[] }[] = [
    {
      title: dict.nav.about,
      entries: [
        {
          title: about.heading,
          path: '/about',
          summary: about.lead,
          body: about.body,
          facts: [
            ...(about.pillars ?? []).map((p) => `${p.title}${p.text ? `: ${flat(p.text)}` : ''}`),
            ...(about.founder?.name
              ? [`${about.founder.role || dict.founder}: ${about.founder.name}${about.founder.bio ? ` — ${richTextToPlain(about.founder.bio)}` : ''}`]
              : []),
          ],
        },
      ],
    },
    {
      title: dict.nav.services,
      entries: services.map((s) => ({
        title: s.title,
        path: `/services/${s.slug}`,
        summary: s.excerpt,
        body: s.body,
        facts: (s.highlights ?? []).map((h) => h.text),
      })),
    },
    {
      title: dict.nav.projects,
      entries: projects.map((p) => ({
        title: oneLine(p.title),
        path: `/projects/${p.slug}`,
        summary: p.excerpt,
        body: p.body,
        facts: [p.subtitle, p.year, typeof p.category === 'object' ? p.category?.title : null].filter(
          (f): f is string => Boolean(f),
        ),
      })),
    },
    {
      title: dict.nav.insights,
      // link-only posts are not pages of the site
      entries: posts
        .filter((p) => !postHref(p, locale).external)
        .map((p) => ({
          title: p.title,
          path: `/insights/${p.slug}`,
          summary: p.excerpt,
          body: p.body,
          facts: [p.publishedAt.slice(0, 10)],
        })),
    },
    {
      title: dict.nav.shop,
      entries: products
        .filter((p) => p.slug)
        .map((p) => ({
          title: p.title,
          path: `/shop/${p.slug}`,
          summary: p.excerpt,
          body: p.body,
          facts: [(p.authors ?? []).join(', '), p.year, p.price].filter((f): f is string => Boolean(f)),
        })),
    },
    {
      title: dict.nav.contact,
      entries: [{ title: settings.contactPage?.heading || dict.contactUs, path: '/contact', summary: settings.contactPage?.lead }],
    },
  ].filter((g) => g.entries.length)

  return { settings, home, contact, groups }
}

export async function llmsText({ full }: { full: boolean }) {
  const [vi, en] = await Promise.all([sections('vi'), sections('en')])
  const name = vi.settings.companyName
  const out: string[] = [
    `# ${name}${vi.settings.shortName ? ` (${vi.settings.shortName})` : ''}`,
    '',
    `> ${flat(vi.settings.seoDescription)}`,
    '',
    flat(en.settings.seoDescription),
    '',
  ]
  for (const [locale, data] of [['vi', vi], ['en', en]] as const) {
    out.push(`## ${heading[locale]}`, '')
    if (data.home.hero?.title || data.home.hero?.subtitle)
      out.push(flat([data.home.hero?.title, data.home.hero?.subtitle].filter(Boolean).join(' — ')), '')
    out.push(...data.contact.map((line) => `- ${line}`), '')
    for (const group of data.groups) {
      out.push(`### ${group.title}`, '')
      for (const e of group.entries) {
        if (!full) {
          out.push(link(e.title, e.path, locale, e.summary))
          continue
        }
        out.push(`#### ${flat(e.title)}`, '', absoluteUrl(localePath(locale, e.path)), '')
        if (e.facts?.length) out.push(...e.facts.map((f) => `- ${flat(f)}`), '')
        const text = richTextToPlain(e.body) || flat(e.summary)
        if (text) out.push(text, '')
      }
      out.push('')
    }
  }
  if (!full) out.push('## Optional', '', `- [${name} — full text](${absoluteUrl('/llms-full.txt')})`, `- [Sitemap](${absoluteUrl('/sitemap.xml')})`, '')
  return out.join('\n').replace(/\n{3,}/g, '\n\n')
}

export const llmsResponse = async (full: boolean) =>
  new Response(await llmsText({ full }), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
