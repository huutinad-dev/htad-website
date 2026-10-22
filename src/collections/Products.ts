import { slugField, type CollectionConfig } from 'payload'

import { revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'
import { t, withLabels } from '../i18n/admin'

// Products the company sells elsewhere (its books on Shopee, its own website…). The Shop page
// lists the visible ones in this list's order; each has its own page (/shop/<slug>), and the
// card and the page link out to where it is sold.
export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: t('Product', 'Sản phẩm'), plural: t('Products', 'Sản phẩm') },
  admin: {
    group: t('Shop', 'Cửa hàng'),
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
      type: 'row',
      fields: [
        {
          name: 'authors',
          label: t('Authors', 'Tác giả'),
          type: 'text',
          hasMany: true,
          admin: {
            placeholder: t('Type a name, then press Enter', 'Gõ tên rồi nhấn Enter'),
            description: t(
              'Optional, one or more, shown on the product page in this order.',
              'Không bắt buộc, một hoặc nhiều người, hiện ở trang sản phẩm theo thứ tự này.',
            ),
          },
        },
        {
          name: 'year',
          label: t('Year published', 'Năm xuất bản'),
          type: 'text',
          admin: {
            placeholder: '2026',
            description: t('Optional, shown on the product page.', 'Không bắt buộc, hiện ở trang sản phẩm.'),
          },
        },
      ],
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
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      admin: {
        description: t(
          'Short description on the Shop card and at the top of the product page.',
          'Mô tả ngắn trên thẻ ở trang Shop và ở đầu trang sản phẩm.',
        ),
      },
    },
    {
      name: 'body',
      type: 'richText',
      localized: true,
      admin: {
        description: t(
          'Optional. The full description on the product page (contents, about the author, images, videos…).',
          'Không bắt buộc. Mô tả đầy đủ ở trang sản phẩm (nội dung sách, tác giả, hình ảnh, video…).',
        ),
      },
    },
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
      // Replaced by `authors` (its values were copied there). Hidden and kept so the column
      // isn't dropped while deployed code still reads it.
      name: 'author',
      type: 'text',
      admin: { hidden: true },
    },
    slugField(),
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
