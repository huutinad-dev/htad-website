'use client'

import { useLocale, useTranslation } from '@payloadcms/ui'
import { useEffect, type ReactNode } from 'react'

// The admin has two language settings: the content locale (the switcher at the top, which
// version of the content is being edited) and the interface language (Account page). Editors
// expect one switch, so the interface follows the content locale: pick Tiếng Việt and the
// menus, labels and buttons turn Vietnamese too.
export function LanguageFollowsLocale({ children }: { children: ReactNode }) {
  const { code } = useLocale()
  const { i18n, languageOptions, switchLanguage } = useTranslation()

  useEffect(() => {
    if (!code || code === i18n.language || !switchLanguage) return
    if (!languageOptions.some((option) => option.value === code)) return
    void switchLanguage(code as Parameters<typeof switchLanguage>[0])
  }, [code, i18n.language, languageOptions, switchLanguage])

  return <>{children}</>
}
