import type { MetadataRoute } from 'next'

import { absoluteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    // the Payload admin and API are not pages
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] },
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
