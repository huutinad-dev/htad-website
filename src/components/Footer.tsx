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
        <Reveal className="grid gap-12 pb-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="relative h-28 w-24">
              <Img media={asMedia(settings.logoStacked)} fit="contain" sizes="96px" />
            </div>
            {settings.footerText && <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">{settings.footerText}</p>}
          </div>

          {social.length > 0 && (
            <div className="md:col-span-5 md:col-start-8">
              <p className="eyebrow mb-5">{dict.followUs}</p>
              <ul className="space-y-3">
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
            </div>
          )}
        </Reveal>

        <div className="border-t border-line py-6 text-xs text-white/40">
          <p>
            © {new Date().getFullYear()} {settings.companyName}. {dict.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
