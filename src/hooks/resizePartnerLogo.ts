import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import fs from 'fs/promises'
import path from 'path'
import type { CollectionAfterChangeHook } from 'payload'
import sharp from 'sharp'

/** Longest side of a partner logo, in pixels. */
export const PARTNER_LOGO_MAX = 500

// Reads a media file from where the Media collection stores it: R2 when configured
// (see payload.config.ts), otherwise the local /media folder.
const readMediaFile = async (filename: string): Promise<Buffer> => {
  const { R2_BUCKET, R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env
  if (R2_BUCKET && R2_ENDPOINT && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY) {
    const client = new S3Client({
      endpoint: R2_ENDPOINT,
      region: 'auto',
      forcePathStyle: true,
      credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
    })
    const object = await client.send(new GetObjectCommand({ Bucket: R2_BUCKET, Key: filename }))
    return Buffer.from(await object.Body!.transformToByteArray())
  }
  return fs.readFile(path.resolve('media', filename))
}

/**
 * When a partner is saved, its logo is scaled down to fit within PARTNER_LOGO_MAX on both
 * sides, keeping its proportions and format (so transparent PNGs stay transparent). Smaller
 * logos are left alone. The image itself is replaced in the media library, so a logo that is
 * also used elsewhere shrinks there too. A failure here never blocks saving the partner.
 */
export const resizePartnerLogo: CollectionAfterChangeHook = async ({ doc, req }) => {
  try {
    const id = typeof doc.logo === 'object' ? doc.logo?.id : doc.logo
    if (!id) return doc
    const media = await req.payload.findByID({ collection: 'media', id, depth: 0, req })
    const { filename, mimeType, width, height } = media
    // vector logos have no pixel size to reduce
    if (!filename || !mimeType || mimeType === 'image/svg+xml' || !width || !height) return doc
    if (Math.max(width, height) <= PARTNER_LOGO_MAX) return doc

    const resized = await sharp(await readMediaFile(filename))
      .resize({ width: PARTNER_LOGO_MAX, height: PARTNER_LOGO_MAX, fit: 'inside', withoutEnlargement: true })
      .toBuffer()
    await req.payload.update({
      collection: 'media',
      id,
      data: {},
      file: { data: resized, mimetype: mimeType, name: filename, size: resized.length },
      overwriteExistingFiles: true,
      req,
    })
    req.payload.logger.info(`partner logo ${filename}: ${width}×${height} scaled to fit ${PARTNER_LOGO_MAX}px`)
  } catch (error) {
    req.payload.logger.error({ err: error }, 'partner logo: could not resize')
  }
  return doc
}
