import type { CollectionConfig } from 'payload'

import { revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'
import { t, withLabels } from '../i18n/admin'

// The partner list. The home page and each service pick which partners to show from here.
export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: { singular: t('Partner', 'Đối tác'), plural: t('Partners', 'Đối tác') },
  admin: {
    group: t('Content', 'Nội dung'),
    useAsTitle: 'name',
    defaultColumns: ['name', 'logo', 'link'],
  },
  access: {
    read: () => true,
  },
  // drag-and-drop ordering in the admin list view (stored in a hidden `_order` field)
  orderable: true,
  defaultSort: '_order',
  hooks: {
    afterChange: [revalidateCollection],
    afterDelete: [revalidateCollectionDelete],
  },
  fields: withLabels([
    { name: 'name', type: 'text', required: true },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: t('Transparent PNG works best.', 'Nên dùng PNG nền trong suốt.') },
    },
    {
      name: 'link',
      type: 'text',
      admin: {
        description: t(
          'Optional: the full address (https://…) to open when the logo is clicked.',
          'Không bắt buộc: địa chỉ đầy đủ (https://…) sẽ mở khi bấm vào logo.',
        ),
      },
    },
  ]),
}
