import type { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import { isLocale, locales } from '@/i18n/config'
import { getDictionary } from '@/lib/dictionary'
import { asMedia, mediaSrc } from '@/lib/media'
import { getSettings } from '@/lib/payload'
import { siteUrl } from '@/lib/seo'

import './globals.css'

// Be Vietnam Pro: geometric like the Poppins used in the company profile,
// but with a full Vietnamese character set (Poppins has none).
const beVietnam = Be_Vietnam_Pro({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-be-vietnam',
  display: 'swap',
})

// Pages are statically cached and refreshed every 10 minutes; saving in the CMS
// purges the cache immediately (see src/hooks/revalidate.ts).
export const revalidate = 600

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

type Props = { children: ReactNode; params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const settings = await getSettings(locale)
  const title = settings.seoTitle || settings.companyName
  // pages add their description, canonical URL and Open Graph through pageMetadata (src/lib/seo.tsx)
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: `%s | ${settings.shortName || title}` },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const settings = await getSettings(locale)
  const dict = getDictionary(locale)
  const logo = asMedia(settings.logo)
  const logoSrc = mediaSrc(logo)

  return (
    <html lang={locale} className={beVietnam.variable}>
      <body className="bg-ink font-sans text-white">
        <SmoothScroll>
          <Header
            locale={locale}
            dict={dict}
            logo={logoSrc ? { src: logoSrc, alt: logo!.alt ?? '' } : null}
            email={settings.contact?.email}
            social={(settings.social ?? []).map(({ label, url }) => ({ label, url }))}
          />
          <main>{children}</main>
          <Footer dict={dict} settings={settings} />
        </SmoothScroll>
      </body>
    </html>
  )
}
