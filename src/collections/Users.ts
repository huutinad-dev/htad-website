import type { CollectionConfig } from 'payload'

import { t, withLabels } from '../i18n/admin'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: t('User', 'Người dùng'), plural: t('Users', 'Người dùng') },
  admin: {
    group: t('Admin', 'Quản trị'),
    useAsTitle: 'email',
  },
  auth: true,
  fields: withLabels([{ name: 'name', type: 'text' }]),
}
