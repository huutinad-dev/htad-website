import type { Dictionary } from '@/lib/dictionary'
import { asMedia } from '@/lib/media'
import type { SiteSetting } from '@/payload-types'

import { Img } from './Img'
import { Reveal } from './motion/Reveal'
import { SocialIcon } from './SocialLinks'

export function Footer({ dict, settings }: { dict: Dictionary; settings: SiteSetting }) {
  // Contact details live on the contact page only (reached via the "Get in touch" buttons).
  const social = settings.social ?? []

  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink pt-16 md:pt-20">
      <div className="container-x">
        {/* centred: logo, the optional line of text, then the channels in a row */}
        <Reveal className="flex flex-col items-center pb-14 text-center">
          <div className="relative h-28 w-24">
            <Img media={asMedia(settings.logoStacked)} fit="contain" sizes="96px" />
          </div>
          {settings.footerText && <p className="mt-6 max-w-md text-sm leading-relaxed text-muted">{settings.footerText}</p>}

          {social.length > 0 && (
            <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {social.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 text-white/80 transition-colors hover:text-gold"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                      <SocialIcon url={s.url} />
                    </span>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Reveal>

        <div className="border-t border-line py-6 text-center text-xs text-white/40">
          <p className="[text-wrap:balance]">
            © {new Date().getFullYear()} {settings.companyName}.{' '}
            {/* own line on phones, so the two sentences don't wrap into each other */}
            <span className="block md:inline">{dict.rights}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
