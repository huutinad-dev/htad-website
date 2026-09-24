import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Locale } from '@/i18n/config'

const client = () => getPayload({ config })

export const getSettings = cache(async (locale: Locale) =>
  (await client()).findGlobal({ slug: 'site-settings', locale, depth: 1 }),
)

export const getHome = cache(async (locale: Locale) =>
  (await client()).findGlobal({ slug: 'home-page', locale, depth: 2 }),
)

export const getAbout = cache(async (locale: Locale) =>
  (await client()).findGlobal({ slug: 'about-page', locale, depth: 1 }),
)

export const getServices = cache(async (locale: Locale) => {
  const res = await (await client()).find({ collection: 'services', locale, sort: '_order', limit: 100, depth: 1 })
  return res.docs
})

export const getService = cache(async (locale: Locale, slug: string) => {
  const res = await (await client()).find({
    collection: 'services',
    locale,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return res.docs[0] ?? null
})

export const getCategories = cache(async (locale: Locale) => {
  const res = await (await client()).find({ collection: 'project-categories', locale, sort: '_order', limit: 100 })
  return res.docs
})

export const getProjects = cache(async (locale: Locale) => {
  const res = await (await client()).find({ collection: 'projects', locale, sort: '_order', limit: 200, depth: 1 })
  return res.docs
})

export const getProject = cache(async (locale: Locale, slug: string) => {
  const res = await (await client()).find({
    collection: 'projects',
    locale,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  return res.docs[0] ?? null
})
