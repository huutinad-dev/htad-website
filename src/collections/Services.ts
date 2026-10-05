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
              admin: { description: t('Optional headline shown on the detail page.', 'Tiêu đề phụ (không bắt buộc) hiển thị ở trang chi tiết.') },
            },
            {
              name: 'excerpt',
              type: 'textarea',
              required: true,
              localized: true,
              admin: { description: t('Short summary used on cards and the home page.', 'Tóm tắt ngắn dùng trên thẻ và trang chủ.') },
            },
            { name: 'body', type: 'richText', localized: true },
            {
              name: 'highlights',
              type: 'array',
              localized: true,
              labels: { singular: t('Highlight', 'Điểm nổi bật'), plural: t('Highlights', 'Điểm nổi bật') },
              fields: [{ name: 'text', type: 'text', required: true }],
            },
          ],
        },
        {
          label: t('Media', 'Hình ảnh'),
          fields: [
            { name: 'cover', type: 'upload', relationTo: 'media', required: true },
            { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
            { name: 'galleryCaption', type: 'text', localized: true },
            {
              name: 'partnerLogos',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              admin: { description: t('Transparent PNG logos of partners / rights.', 'Logo PNG nền trong suốt của đối tác / đơn vị bản quyền.') },
            },
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
