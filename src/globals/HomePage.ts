import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '../hooks/revalidate'
import { t, withLabels } from '../i18n/admin'

const sectionIntro = (name: string, label: ReturnType<typeof t>) => ({
  name,
  label,
  type: 'group' as const,
  fields: [
    { name: 'eyebrow', type: 'text' as const, localized: true },
    { name: 'heading', type: 'text' as const, localized: true },
    { name: 'text', type: 'textarea' as const, localized: true },
  ],
})

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: t('Home page', 'Trang chủ'),
  admin: { group: t('Pages', 'Trang') },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: withLabels([
    {
      type: 'tabs',
      tabs: [
        {
          label: t('Hero', 'Phần mở đầu (Hero)'),
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                { name: 'eyebrow', type: 'text', localized: true },
                {
                  name: 'title',
                  type: 'textarea',
                  localized: true,
                  required: true,
                  admin: { description: t('Each line break becomes a separately animated line.', 'Mỗi lần xuống dòng sẽ thành một dòng có hiệu ứng riêng.') },
                },
                { name: 'subtitle', type: 'textarea', localized: true },
                {
                  name: 'slides',
                  type: 'upload',
                  relationTo: 'media',
                  hasMany: true,
                  admin: { description: t('Background slideshow images.', 'Ảnh nền trình chiếu.') },
                },
              ],
            },
            {
              name: 'marquee',
              type: 'array',
              localized: true,
              admin: { description: t('Scrolling keywords under the hero.', 'Các từ khoá chạy ngang bên dưới phần mở đầu.') },
              fields: [{ name: 'text', type: 'text', required: true }],
            },
          ],
        },
        {
          label: t('Key figures', 'Số liệu'),
          fields: [
            {
              name: 'stats',
              type: 'array',
              localized: true,
              maxRows: 4,
              fields: [
                { name: 'value', type: 'number', required: true },
                { name: 'prefix', type: 'text' },
                { name: 'suffix', type: 'text' },
                { name: 'label', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: t('Sections', 'Các phần'),
          fields: [
            sectionIntro('servicesSection', t('Services section', 'Phần dịch vụ')),
            sectionIntro('projectsSection', t('Projects section', 'Phần dự án')),
            {
              name: 'featuredProjects',
              type: 'relationship',
              relationTo: 'projects',
              hasMany: true,
              admin: { description: t('Projects shown on the home page (leave empty to use "featured").', 'Dự án hiển thị ở trang chủ (để trống sẽ dùng các dự án "nổi bật").') },
            },
            {
              name: 'partnerLogos',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
            },
            {
              name: 'cta',
              type: 'group',
              fields: [
                { name: 'heading', type: 'text', localized: true },
                { name: 'text', type: 'textarea', localized: true },
              ],
            },
          ],
        },
      ],
    },
  ]),
}
