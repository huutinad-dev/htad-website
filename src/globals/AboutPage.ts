import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '../hooks/revalidate'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About page',
  admin: { group: 'Pages' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Company',
          fields: [
            { name: 'heading', type: 'text', localized: true, required: true },
            { name: 'lead', type: 'textarea', localized: true },
            { name: 'body', type: 'richText', localized: true },
            { name: 'image', type: 'upload', relationTo: 'media' },
            {
              name: 'pillars',
              type: 'array',
              localized: true,
              // no longer shown on the site (removed from the page in Oct 2026); kept so the data isn't lost
              admin: { hidden: true },
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'text', type: 'textarea' },
              ],
            },
          ],
        },
        {
          label: 'Founder',
          fields: [
            {
              name: 'founder',
              type: 'group',
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'role', type: 'text', localized: true },
                { name: 'photo', type: 'upload', relationTo: 'media' },
                { name: 'bio', type: 'richText', localized: true },
                { name: 'quote', type: 'textarea', localized: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
