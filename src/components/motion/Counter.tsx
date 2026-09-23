'use client'

import { animate, useInView } from 'motion/react'
import { useEffect, useRef } from 'react'

// Counts up to `value` when scrolled into view. Prefix/suffix (e.g. "~", "#", "+") render
// as smaller marks, vertically centred on the number, so the number carries the weight.
export function Counter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView || !ref.current) return
    const node = ref.current
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = Math.round(v).toLocaleString()
      },
    })
    return () => controls.stop()
  }, [inView, value])

  const mark = 'text-[0.45em] leading-none opacity-80'
  return (
    // block-level flex: an inline-flex would sit on the small mark's baseline and push the number down
    <span className="flex items-center leading-none">
      {prefix && <span className={`${mark} mr-[0.1em]`}>{prefix}</span>}
      <span ref={ref} className="leading-none tabular-nums">
        {value.toLocaleString()}
      </span>
      {suffix && <span className={`${mark} ml-[0.06em]`}>{suffix}</span>}
    </span>
  )
}
