import type { CollectionConfig } from 'payload'

import { revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'
import { t, withLabels } from '../i18n/admin'

/** Storage folders, by what the image is for. Existing files were sorted by where they are used. */
export const mediaCategories = ['projects', 'services', 'insights', 'shop', 'partners', 'site', 'library'] as const

const mediaCategoryLabels: Record<(typeof mediaCategories)[number], ReturnType<typeof t>> = {
  projects: t('Projects', 'Dự án'),
  services: t('Services', 'Dịch vụ'),
  insights: t('Insights', 'Tin tức'),
  shop: t('Shop', 'Cửa hàng'),
  partners: t('Partners', 'Đối tác'),
  site: t('Site (logo, home, about)', 'Website (logo, trang chủ, giới thiệu)'),
  library: t('Library (other)', 'Thư viện (khác)'),
}

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: t('Image', 'Hình ảnh'), plural: t('Media', 'Thư viện ảnh') },
  admin: {
    group: t('Library', 'Thư viện'),
  },
  access: {
    read: () => true,
  },
  hooks: {
    // a new or replaced file is stored in the folder of its category: media/<category>/<file>
    // (the storage plugin nests the prefix under the collection's `media` prefix)
    beforeChange: [
      ({ data, req }) => {
        if (req.file && data.category) data.prefix = data.category
        return data
      },
    ],
    afterChange: [revalidateCollection],
    afterDelete: [revalidateCollectionDelete],
  },
  fields: withLabels([
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'library',
      options: mediaCategories.map((value) => ({ value, label: mediaCategoryLabels[value] })),
      // the folder is decided by the upload; changing it later would not move the file
      access: { update: () => false },
      admin: {
        position: 'sidebar',
        description: t(
          'Where the file is stored (media/<category>/). Chosen when uploading.',
          'Thư mục lưu file (media/<danh mục>/). Chọn khi tải ảnh lên.',
        ),
      },
    },
    {
      name: 'alt',
      type: 'text',
      admin: {
        description: t(
          'Optional. A short description of the image, read by screen readers and search engines.',
          'Không bắt buộc. Mô tả ngắn về ảnh, dùng cho trình đọc màn hình và công cụ tìm kiếm.',
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
