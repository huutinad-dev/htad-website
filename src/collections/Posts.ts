import { slugField, type CollectionConfig } from 'payload'

import { revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'
import { t, withLabels } from '../i18n/admin'

export const postTypes = ['news', 'event'] as const

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: t('Insight', 'Bài viết'), plural: t('Insights', 'Tin tức') },
  admin: {
    group: t('Content', 'Nội dung'),
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'publishedAt', '_status'],
  },
  access: {
    // visitors only see published posts; editors also see drafts
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
  },
  defaultSort: '-publishedAt',
  // "Save draft" / "Publish" in the admin; only published posts appear on the site
  versions: { drafts: true, maxPerDoc: 10 },
  hooks: {
    afterChange: [revalidateCollection],
    afterDelete: [revalidateCollectionDelete],
  },
  fields: withLabels([
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      admin: { description: t('Short summary shown on the Insights list and in link previews.', 'Tóm tắt ngắn hiển thị ở danh sách Tin tức và khi chia sẻ link.') },
    },
    { name: 'cover', type: 'upload', relationTo: 'media', required: true },
    { name: 'body', type: 'richText', localized: true },
    {
      name: 'sourceUrl',
      label: t('Original post link', 'Link bài gốc'),
      type: 'text',
      admin: {
        description: t(
          'Optional link to the original post (e.g. a Facebook fanpage post). Shown as a button on the article. If the article has no body, the card on the Insights list opens this link directly.',
          'Link tới bài gốc, không bắt buộc (vd. bài trên fanpage Facebook). Hiển thị thành nút trong bài viết. Nếu bài không có nội dung, thẻ ở danh sách Tin tức sẽ mở thẳng link này.',
        ),
      },
    },
    slugField(),
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'news',
      options: [
        { label: t('News', 'Tin tức'), value: 'news' },
        { label: t('Event', 'Sự kiện'), value: 'event' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      label: t('Date', 'Ngày đăng'),
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } },
    },
  ]),
}
