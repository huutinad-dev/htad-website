import { slugField, type CollectionConfig } from 'payload'

import { revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'
import { t, withLabels } from '../i18n/admin'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: t('Service', 'Dịch vụ'), plural: t('Services', 'Dịch vụ') },
  admin: {
    group: t('Content', 'Nội dung'),
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
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
    {
      type: 'tabs',
      tabs: [
        {
          label: t('Content', 'Nội dung'),
          fields: [
            { name: 'title', type: 'text', required: true, localized: true },
            {
              name: 'headline',
              type: 'text',
              localized: true,
              admin: {
                description: t(
                  'Optional headline shown on the detail page.',
                  'Tiêu đề phụ (không bắt buộc) hiển thị ở trang chi tiết.',
                ),
              },
            },
            {
              name: 'excerpt',
              type: 'textarea',
              required: true,
              localized: true,
              admin: {
                description: t(
                  'Short summary used on cards and the home page.',
                  'Tóm tắt ngắn dùng trên thẻ và trang chủ.',
                ),
              },
            },
            { name: 'body', type: 'richText', localized: true },
            {
              name: 'highlights',
              type: 'array',
              localized: true,
              labels: {
                singular: t('Highlight', 'Điểm nổi bật'),
                plural: t('Highlights', 'Điểm nổi bật'),
              },
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            {
              name: 'partners',
              type: 'relationship',
              relationTo: 'partners',
              hasMany: true,
              admin: {
                // pick only: partners are created and edited in the Partners list
                allowCreate: false,
                allowEdit: false,
                description: t(
                  'Partners / rights holders for this service. Their order follows the Partners list (drag to reorder there).',
                  'Đối tác / đơn vị bản quyền của dịch vụ này. Thứ tự theo danh sách Đối tác (kéo thả ở đó để sắp xếp).',
                ),
              },
            },
          ],
        },
        {
          label: t('Media', 'Hình ảnh'),
          fields: [
            { name: 'cover', type: 'upload', relationTo: 'media', required: true },
            { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
            { name: 'galleryCaption', type: 'textarea', localized: true },
          ],
        },
        {
          label: t('Related', 'Liên quan'),
          fields: [
            {
              name: 'relatedProjects',
              type: 'relationship',
              relationTo: 'projects',
              hasMany: true,
            },
          ],
        },
      ],
    },
    slugField(),
  ]),
}
