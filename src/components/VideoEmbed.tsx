'use client'

import { useState } from 'react'

// Inline YouTube player for a project page. It starts as the video's own thumbnail with a play
// button and only loads YouTube's player (and its cookies) once the visitor presses play.
export function VideoEmbed({ videoId, label }: { videoId: string; label: string }) {
  const [playing, setPlaying] = useState(false)
  // the large thumbnail does not exist for every video; fall back to the one that always does
  const [poster, setPoster] = useState(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`)

  return (
    <div className="relative aspect-video overflow-hidden rounded-sm bg-surface">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={label}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} aria-label={label} className="group absolute inset-0 block h-full w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster}
            alt=""
            loading="lazy"
            // YouTube answers a missing thumbnail with a 120px placeholder rather than an error
            onLoad={(e) => e.currentTarget.naturalWidth <= 120 && setPoster(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`)}
            onError={() => setPoster(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-ink/30 transition-colors duration-500 group-hover:bg-ink/10" />
          <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-ink transition-transform duration-500 group-hover:scale-110">
            <svg viewBox="0 0 24 24" className="h-5 w-5 translate-x-0.5" fill="currentColor" aria-hidden>
              <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  )
}
