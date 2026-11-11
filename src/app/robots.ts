import type { MetadataRoute } from 'next'

import { absoluteUrl } from '@/lib/seo'

// the Payload admin and API are not pages
const disallow = ['/admin', '/api/']

// Crawlers of AI search and answer engines (ChatGPT, Claude, Perplexity, Gemini, Copilot…), allowed
// by name so the site can be read, cited and linked in AI answers. `*` already allows them; naming
// them keeps that explicit. A crawler that matches a named group ignores `*`, hence the same rules.
const aiCrawlers = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
  'DuckAssistBot',
  'CCBot',
  'meta-externalagent',
  'MistralAI-User',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      { userAgent: aiCrawlers, allow: '/', disallow },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
