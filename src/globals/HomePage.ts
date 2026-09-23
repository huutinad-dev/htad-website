import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '../hooks/revalidate'

const sectionIntro = (name: string, label: string) => ({
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
  label: 'Home page',
  admin: { group: 'Pages' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
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
                  admin: { description: 'Each line break becomes a separately animated line.' },
                },
                { name: 'subtitle', type: 'textarea', localized: true },
                {
                  name: 'slides',
                  type: 'upload',
                  relationTo: 'media',
                  hasMany: true,
                  admin: { description: 'Background slideshow images.' },
                },
              ],
            },
            {
              name: 'marquee',
              type: 'array',
              localized: true,
              admin: { description: 'Scrolling keywords under the hero.' },
              fields: [{ name: 'text', type: 'text', required: true }],
            },
          ],
        },
        {
          label: 'Key figures',
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
          label: 'Sections',
          fields: [
            sectionIntro('servicesSection', 'Services section'),
            sectionIntro('projectsSection', 'Projects section'),
            {
              name: 'featuredProjects',
              type: 'relationship',
              relationTo: 'projects',
              hasMany: true,
              admin: { description: 'Projects shown on the home page (leave empty to use "featured").' },
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
  ],
}
