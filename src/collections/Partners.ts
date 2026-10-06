import type { CollectionConfig } from 'payload'

import { PARTNER_LOGO_MAX, resizePartnerLogo } from '../hooks/resizePartnerLogo'
import { revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'
import { t, withLabels } from '../i18n/admin'

// The partner list. The home page strip shows the partners switched to visible, in this
// list's order; projects and services pick their own partners here and always show them.
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
        // an empty link shows as an empty cell in the list, not "<No Link>"
        components: { Cell: '/components/admin/PlainTextCell#PlainTextCell' },
      },
    },
    {
      name: 'visible',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: t(
          'Shows this partner in the partner strip on the home page. Projects and services always show the partners picked on them.',
          'Hiển thị đối tác trong dải đối tác ở trang chủ. Dự án và dịch vụ luôn hiện các đối tác đã được chọn.',
        ),
        // a switch instead of a checkbox; in the list view it saves immediately
        components: {
          Cell: '/components/admin/VisibleToggle#VisibleToggleCell',
          Field: '/components/admin/VisibleToggle#VisibleToggleField',
        },
      },
    },
  ]),
}
