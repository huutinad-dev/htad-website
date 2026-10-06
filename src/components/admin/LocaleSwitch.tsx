'use client'

import { useConfig, useLocale, useRouteTransition } from '@payloadcms/ui'
import { useLocaleLoading } from '@payloadcms/ui/providers/Locale'
import { useRouter } from 'next/navigation'

// Language switch in the admin header, beside the user menu: one click instead of opening
// the menu. It sets the content locale the same way Payload's own switcher does (the
// `locale` query parameter); the interface language follows it (LanguageFollowsLocale).
export function LocaleSwitch() {
  const { config } = useConfig()
  const locale = useLocale()
  const router = useRouter()
  const { startRouteTransition } = useRouteTransition()
  const { setLocaleIsLoading } = useLocaleLoading()

  const locales = config.localization ? config.localization.locales : []
  if (locales.length < 2) return null

  const switchTo = (code: string) => {
    if (code === locale?.code) return
    setLocaleIsLoading(true)
    const params = new URLSearchParams(window.location.search)
    params.set('locale', code)
    startRouteTransition(() => router.push(`?${params.toString()}`))
  }

  return (
    <div
      role="group"
      aria-label="Language"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        padding: 3,
        border: '1px solid var(--theme-border-color)',
        borderRadius: 999,
      }}
    >
      {locales.map(({ code }) => {
        const active = code === locale?.code
        return (
          <button
            key={code}
            type="button"
            aria-pressed={active}
            onClick={() => switchTo(code)}
            style={{
              minWidth: 36,
              padding: '4px 10px',
              border: 'none',
              borderRadius: 999,
              cursor: active ? 'default' : 'pointer',
              font: 'inherit',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.04em',
              // the admin theme's accent; the fallbacks apply if the theme is ever removed
              background: active ? 'var(--pt-accent, var(--theme-elevation-150))' : 'transparent',
              color: active ? 'var(--pt-accent-contrast, var(--theme-text))' : 'var(--theme-elevation-600)',
              transition: 'background 150ms ease, color 150ms ease',
            }}
          >
            {code.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
