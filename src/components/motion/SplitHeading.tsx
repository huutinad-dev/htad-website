'use client'

import { motion, type Variants } from 'motion/react'
import type React from 'react'

type Props = {
  text: string
  as?: keyof typeof tags
  className?: string
  lineClassName?: string
  delay?: number
  /** Animate on mount (hero) instead of when scrolled into view. */
  immediate?: boolean
}

const line: Variants = {
  hidden: { y: '110%' },
  show: (i: number) => ({
    y: '0%',
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 },
  }),
}

const tags = { h1: motion.h1, h2: motion.h2, p: motion.p }

// Each line slides up from behind a mask. Lines come from explicit line breaks.
// The in-view trigger sits on the (unclipped) wrapper, since the lines themselves start hidden by the mask.
export function SplitHeading({ text, as = 'h2', className, lineClassName, delay = 0, immediate }: Props) {
  const lines = text.split('\n').filter(Boolean)
  // Used by the `fit-line` utility to size the heading so its longest line never wraps.
  const fitLen = Math.max(...lines.map((l) => l.length), 1)
  const Tag = tags[as]
  const trigger = immediate
    ? { animate: 'show' }
    : { whileInView: 'show', viewport: { once: true, margin: '0px 0px -10% 0px' } }

  return (
    <Tag
      className={className}
      aria-label={lines.join(' ')}
      style={{ '--fit-len': fitLen } as React.CSSProperties}
      initial="hidden"
      {...trigger}
    >
      {/* each mask gets room for accents above and descenders below; the negative margin takes
          both back, so explicit lines sit exactly one line-height apart, like wrapped ones */}
      {lines.map((text, i) => (
        <span key={i} aria-hidden className="-mt-[0.28em] block overflow-hidden pb-[0.08em] pt-[0.2em]">
          <motion.span className={`block ${lineClassName ?? ''}`} variants={line} custom={i + delay / 0.12}>
            {text}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
