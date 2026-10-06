import Link from 'next/link'

import { Arrow, ArrowLink } from './ArrowLink'
import { Reveal } from './motion/Reveal'
import { SplitHeading } from './motion/SplitHeading'

type Props = {
  eyebrow?: string | null
  heading?: string | null
  text?: string | null
  /** "View all" target: a round arrow beside the title on small screens, a pill button on desktop. */
  link?: { href: string; label: string }
  className?: string
}

export function SectionHeading({ eyebrow, heading, text, link, className }: Props) {
  return (
    <div className={`flex items-center gap-4 lg:justify-between lg:gap-8 ${className ?? ''}`}>
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <Reveal>
            <p className="eyebrow mb-5">{eyebrow}</p>
          </Reveal>
        )}
        {heading && (
          // --fit-pad reserves room for the arrow (mobile) / pill button (desktop) beside the title
          <SplitHeading
            text={heading}
            className="display fit-line text-gold [--fit-max:3rem] [--fit-pad:6rem] sm:[--fit-max:3.75rem] md:[--fit-pad:9rem] lg:[--fit-pad:22rem] xl:[--fit-max:4.5rem]"
          />
        )}
        {text && (
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">{text}</p>
          </Reveal>
        )}
      </div>
      {link && (
        <Reveal delay={0.2} className="shrink-0">
          <Link
            href={link.href}
            aria-label={link.label}
            className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-ink lg:hidden"
          >
            <Arrow className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
          {/* wrapper owns the display toggle: ArrowLink's own inline-flex would override `hidden` */}
          <span className="hidden lg:block">
            <ArrowLink href={link.href}>{link.label}</ArrowLink>
          </span>
        </Reveal>
      )}
    </div>
  )
}
