import type { ReactNode } from 'react'

import { Reveal } from './motion/Reveal'
import { SplitHeading } from './motion/SplitHeading'

type Props = {
  eyebrow?: string | null
  heading?: string | null
  text?: string | null
  action?: ReactNode
  className?: string
}

export function SectionHeading({ eyebrow, heading, text, action, className }: Props) {
  return (
    <div className={`flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between ${className ?? ''}`}>
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <Reveal>
            <p className="eyebrow mb-5">{eyebrow}</p>
          </Reveal>
        )}
        {heading && (
          <SplitHeading text={heading} className="display fit-line text-gold [--fit-max:3rem] [--fit-pad:2.5rem] sm:[--fit-max:3.75rem] md:[--fit-pad:5rem] lg:[--fit-pad:22rem] xl:[--fit-max:4.5rem]" />
        )}
        {text && (
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">{text}</p>
          </Reveal>
        )}
      </div>
      {action && <Reveal delay={0.2}>{action}</Reveal>}
    </div>
  )
}
