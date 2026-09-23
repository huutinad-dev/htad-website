import type { Dictionary } from '@/lib/dictionary'

import { ArrowLink } from './ArrowLink'
import { Reveal } from './motion/Reveal'
import { SplitHeading } from './motion/SplitHeading'

export function CtaBanner({
  heading,
  text,
  href,
  dict,
}: {
  heading?: string | null
  text?: string | null
  href: string
  dict: Dictionary
}) {
  if (!heading) return null
  return (
    <section className="relative overflow-hidden bg-gold py-20 text-ink md:py-28">
      <div className="container-x relative">
        <SplitHeading text={heading} className="display max-w-5xl text-5xl md:text-7xl lg:text-8xl" />
        <Reveal delay={0.2} className="mt-10 flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          {text && <p className="max-w-lg text-lg font-medium">{text}</p>}
          <ArrowLink href={href} variant="solid" className="!bg-ink !text-gold hover:!bg-white hover:!text-ink">
            {dict.getInTouch}
          </ArrowLink>
        </Reveal>
      </div>
    </section>
  )
}
