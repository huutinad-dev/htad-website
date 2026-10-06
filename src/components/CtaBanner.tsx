import type { Dictionary } from '@/lib/dictionary'

import { ArrowLink } from './ArrowLink'
import { Reveal } from './motion/Reveal'
import { SplitHeading } from './motion/SplitHeading'

// Closing call to action: a clean gold band — centred, a large heading, one button.
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
    <section className="bg-gold py-20 text-center text-ink md:py-28 lg:py-32">
      <div className="container-x">
        <SplitHeading
          text={heading}
          className="display mx-auto max-w-6xl text-5xl [text-wrap:balance] sm:text-6xl lg:text-7xl xl:text-8xl"
          // this heading wraps onto several lines: Vietnamese needs extra leading so marks
          // below one line (Ọ, Ộ) don't touch marks above the next (Ầ, Ắ)
          lineClassName="[&:lang(vi)]:leading-[1.3]"
        />
        {text && (
          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-xl text-lg font-medium leading-relaxed text-ink/80">{text}</p>
          </Reveal>
        )}
        <Reveal delay={0.3} className="mt-10 flex justify-center md:mt-12">
          <ArrowLink href={href} variant="solid" className="!bg-ink !text-gold hover:!bg-white hover:!text-ink">
            {dict.getInTouch}
          </ArrowLink>
        </Reveal>
      </div>
    </section>
  )
}
