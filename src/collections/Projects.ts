import { slugField, type CollectionConfig } from 'payload'

import { revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'
import { t, withLabels } from '../i18n/admin'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: t('Project', 'Dự án'), plural: t('Projects', 'Dự án') },
  admin: {
    group: t('Content', 'Nội dung'),
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'featured', 'updatedAt'],
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
              name: 'subtitle',
              type: 'text',
              localized: true,
              admin: { description: t('Client or context line, e.g. "Vietnam Professional Football Leagues".', 'Dòng khách hàng hoặc bối cảnh, vd. "Vietnam Professional Football Leagues".') },
            },
            {
              name: 'partner',
              type: 'text',
              localized: true,
              admin: { description: t('Partner / client, e.g. "VPF × Thomas Lyte". Shown on the card and the project page.', 'Đối tác / khách hàng, vd. "VPF × Thomas Lyte". Hiển thị trên thẻ và trang dự án.') },
            },
            {
              name: 'role',
              label: t('HTAd’s role', 'Vai trò của HTAd'),
              type: 'text',
              localized: true,
              admin: { description: t('What HTAd did, e.g. "Consultancy & event organisation".', 'Việc HTAd đã làm, vd. "Tư vấn & tổ chức sự kiện".') },
            },
            { name: 'excerpt', type: 'textarea', localized: true },
            { name: 'body', type: 'richText', localized: true },
            {
              name: 'quote',
              type: 'text',
              localized: true,
              admin: { description: t('Optional slogan / tagline highlighted on the page.', 'Slogan / khẩu hiệu (không bắt buộc) được làm nổi bật trên trang.') },
            },
          ],
        },
        {
          label: t('Media', 'Hình ảnh'),
          fields: [
            { name: 'cover', type: 'upload', relationTo: 'media', required: true },
            { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
            { name: 'logo', type: 'upload', relationTo: 'media' },
            {
              name: 'videoUrl',
              type: 'text',
              admin: { description: t('YouTube link — shown as a "Watch" button with an embedded player.', 'Link YouTube — hiển thị thành nút "Xem video" kèm trình phát nhúng.') },
            },
            {
              name: 'externalUrl',
              type: 'text',
              admin: { description: t('Optional external link (press article, campaign page…).', 'Link ngoài không bắt buộc (bài báo, trang chiến dịch…).') },
            },
          ],
        },
      ],
    },
    slugField(),
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'project-categories',
      required: true,
      admin: { position: 'sidebar' },
    },
    { name: 'year', type: 'text', admin: { position: 'sidebar' } },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ]),
}
