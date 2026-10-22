import type { Block } from 'payload'

import { t } from '../i18n/admin'

// A YouTube video inside rich text (posts, projects, services…), played in place on the site.
export const YouTubeBlock: Block = {
  slug: 'youtube',
  interfaceName: 'YouTubeBlock',
  labels: { singular: t('YouTube video', 'Video YouTube'), plural: t('YouTube videos', 'Video YouTube') },
  fields: [
    {
      name: 'url',
      label: t('YouTube link', 'Link YouTube'),
      type: 'text',
      required: true,
      admin: { placeholder: 'https://www.youtube.com/watch?v=…' },
      validate: (value: string | null | undefined) =>
        /(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)[\w-]{11}/.test(value ?? '') ||
        'Not a YouTube video link · Không phải link video YouTube',
    },
    {
      name: 'caption',
      label: t('Caption', 'Chú thích'),
      type: 'text',
      admin: {
        description: t('Optional, shown under the video.', 'Không bắt buộc, hiện dưới video.'),
      },
    },
  ],
}
