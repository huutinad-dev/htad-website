import { slugField, type CollectionConfig } from 'payload'

import { revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  defaultSort: 'order',
  hooks: {
    afterChange: [revalidateCollection],
    afterDelete: [revalidateCollectionDelete],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true, localized: true },
            {
              name: 'headline',
              type: 'text',
              localized: true,
              admin: { description: 'Optional headline shown on the detail page.' },
            },
            {
              name: 'excerpt',
              type: 'textarea',
              required: true,
              localized: true,
              admin: { description: 'Short summary used on cards and the home page.' },
            },
            { name: 'body', type: 'richText', localized: true },
            {
              name: 'highlights',
              type: 'array',
              localized: true,
              labels: { singular: 'Highlight', plural: 'Highlights' },
              fields: [{ name: 'text', type: 'text', required: true }],
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            { name: 'cover', type: 'upload', relationTo: 'media', required: true },
            { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
            { name: 'galleryCaption', type: 'text', localized: true },
            {
              name: 'partnerLogos',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              admin: { description: 'Transparent PNG logos of partners / rights.' },
            },
          ],
        },
        {
          label: 'Related',
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
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
