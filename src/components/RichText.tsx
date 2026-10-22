import { RichText as LexicalRichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { youTubeId } from '@/lib/media'
import type { YouTubeBlock } from '@/payload-types'

import { VideoEmbed } from './VideoEmbed'

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    youtube: ({ node }: { node: { fields: YouTubeBlock } }) => {
      const videoId = youTubeId(node.fields.url)
      if (!videoId) return null
      return (
        <figure className="not-prose my-10">
          <VideoEmbed videoId={videoId} label={node.fields.caption || 'YouTube'} />
          {node.fields.caption && (
            <figcaption className="mt-3 text-center text-sm text-muted">{node.fields.caption}</figcaption>
          )}
        </figure>
      )
    },
  },
})

export function RichText({ data, className }: { data?: unknown; className?: string }) {
  if (!data) return null
  return (
    <LexicalRichText
      data={data as SerializedEditorState}
      converters={converters}
      className={`prose-htad ${className ?? ''}`}
    />
  )
}
