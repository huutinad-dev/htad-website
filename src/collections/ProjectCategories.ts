import { slugField, type CollectionConfig } from 'payload'

import { revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'

export const ProjectCategories: CollectionConfig = {
  slug: 'project-categories',
  labels: { singular: 'Project category', plural: 'Project categories' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order'],
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
    { name: 'title', type: 'text', required: true, localized: true },
    slugField(),
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
