import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '../hooks/revalidate'
import { t, withLabels } from '../i18n/admin'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: t('Site settings', 'Cấu hình chung'),
  admin: { group: t('Admin', 'Quản trị') },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: withLabels([
    {
      type: 'tabs',
      tabs: [
        {
          label: t('Brand', 'Thương hiệu'),
          fields: [
            { name: 'companyName', type: 'text', required: true, localized: true },
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
            {
              name: 'showFacebookFeed',
              label: t('Show the Facebook feed on Insights', 'Hiện bảng tin Facebook ở trang Insights'),
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: t(
                  "Facebook's page plugin currently shows only the page header, without posts, so the fanpage card is hidden from Insights. Checked automatically every 2 hours and switched on once the feed shows posts again (and off if it breaks).",
                  'Plugin fanpage của Facebook hiện chỉ hiện tên trang, không hiện bài đăng, nên thẻ fanpage đang được ẩn khỏi trang Insights. Hệ thống tự kiểm tra mỗi 2 tiếng: tự bật khi bảng tin hiện bài trở lại (và tự tắt nếu lỗi lại).',
                ),
              },
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
