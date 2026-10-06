import type { CollectionConfig } from 'payload'

import { PARTNER_LOGO_MAX, resizePartnerLogo } from '../hooks/resizePartnerLogo'
import { revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'
import { t, withLabels } from '../i18n/admin'

// The partner list. The home page shows every visible partner, in this list's order;
// each service picks its own partners from here.
export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: { singular: t('Partner', 'Đối tác'), plural: t('Partners', 'Đối tác') },
  admin: {
    group: t('Content', 'Nội dung'),
    useAsTitle: 'name',
    defaultColumns: ['name', 'logo', 'link', 'visible'],
  },
  access: {
    read: () => true,
  },
  // drag-and-drop ordering in the admin list view (stored in a hidden `_order` field)
  orderable: true,
  defaultSort: '_order',
  hooks: {
    // resize first, so the cache purge that follows already sees the smaller logo
    afterChange: [resizePartnerLogo, revalidateCollection],
    afterDelete: [revalidateCollectionDelete],
  },
  fields: withLabels([
    { name: 'name', type: 'text', required: true },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: t(
          `Transparent PNG works best. Larger images are scaled down to fit ${PARTNER_LOGO_MAX}px (proportions kept) when the partner is saved.`,
          `Nên dùng PNG nền trong suốt. Ảnh lớn hơn sẽ tự thu về tối đa ${PARTNER_LOGO_MAX}px (giữ tỉ lệ) khi lưu đối tác.`,
        ),
      },
    },
    {
      name: 'link',
      type: 'text',
      admin: {
        description: t(
          'Optional: the full address (https://…) to open when the logo is clicked.',
          'Không bắt buộc: địa chỉ đầy đủ (https://…) sẽ mở khi bấm vào logo.',
        ),
      },
    },
    {
      name: 'visible',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: t('Turn off to hide this partner from the website.', 'Tắt để ẩn đối tác này khỏi website.'),
        // a switch instead of a checkbox; in the list view it saves immediately
        components: {
          Cell: '/components/admin/VisibleToggle#VisibleToggleCell',
          Field: '/components/admin/VisibleToggle#VisibleToggleField',
        },
      },
    },
  ]),
}
