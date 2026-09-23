export function Marquee({ items }: { items: string[] }) {
  if (!items.length) return null
  // Content is duplicated so the -50% keyframe loops seamlessly.
  const row = [...items, ...items]
  return (
    <div className="relative overflow-hidden border-y border-line bg-ink py-6">
      <div className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]">
        {row.map((text, i) => (
          <span
            key={i}
            aria-hidden={i >= items.length}
            className="display flex items-center gap-10 whitespace-nowrap text-3xl text-white/90 md:text-5xl"
          >
            {text}
            <span className="inline-block h-3 w-3 rotate-45 bg-gold" />
          </span>
        ))}
      </div>
    </div>
  )
}
