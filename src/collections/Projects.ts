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
              admin: {
                description: t(
                  'Client or context line, e.g. "Vietnam Professional Football Leagues".',
                  'Dòng khách hàng hoặc bối cảnh, vd. "Vietnam Professional Football Leagues".',
                ),
              },
            },
            {
              name: 'partners',
              type: 'relationship',
              relationTo: 'partners',
              hasMany: true,
              admin: {
                // pick only: partners are edited in the Partners list
                allowEdit: false,
                description: t(
                  'Partners / clients of this project, picked from the Partners list. Their logos show on the project page.',
                  'Đối tác / khách hàng của dự án, chọn từ danh sách Đối tác. Logo của họ hiển thị ở trang dự án.',
                ),
              },
            },
            {
              // Replaced by `partners`. Still shown on the site for projects that have no partner
              // picked yet; hidden in the admin and kept so the text isn't lost.
              name: 'partner',
              type: 'text',
              localized: true,
              admin: { hidden: true },
            },
            {
              name: 'role',
              label: t('HTAd’s role', 'Vai trò của HTAd'),
              type: 'text',
              localized: true,
              admin: {
                description: t(
                  'What HTAd did, e.g. "Consultancy & event organisation".',
                  'Việc HTAd đã làm, vd. "Tư vấn & tổ chức sự kiện".',
                ),
              },
            },
            { name: 'year', type: 'text' },
            { name: 'excerpt', type: 'textarea', localized: true },
            { name: 'body', type: 'richText', localized: true },
            {
              name: 'quote',
              type: 'text',
              localized: true,
              admin: {
                description: t(
                  'Optional slogan / tagline highlighted on the page.',
                  'Slogan / khẩu hiệu (không bắt buộc) được làm nổi bật trên trang.',
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
            {
              name: 'galleryLayout',
              label: t('Gallery layout', 'Kiểu hiển thị thư viện ảnh'),
              type: 'radio',
              defaultValue: 'landscape',
              options: [
                {
                  label: t('Landscape (wide images)', 'Ngang (ảnh nằm ngang)'),
                  value: 'landscape',
                },
                { label: t('Portrait (tall images)', 'Dọc (ảnh đứng)'), value: 'portrait' },
              ],
              admin: {
                layout: 'horizontal',
                description: t(
                  'Pick the shape most gallery images have. Images are never cropped; this sets how many fit per row.',
                  'Chọn theo dạng của đa số ảnh. Ảnh không bị cắt; tuỳ chọn này quyết định số ảnh mỗi hàng.',
                ),
              },
            },
            { name: 'logo', type: 'upload', relationTo: 'media' },
            {
              name: 'videoUrl',
              type: 'text',
              admin: {
                description: t(
                  'YouTube link — shown as a "Watch" button with an embedded player.',
                  'Link YouTube — hiển thị thành nút "Xem video" kèm trình phát nhúng.',
                ),
              },
            },
            {
              name: 'externalUrl',
              type: 'text',
              admin: {
                description: t(
                  'Optional external link (press article, campaign page…).',
                  'Link ngoài không bắt buộc (bài báo, trang chiến dịch…).',
                ),
              },
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
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ]),
}
