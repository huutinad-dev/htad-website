/**
 * One-off: copy every file in the local /media folder (originals + generated sizes)
 * to Cloudflare R2 under the same filename, so existing media records keep working.
 *   npx tsx scripts/upload-media-to-r2.ts
 * Needs R2_BUCKET, R2_ENDPOINT, R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY (e.g. in .env).
 * Safe to re-run: existing objects are overwritten.
 */
import 'dotenv/config'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'

const { R2_BUCKET, R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env
if (!R2_BUCKET || !R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  throw new Error('R2_BUCKET, R2_ENDPOINT, R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY must be set')
}

const client = new S3Client({
  endpoint: R2_ENDPOINT,
  region: 'auto',
  forcePathStyle: true,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
})

const dir = path.resolve('media')
const types: Record<string, string> = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' }
const files = fs.readdirSync(dir).filter((f) => types[path.extname(f).toLowerCase()])

let done = 0
const queue = [...files]
await Promise.all(
  Array.from({ length: 6 }, async () => {
    for (let f = queue.shift(); f; f = queue.shift()) {
      await client.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET,
          Key: f,
          Body: fs.readFileSync(path.join(dir, f)),
          ContentType: types[path.extname(f).toLowerCase()],
          CacheControl: `public, max-age=${365 * 24 * 60 * 60}`,
        }),
      )
      console.log(`[${++done}/${files.length}] ${f}`)
    }
  }),
)
console.log('done')
