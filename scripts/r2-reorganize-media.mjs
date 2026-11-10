// One-off: move the media files in R2 from the bucket root into media/<category>/ (2026-11).
// Run with the production env: node --env-file=.env scripts/r2-reorganize-media.mjs <step>
//
// Steps, in order (each re-reads the bucket and the database, and is safe to re-run):
//   plan          print where every media document would go, and the orphan files; changes nothing
//   copy          copy each document's files (original + sizes) to media/<category>/, verify sizes
//   db            point each document at its new folder (prefix, category), only once its copies exist
//   orphans DIR   download the files no media document uses into DIR, then delete them from R2
//   cleanup-root  delete the old root copies of documents that have moved (after the deploy and
//                 once cached pages have expired)
//
// The category is where the image is used: projects, services, insights (posts), shop
// (products), partners, site (settings, home, about); anything unused goes to library.
import { CopyObjectCommand, DeleteObjectsCommand, GetObjectCommand, HeadObjectCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import pg from 'pg'

const [step, arg] = process.argv.slice(2)
const Bucket = process.env.R2_BUCKET
const s3 = new S3Client({
  endpoint: process.env.R2_ENDPOINT,
  region: 'auto',
  forcePathStyle: true,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
})
const db = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_URL?.includes('localhost') ? undefined : { rejectUnauthorized: false } })
const q = async (sql, params) => (await db.query(sql, params)).rows

const listBucket = async () => {
  const objects = new Map()
  let ContinuationToken
  do {
    const r = await s3.send(new ListObjectsV2Command({ Bucket, ContinuationToken }))
    for (const o of r.Contents ?? []) objects.set(o.Key, o.Size)
    ContinuationToken = r.NextContinuationToken
  } while (ContinuationToken)
  return objects
}

const ORDER = ['projects', 'services', 'insights', 'shop', 'partners', 'site']

const classify = async () => {
  const uses = new Map()
  const add = (id, cat) => id != null && (uses.get(+id) ?? uses.set(+id, new Set()).get(+id)).add(cat)
  for (const r of await q(`select cover_id a, cover_portrait_id b from htad.projects`)) add(r.a, 'projects'), add(r.b, 'projects')
  for (const r of await q(`select media_id a from htad.projects_rels where media_id is not null`)) add(r.a, 'projects')
  for (const r of await q(`select cover_id a from htad.services`)) add(r.a, 'services')
  for (const r of await q(`select media_id a from htad.services_rels where media_id is not null`)) add(r.a, 'services')
  for (const r of await q(`select cover_id a from htad.posts`)) add(r.a, 'insights')
  for (const r of await q(`select cover_id a from htad.products`)) add(r.a, 'shop')
  for (const r of await q(`select logo_id a from htad.partners`)) add(r.a, 'partners')
  for (const r of await q(`select logo_id a, logo_stacked_id b, og_image_id c from htad.site_settings`)) add(r.a, 'site'), add(r.b, 'site'), add(r.c, 'site')
  for (const r of await q(`select image_id a, founder_photo_id b from htad.about_page`)) add(r.a, 'site'), add(r.b, 'site')
  for (const r of await q(`select media_id a from htad.home_page_rels where media_id is not null`)) add(r.a, 'site')
  const rich = (rows, cat) => {
    for (const r of rows)
      for (const m of JSON.stringify(r.b ?? null).matchAll(/"relationTo":\s*"media",\s*"value":\s*(\d+)|"value":\s*(\d+),\s*"relationTo":\s*"media"/g))
        add(m[1] ?? m[2], cat)
  }
  rich(await q(`select body b from htad.posts_locales`), 'insights')
  rich(await q(`select body b from htad.products_locales`), 'shop')

  const media = await q(`select id, prefix, filename, sizes_thumbnail_filename t, sizes_card_filename c from htad.media order by id`)
  return media.map((m) => {
    const cat = ORDER.find((c) => uses.get(m.id)?.has(c)) ?? 'library'
    return { id: m.id, prefix: m.prefix ?? '', cat, files: [m.filename, m.t, m.c].filter(Boolean) }
  })
}

const key = (prefix, file) => (prefix ? `${prefix}/${file}` : file)
const target = (doc) => `media/${doc.cat}`

