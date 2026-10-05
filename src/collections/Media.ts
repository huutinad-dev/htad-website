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
  ]),
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 480 },
      { name: 'card', width: 960 },
    ],
  },
}
