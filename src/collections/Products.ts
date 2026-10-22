import type { CollectionConfig } from 'payload'

import { revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'
import { t, withLabels } from '../i18n/admin'

// Products the company sells elsewhere (its books on Shopee, its own website…). The Shop page
// lists the visible ones in this list's order; each card links out to where it is sold.
export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: t('Product', 'Sản phẩm'), plural: t('Products', 'Sản phẩm') },
  admin: {
    group: t('Content', 'Nội dung'),
    useAsTitle: 'title',
    defaultColumns: ['title', 'cover', 'price', 'visible'],
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
    {
      name: 'author',
      type: 'text',
      admin: {
        description: t('Optional, e.g. the author of the book.', 'Không bắt buộc, vd. tác giả của cuốn sách.'),
      },
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: t(
          'Portrait (3:4), e.g. the book cover. The image is never cropped.',
          'Ảnh dọc (3:4), vd. bìa sách. Ảnh không bị cắt.',
        ),
      },
    },
    {
      name: 'price',
      type: 'text',
      admin: {
        description: t('Optional, shown as typed, e.g. "189.000đ".', 'Không bắt buộc, hiện đúng như nhập, vd. "189.000đ".'),
      },
    },
    { name: 'excerpt', type: 'textarea', localized: true },
    {
      name: 'links',
      type: 'array',
      minRows: 1,
      required: true,
      admin: {
        description: t(
          'Where to buy it. Each link is a button on the product card, the first one highlighted.',
          'Nơi bán sản phẩm. Mỗi link là một nút trên thẻ sản phẩm, nút đầu tiên được làm nổi bật.',
        ),
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          admin: { placeholder: 'Shopee' },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: { placeholder: 'https://…' },
        },
      ],
    },
    {
      name: 'visible',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: t('Shows this product on the Shop page.', 'Hiển thị sản phẩm ở trang Shop.'),
        // a switch instead of a checkbox; in the list view it saves immediately
        components: {
          Cell: '/components/admin/VisibleToggle#VisibleToggleCell',
          Field: '/components/admin/VisibleToggle#VisibleToggleField',
        },
      },
    },
  ]),
}
