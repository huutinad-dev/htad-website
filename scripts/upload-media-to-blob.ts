/**
 * One-off: copy every file in the local /media folder (originals + generated sizes)
 * to Vercel Blob under the same filename, so existing media records keep working.
 *   BLOB_READ_WRITE_TOKEN=... npx tsx scripts/upload-media-to-blob.ts
 * (or put the token in .env). Safe to re-run: existing blobs are overwritten.
 */
import 'dotenv/config'
import { put } from '@vercel/blob'
import fs from 'fs'
import path from 'path'

const token = process.env.BLOB_READ_WRITE_TOKEN
if (!token) throw new Error('BLOB_READ_WRITE_TOKEN is not set')

const dir = path.resolve('media')
const types: Record<string, string> = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' }
const files = fs.readdirSync(dir).filter((f) => types[path.extname(f).toLowerCase()])

let done = 0
const queue = [...files]
await Promise.all(
  Array.from({ length: 6 }, async () => {
    for (let f = queue.shift(); f; f = queue.shift()) {
      await put(f, fs.readFileSync(path.join(dir, f)), {
        access: 'public',
        token,
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: types[path.extname(f).toLowerCase()],
        cacheControlMaxAge: 365 * 24 * 60 * 60,
      })
      console.log(`[${++done}/${files.length}] ${f}`)
    }
  }),
)
console.log('done')
