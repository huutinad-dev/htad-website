import type { ReactNode } from 'react'

import type { Media } from '@/payload-types'

import { HeroBackdrop } from './HeroBackdrop'
import { Img } from './Img'
import { Reveal } from './motion/Reveal'
import { SplitHeading } from './motion/SplitHeading'

type Props = {
  eyebrow?: string | null
  title: string
  lead?: string | null
  image?: Media | null
  children?: ReactNode
}

// Header block for inner pages. With an image it becomes a full-bleed banner.
export function PageHero({ eyebrow, title, lead, image, children }: Props) {
  return (
    <section className={`relative flex items-end overflow-hidden ${image ? 'min-h-[80svh]' : ''}`}>
      {!image && <HeroBackdrop />}
      {image && (
        <div className="absolute inset-0">
          <Img media={image} priority className="animate-kenburns" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/50 to-ink" />
        </div>
      )}
      <div className={`container-x relative text-center ${image ? 'pb-16 pt-40 md:pb-24' : 'pb-14 pt-40 md:pb-20 md:pt-52'}`}>
        {eyebrow && (
          <Reveal>
            <p className="eyebrow mb-6">{eyebrow}</p>
          </Reveal>
        )}
        <SplitHeading
          as="h1"
          immediate
          text={title}
          className="display mx-auto max-w-6xl text-5xl text-gold sm:text-7xl lg:text-8xl"
        />
        {lead && (
          <Reveal delay={0.3}>
            <p className="mx-auto mt-8 max-w-5xl text-lg leading-relaxed text-white/80 [text-wrap:pretty] md:text-xl">{lead}</p>
          </Reveal>
        )}
        {children && <Reveal delay={0.4} className="mt-10 flex justify-center">{children}</Reveal>}
      </div>
    </section>
  )
}
