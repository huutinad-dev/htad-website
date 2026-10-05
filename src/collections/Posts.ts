import { slugField, type CollectionConfig } from 'payload'

import { revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'

export const postTypes = ['news', 'event'] as const

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Insight', plural: 'Insights' },
  admin: {
    group: 'Content',
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
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      admin: { description: 'Short summary shown on the Insights list and in link previews.' },
    },
    { name: 'cover', type: 'upload', relationTo: 'media', required: true },
    { name: 'body', type: 'richText', localized: true },
    {
      name: 'sourceUrl',
      label: 'Original post link',
      type: 'text',
      admin: {
        description:
          'Optional link to the original post (e.g. a Facebook fanpage post). Shown as a button on the article. If the article has no body, the card on the Insights list opens this link directly.',
      },
    },
    slugField(),
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'news',
      options: [
        { label: 'News', value: 'news' },
        { label: 'Event', value: 'event' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      label: 'Date',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } },
    },
  ],
}
