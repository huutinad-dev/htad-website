import type { CollectionConfig } from 'payload'

import { t, withLabels } from '../i18n/admin'

const readOnly = { admin: { readOnly: true } }

// Submissions of the contact form. They are written by the form's server action only
// (src/app/(frontend)/[locale]/contact/actions.ts), so nothing can be created over the API.
export const Messages: CollectionConfig = {
  slug: 'messages',
  labels: { singular: t('Contact message', 'Tin nhắn liên hệ'), plural: t('Contact messages', 'Tin nhắn liên hệ') },
  admin: {
    group: t('Admin', 'Quản trị'),
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'company', 'createdAt'],
  },
  access: {
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: '-createdAt',
  fields: withLabels([
    { name: 'name', type: 'text', required: true, ...readOnly },
    { name: 'email', type: 'email', required: true, ...readOnly },
    { name: 'company', type: 'text', ...readOnly },
    { name: 'message', type: 'textarea', required: true, ...readOnly },
  ]),
}
