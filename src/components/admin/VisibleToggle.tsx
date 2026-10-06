'use client'

import { FieldDescription, FieldLabel, toast, useConfig, useField, useTranslation } from '@payloadcms/ui'
import type { CheckboxFieldClientComponent, DefaultCellComponentProps } from 'payload'
import { useState } from 'react'

// A checkbox field shown as an on/off switch: in the list view (saves straight away) and in
// the edit form (saved with the form, like any other field).

function Switch({
  on,
  busy,
  label,
  onToggle,
}: {
  on: boolean
  busy?: boolean
  label: string
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      title={label}
      disabled={busy}
      onClick={onToggle}
      style={{
        position: 'relative',
        flexShrink: 0,
        width: 40,
        height: 22,
        padding: 0,
        border: 'none',
        borderRadius: 999,
        cursor: busy ? 'progress' : 'pointer',
        // the admin theme's accent; the fallbacks apply if the theme is ever removed
        background: on ? 'var(--pt-accent, var(--theme-success-500))' : 'var(--theme-elevation-250)',
        opacity: busy ? 0.6 : 1,
        transition: 'background 150ms ease',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: on ? 21 : 3,
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: on ? 'var(--pt-accent-contrast, var(--theme-elevation-0))' : 'var(--theme-elevation-0)',
          transition: 'left 150ms ease',
        }}
      />
    </button>
  )
}

const stateLabel = (on: boolean, vi: boolean) => (vi ? (on ? 'Đang hiển thị' : 'Đang ẩn') : on ? 'Visible' : 'Hidden')

/** List view: the switch saves immediately, so an item can be shown or hidden without opening it. */
export function VisibleToggleCell({ cellData, rowData, collectionSlug, field }: DefaultCellComponentProps) {
  const { config } = useConfig()
  const { i18n } = useTranslation()
  const [on, setOn] = useState(cellData !== false)
  const [saving, setSaving] = useState(false)
  const vi = i18n.language === 'vi'

  const toggle = async () => {
    const next = !on
    setOn(next)
    setSaving(true)
    try {
      const res = await fetch(`${config.serverURL}${config.routes.api}/${collectionSlug}/${rowData.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ['name' in field ? field.name : 'visible']: next }),
      })
      if (!res.ok) throw new Error(String(res.status))
    } catch {
      setOn(!next)
      toast.error(vi ? 'Không lưu được. Vui lòng thử lại.' : 'Could not save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return <Switch on={on} busy={saving} label={stateLabel(on, vi)} onToggle={toggle} />
}

/** Edit form: same switch in place of the checkbox; the change is saved with the form. */
export const VisibleToggleField: CheckboxFieldClientComponent = ({ field, path, readOnly }) => {
  const { i18n } = useTranslation()
  const { value, setValue } = useField<boolean>({ path })
  const on = value !== false
  const vi = i18n.language === 'vi'

  return (
    <div className="field-type" style={{ marginBottom: 'var(--base)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Switch on={on} busy={readOnly} label={stateLabel(on, vi)} onToggle={() => setValue(!on)} />
        <FieldLabel label={field.label} path={path} />
      </div>
      <FieldDescription description={field.admin?.description} path={path} />
    </div>
  )
}
