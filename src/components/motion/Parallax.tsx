'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'

// Moves its content slightly slower than the page while scrolling.
export function Parallax({
  children,
  className,
  amount = 12,
}: {
  children: ReactNode
  className?: string
  /** Travel in percent of the element height. */
  amount?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ''}`}>
      <motion.div className="absolute -inset-y-[15%] inset-x-0" style={reduce ? undefined : { y }}>
        {children}
      </motion.div>
    </div>
  )
}
