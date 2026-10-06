import type { CollectionConfig } from 'payload'

import { revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'
import { t, withLabels } from '../i18n/admin'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: t('Image', 'Hình ảnh'), plural: t('Media', 'Thư viện ảnh') },
  admin: {
    group: t('Content', 'Nội dung'),
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateCollection],
    afterDelete: [revalidateCollectionDelete],
  },
  fields: withLabels([
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'link',
      type: 'text',
      admin: {
        description: t(
          'Optional, for partner logos: the full address (https://…) to open when the logo is clicked.',
          'Không bắt buộc, dùng cho logo đối tác: địa chỉ đầy đủ (https://…) sẽ mở khi bấm vào logo.',
        ),
      },
    },
  ]),
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    focalPoint: true,
    // Files are public. Let Vercel's CDN keep a copy (and serve it while refreshing in the
    // background) so a cold function or a slow storage read never leaves an image missing.
    // Browsers still revalidate, and the site links files with a `?v=` version (lib/media.ts).
    modifyResponseHeaders: ({ headers }) => {
      headers.set('CDN-Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400')
      return headers
    },
    imageSizes: [
      { name: 'thumbnail', width: 480 },
      { name: 'card', width: 960 },
    ],
  },
}
