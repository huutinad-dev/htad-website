import { slugField, type CollectionConfig } from 'payload'

import { revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    group: 'Content',
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
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true, localized: true },
            {
              name: 'subtitle',
              type: 'text',
              localized: true,
              admin: { description: 'Client or context line, e.g. "Vietnam Professional Football Leagues".' },
            },
            {
              name: 'partner',
              type: 'text',
              localized: true,
              admin: { description: 'Partner / client, e.g. "VPF × Thomas Lyte". Shown on the card and the project page.' },
            },
            {
              name: 'role',
              label: 'HTAd’s role',
              type: 'text',
              localized: true,
              admin: { description: 'What HTAd did, e.g. "Consultancy & event organisation".' },
            },
            { name: 'excerpt', type: 'textarea', localized: true },
            { name: 'body', type: 'richText', localized: true },
            {
              name: 'quote',
              type: 'text',
              localized: true,
              admin: { description: 'Optional slogan / tagline highlighted on the page.' },
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            { name: 'cover', type: 'upload', relationTo: 'media', required: true },
            { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
            { name: 'logo', type: 'upload', relationTo: 'media' },
            {
              name: 'videoUrl',
              type: 'text',
              admin: { description: 'YouTube link — shown as a "Watch" button with an embedded player.' },
            },
            {
              name: 'externalUrl',
              type: 'text',
              admin: { description: 'Optional external link (press article, campaign page…).' },
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
  ],
}
