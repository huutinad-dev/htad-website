import { slugField, type CollectionConfig } from 'payload'

import { revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'
import { t, withLabels } from '../i18n/admin'

export const ProjectCategories: CollectionConfig = {
  slug: 'project-categories',
  labels: { singular: t('Project category', 'Danh mục dự án'), plural: t('Project categories', 'Danh mục dự án') },
  admin: {
    group: t('Content', 'Nội dung'),
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
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
    { name: 'title', type: 'text', required: true, localized: true },
    slugField(),
  ]),
}
