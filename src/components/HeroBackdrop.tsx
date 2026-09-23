// Decorative background for text-only page heroes: concentric eight-point stars
// echoing the HTAd emblem, slowly rotating behind a soft gold glow.
const RINGS = [1, 0.78, 0.56, 0.34]

export function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-[55%] h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[120px]" />
      <svg
        viewBox="-100 -100 200 200"
        className="absolute left-1/2 top-[55%] w-[min(110vw,58rem)] -translate-x-1/2 -translate-y-1/2 animate-[spin_120s_linear_infinite] text-gold opacity-[0.12]"
        fill="none"
        stroke="currentColor"
      >
        {RINGS.map((s) => (
          <g key={s} transform={`scale(${s})`}>
            <rect x={-68} y={-68} width={136} height={136} vectorEffect="non-scaling-stroke" />
            <rect x={-68} y={-68} width={136} height={136} transform="rotate(45)" vectorEffect="non-scaling-stroke" />
          </g>
        ))}
        <circle r={98} strokeDasharray="1 3" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-ink" />
    </div>
  )
}
