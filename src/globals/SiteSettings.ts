import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '../hooks/revalidate'
import { t, withLabels } from '../i18n/admin'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: t('Site settings', 'Cấu hình chung'),
  admin: { group: t('Pages', 'Trang') },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: withLabels([
    {
      type: 'tabs',
      tabs: [
        {
          label: t('Brand', 'Thương hiệu'),
          fields: [
            { name: 'companyName', type: 'text', required: true },
            { name: 'shortName', type: 'text' },
            { name: 'tagline', type: 'text', localized: true },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              admin: { description: t('Horizontal logo used in the header.', 'Logo ngang dùng ở đầu trang.') },
            },
            {
              name: 'logoStacked',
              type: 'upload',
              relationTo: 'media',
              admin: { description: t('Stacked logo used in the footer / contact page.', 'Logo xếp dọc dùng ở footer / trang liên hệ.') },
            },
          ],
        },
        {
          label: t('Contact', 'Liên hệ'),
          fields: [
            {
              name: 'contactPage',
              label: t('Contact page', 'Trang liên hệ'),
              type: 'group',
              fields: [
                { name: 'heading', type: 'text', localized: true },
                { name: 'lead', type: 'textarea', localized: true },
              ],
            },
            {
              name: 'contact',
              type: 'group',
              fields: [
                { name: 'phone', type: 'text' },
                { name: 'email', type: 'email' },
                { name: 'website', type: 'text' },
                { name: 'address', type: 'textarea', localized: true },
                { name: 'city', type: 'text', localized: true },
                {
                  name: 'mapUrl',
                  type: 'text',
                  admin: { description: t('Google Maps link for the address.', 'Link Google Maps của địa chỉ.') },
                },
              ],
            },
            {
              name: 'social',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  admin: { description: t('Facebook / YouTube / Instagram / TikTok / LinkedIn links get their own icon.', 'Link Facebook / YouTube / Instagram / TikTok / LinkedIn sẽ có biểu tượng riêng.') },
                },
              ],
            },
          ],
        },
        {
          label: t('Footer & SEO', 'Footer & SEO'),
          fields: [
            { name: 'footerText', type: 'textarea', localized: true },
            { name: 'seoTitle', type: 'text', localized: true },
            { name: 'seoDescription', type: 'textarea', localized: true },
            { name: 'ogImage', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
  ]),
}
