import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '../hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Pages' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Brand',
          fields: [
            { name: 'companyName', type: 'text', required: true },
            { name: 'shortName', type: 'text' },
            { name: 'tagline', type: 'text', localized: true },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Horizontal logo used in the header.' },
            },
            {
              name: 'logoStacked',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Stacked logo used in the footer / contact page.' },
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
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
                  admin: { description: 'Google Maps link for the address.' },
                },
              ],
            },
            {
              name: 'social',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Footer & SEO',
          fields: [
            { name: 'footerText', type: 'textarea', localized: true },
            { name: 'seoTitle', type: 'text', localized: true },
            { name: 'seoDescription', type: 'textarea', localized: true },
            { name: 'ogImage', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
  ],
}
