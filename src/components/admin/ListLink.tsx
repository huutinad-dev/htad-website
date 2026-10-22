'use client'

import { Link, useConfig, useTranslation } from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'

type Props = {
  /** The collection the link opens. */
  collection: string
  label: { en: string; vi: string }
  /** `back` points left and sits on the left; otherwise the link points right, on the right. */
  back?: boolean
}

// A link above a list view to a related list that has no sidebar entry of its own
// (Projects ↔ Project categories).
export function ListLink({ collection, label, back }: Props) {
  const { config } = useConfig()
  const { i18n } = useTranslation()
  const text = i18n.language === 'vi' ? label.vi : label.en

  return (
    <div style={{ display: 'flex', justifyContent: back ? 'flex-start' : 'flex-end', marginBottom: 16 }}>
      <Link
        href={formatAdminURL({ adminRoute: config.routes.admin, path: `/collections/${collection}` })}
        className="pill pill--style-light pill--has-link"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
      >
        {back && <span aria-hidden>←</span>}
        {text}
        {!back && <span aria-hidden>→</span>}
      </Link>
    </div>
  )
}
