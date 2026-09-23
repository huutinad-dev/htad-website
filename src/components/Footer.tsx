import type { Dictionary } from '@/lib/dictionary'
import { asMedia } from '@/lib/media'
import type { SiteSetting } from '@/payload-types'

import { Img } from './Img'
import { Reveal } from './motion/Reveal'

export function Footer({ dict, settings }: { dict: Dictionary; settings: SiteSetting }) {
  const { contact } = settings

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

          <div className="space-y-3 text-white/80 md:col-span-5 md:col-start-8">
            <p className="eyebrow mb-5">{dict.contactUs}</p>
            {contact?.phone && (
              <a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`} className="block transition-colors hover:text-gold">
                {contact.phone}
              </a>
            )}
            {contact?.email && (
              <a href={`mailto:${contact.email}`} className="block transition-colors hover:text-gold">
                {contact.email}
              </a>
            )}
            {contact?.address && <p className="max-w-sm whitespace-pre-line text-muted">{contact.address}</p>}
          </div>
        </Reveal>

        <div className="flex flex-col gap-2 border-t border-line py-6 text-xs text-white/40 md:flex-row md:justify-between">
          <p>
            © {new Date().getFullYear()} {settings.companyName}. {dict.rights}
          </p>
          {contact?.website && <p>{contact.website}</p>}
        </div>
      </div>
    </footer>
  )
}