await db.connect()
try {
  const docs = await classify()
  const objects = await listBucket()
  const moving = docs.filter((d) => d.prefix === '')
  const referenced = new Set(docs.flatMap((d) => d.files.map((f) => key(d.prefix, f))))
  // a root file no document uses, under its old (root) or new location
  const docFileNames = new Set(docs.flatMap((d) => d.files))
  const orphans = [...objects.keys()].filter((k) => !k.includes('/') && !docFileNames.has(k))

  if (step === 'plan') {
    const counts = {}
    for (const d of docs) counts[d.cat] = (counts[d.cat] ?? 0) + 1
    console.log('documents by category:', counts)
    console.log('still at the bucket root:', moving.length, '| already moved:', docs.length - moving.length)
    console.log('files referenced but missing:', [...referenced].filter((k) => !objects.has(k)))
    console.log('orphan files at the root:', orphans.length, `(${(orphans.reduce((a, k) => a + objects.get(k), 0) / 1e6).toFixed(1)} MB)`)
  } else if (step === 'copy') {
    let copied = 0
    let skipped = 0
    for (const d of moving)
      for (const f of d.files) {
        const to = `${target(d)}/${f}`
        if (objects.get(to) === objects.get(f)) {
          skipped++
          continue
        }
        if (!objects.has(f)) throw new Error(`missing source ${f} (media ${d.id})`)
        await s3.send(new CopyObjectCommand({ Bucket, Key: to, CopySource: `${Bucket}/${encodeURIComponent(f)}` }))
        const head = await s3.send(new HeadObjectCommand({ Bucket, Key: to }))
        if (head.ContentLength !== objects.get(f)) throw new Error(`size mismatch after copying ${f}`)
        copied++
      }
    console.log(`copied ${copied}, already there ${skipped}`)
  } else if (step === 'db') {
    let updated = 0
    await q('begin')
    for (const d of moving) {
      const missing = d.files.filter((f) => objects.get(`${target(d)}/${f}`) !== objects.get(f))
      if (missing.length) throw new Error(`media ${d.id}: copies missing for ${missing.join(', ')} (run copy first)`)
      await q(`update htad.media set prefix = $1, category = $2 where id = $3 and prefix = ''`, [target(d), d.cat, d.id])
      updated++
    }
    // documents already moved keep their folder; only make sure their category matches it
    await q(`update htad.media set category = split_part(prefix, '/', 2)::htad.enum_media_category where prefix like 'media/%' and category::text <> split_part(prefix, '/', 2)`)
    await q('commit')
    console.log(`pointed ${updated} documents at media/<category>/`)
  } else if (step === 'orphans') {
    if (!arg) throw new Error('usage: orphans <backup dir>')
    mkdirSync(arg, { recursive: true })
    for (const k of orphans) {
      const body = await (await s3.send(new GetObjectCommand({ Bucket, Key: k }))).Body.transformToByteArray()
      if (body.length !== objects.get(k)) throw new Error(`backup of ${k} is incomplete`)
      writeFileSync(join(arg, k), body)
    }
    writeFileSync(join(arg, '_list.txt'), orphans.join('\n') + '\n')
    for (let i = 0; i < orphans.length; i += 1000) {
      const r = await s3.send(new DeleteObjectsCommand({ Bucket, Delete: { Objects: orphans.slice(i, i + 1000).map((Key) => ({ Key })) } }))
      if (r.Errors?.length) throw new Error(`delete failed: ${JSON.stringify(r.Errors.slice(0, 3))}`)
    }
    console.log(`backed up ${orphans.length} orphan files to ${arg} and deleted them from R2`)
  } else if (step === 'cleanup-root') {
    const old = docs
      .filter((d) => d.prefix.startsWith('media/'))
      .flatMap((d) => d.files.filter((f) => objects.has(f) && objects.get(key(d.prefix, f)) === objects.get(f)))
    for (let i = 0; i < old.length; i += 1000) {
      const r = await s3.send(new DeleteObjectsCommand({ Bucket, Delete: { Objects: old.slice(i, i + 1000).map((Key) => ({ Key })) } }))
      if (r.Errors?.length) throw new Error(`delete failed: ${JSON.stringify(r.Errors.slice(0, 3))}`)
    }
    console.log(`deleted ${old.length} old root copies`)
  } else {
    console.log('steps: plan | copy | db | orphans <backup dir> | cleanup-root')
  }
} catch (error) {
  await db.query('rollback').catch(() => {})
  throw error
} finally {
  await db.end()
}
