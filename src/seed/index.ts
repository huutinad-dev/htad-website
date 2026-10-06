/**
 * Seeds the CMS with the content of the company profile PDF.
 *   npm run seed
 *
 * Re-running is safe: it clears services, projects, categories and media
 * (all stored in the Payload schema only) and recreates them.
 */
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

import config from '../payload.config'
import { about, categories, home, projects, services, settings } from './content'
import { richText } from './lexical'

const ASSETS = path.resolve(process.cwd(), 'seed-assets')

// This script deletes every service, project, category, partner and media file before
// recreating them. The project's .env may point at the shared production database, so it only
// runs against a local one unless explicitly told otherwise.
if (!/@?(localhost|127\.0\.0\.1)[:/]/.test(process.env.DATABASE_URL ?? '') && process.env.SEED_ALLOW_REMOTE !== 'yes') {
  throw new Error('Refusing to seed: DATABASE_URL is not a local database. Set SEED_ALLOW_REMOTE=yes to wipe and reseed it anyway.')
}

const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(`[seed] ${msg}`)

for (const collection of ['services', 'projects', 'project-categories', 'partners', 'media'] as const) {
  await payload.delete({ collection, where: { id: { exists: true } } })
}
log('cleared existing content')

const mediaCache = new Map<string, number>()
const media = async (key: string, alt: string) => {
  const cached = mediaCache.get(key)
  if (cached) return cached
  const dir = path.join(ASSETS, path.dirname(key))
  const file = fs.readdirSync(dir).find((f) => f.replace(/\.(png|jpe?g)$/, '') === path.basename(key))
  if (!file) throw new Error(`Missing seed asset: ${key}`)
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    filePath: path.join(dir, file),
  })
  mediaCache.set(key, doc.id)
  return doc.id
}
const mediaList = (keys: string[], alt: string) =>
  Promise.all(keys.map((k, i) => media(k, `${alt} ${i + 1}`)))

// One partner per logo; the same logo used twice is the same partner.
const partnerCache = new Map<string, number>()
const partnerList = async (keys: string[], name: string) => {
  const ids: number[] = []
  for (const [i, key] of keys.entries()) {
    let id = partnerCache.get(key)
    if (!id) {
      const doc = await payload.create({
        collection: 'partners',
        data: { name: `${name} ${i + 1}`, logo: await media(key, `${name} ${i + 1} logo`) },
      })
      id = doc.id
      partnerCache.set(key, id)
    }
    ids.push(id)
  }
  return ids
}

// Categories
const categoryIds = new Map<string, number>()
for (const c of [...categories].sort((a, b) => a.order - b.order)) {
  const doc = await payload.create({
    collection: 'project-categories',
    locale: 'en',
    data: { title: c.title.en, slug: c.slug },
  })
  await payload.update({ collection: 'project-categories', id: doc.id, locale: 'vi', data: { title: c.title.vi } })
  categoryIds.set(c.slug, doc.id)
}
log(`${categories.length} categories`)

// Projects
const projectIds = new Map<string, number>()
for (const p of [...projects].sort((a, b) => a.order - b.order)) {
  const doc = await payload.create({
    collection: 'projects',
    locale: 'en',
    data: {
      slug: p.slug,
      year: p.year,
      featured: p.featured ?? false,
      category: categoryIds.get(p.category)!,
      cover: await media(p.cover, p.title.en),
      gallery: await mediaList(p.gallery, p.title.en),
      logo: p.logo ? await media(p.logo, `${p.title.en} logo`) : undefined,
      videoUrl: p.videoUrl,
      externalUrl: p.externalUrl,
      title: p.title.en,
      subtitle: p.subtitle?.en,
      excerpt: p.excerpt.en,
      body: p.body ? richText(...p.body.en) : undefined,
      quote: p.quote?.en,
    },
  })
  await payload.update({
    collection: 'projects',
    id: doc.id,
    locale: 'vi',
    data: {
      title: p.title.vi,
      subtitle: p.subtitle?.vi,
      excerpt: p.excerpt.vi,
      body: p.body ? richText(...p.body.vi) : undefined,
      quote: p.quote?.vi,
    },
  })
  projectIds.set(p.slug, doc.id)
}
log(`${projects.length} projects`)

// Services
for (const s of [...services].sort((a, b) => a.order - b.order)) {
  const doc = await payload.create({
    collection: 'services',
    locale: 'en',
    data: {
      slug: s.slug,
      cover: await media(s.cover, s.title.en),
      gallery: await mediaList(s.gallery, s.title.en),
      partners: await partnerList(s.partnerLogos ?? [], `${s.title.en} partner`),
      relatedProjects: (s.relatedProjects ?? []).map((slug) => projectIds.get(slug)!),
      title: s.title.en,
      headline: s.headline?.en,
      excerpt: s.excerpt.en,
      body: richText(...s.body.en),
      highlights: s.highlights?.en.map((text) => ({ text })),
      galleryCaption: s.galleryCaption?.en,
    },
  })
  await payload.update({
    collection: 'services',
    id: doc.id,
    locale: 'vi',
    data: {
      title: s.title.vi,
      headline: s.headline?.vi,
      excerpt: s.excerpt.vi,
      body: richText(...s.body.vi),
      highlights: s.highlights?.vi.map((text) => ({ text })),
      galleryCaption: s.galleryCaption?.vi,
    },
  })
}
log(`${services.length} services`)

// Home page
const homeShared = {
  slides: await mediaList(home.slides, 'HTAd'),
  partners: await partnerList(home.partnerLogos, 'Partner'),
  featured: projects.filter((p) => p.featured).map((p) => projectIds.get(p.slug)!),
}
for (const locale of ['en', 'vi'] as const) {
  const c = home[locale]
  await payload.updateGlobal({
    slug: 'home-page',
    locale,
    data: {
      hero: { ...c.hero, slides: homeShared.slides },
      marquee: c.marquee.map((text) => ({ text })),
      stats: c.stats,
      servicesSection: c.servicesSection,
      projectsSection: c.projectsSection,
      featuredProjects: homeShared.featured,
      partners: homeShared.partners,
      cta: c.cta,
    },
  })
}
log('home page')

// About page
const aboutImage = await media(about.image, 'V.League trophies')
const founderPhoto = await media(about.founderPhoto, about.founderName.en)
for (const locale of ['en', 'vi'] as const) {
  const c = about[locale]
  await payload.updateGlobal({
    slug: 'about-page',
    locale,
    data: {
      heading: c.heading,
      lead: c.lead,
      body: richText(...c.body),
      image: aboutImage,
      pillars: c.pillars,
      founder: {
        name: about.founderName[locale],
        role: c.founderRole,
        photo: founderPhoto,
        bio: richText(...c.founderBio),
      },
    },
  })
}
log('about page')

// Site settings
const brand = {
  logo: await media(settings.logo, 'Huu Tin Trading & Advertising logo'),
  logoStacked: await media(settings.logoStacked, 'Huu Tin Trading & Advertising logo'),
  ogImage: await media(settings.ogImage, 'HTAd'),
}
for (const locale of ['en', 'vi'] as const) {
  const c = settings[locale]
  await payload.updateGlobal({
    slug: 'site-settings',
    locale,
    data: {
      companyName: settings.companyName,
      shortName: settings.shortName,
      tagline: c.tagline,
      ...brand,
      contact: { ...settings.contact, address: c.address, city: c.city },
      seoTitle: c.seoTitle,
      seoDescription: c.seoDescription,
    },
  })
}
log('site settings')
log(`done — ${mediaCache.size} media files uploaded`)
process.exit(0)
