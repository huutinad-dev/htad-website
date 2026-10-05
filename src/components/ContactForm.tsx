'use client'

import { useActionState } from 'react'

import { sendContactMessage, type ContactState } from '@/app/(frontend)/[locale]/contact/actions'
import type { Dictionary } from '@/lib/dictionary'

import { Arrow } from './ArrowLink'

const initial: ContactState = { status: 'idle' }
const input =
  'w-full rounded-2xl border border-line bg-surface/60 px-5 py-4 text-base text-white placeholder:text-white/30 transition-colors duration-300 focus:border-gold focus:outline-none'

export function ContactForm({ labels }: { labels: Dictionary['contactForm'] }) {
  const [state, action, pending] = useActionState(sendContactMessage, initial)

  if (state.status === 'ok') {
    return (
      <p role="status" className="rounded-2xl border border-gold/40 bg-gold/10 p-8 text-center text-lg font-medium text-gold">
        {labels.success}
      </p>
    )
  }

  return (
    <form action={action} className="grid gap-4 md:grid-cols-2 md:gap-5">
      <label className="block">
        <span className="eyebrow mb-2 block !text-white/40">{labels.name}</span>
        <input name="name" required maxLength={120} autoComplete="name" className={input} />
      </label>
      <label className="block">
        <span className="eyebrow mb-2 block !text-white/40">{labels.email}</span>
        <input name="email" type="email" required maxLength={200} autoComplete="email" className={input} />
      </label>
      <label className="block md:col-span-2">
        <span className="eyebrow mb-2 block !text-white/40">
          {labels.company} <span className="normal-case tracking-normal">({labels.optional})</span>
        </span>
        <input name="company" maxLength={160} autoComplete="organization" className={input} />
      </label>
      <label className="block md:col-span-2">
        <span className="eyebrow mb-2 block !text-white/40">{labels.message}</span>
        <textarea name="message" required minLength={10} maxLength={5000} rows={6} className={`${input} resize-y`} />
      </label>
      {/* honeypot for bots: hidden from visitors and assistive tech */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <div className="mt-2 flex flex-col items-center gap-4 md:col-span-2">
        {(state.status === 'invalid' || state.status === 'error') && (
          <p role="alert" className="text-sm text-red-400">
            {state.status === 'invalid' ? labels.invalid : labels.error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex items-center gap-3 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-ink transition-colors duration-300 hover:bg-white disabled:opacity-60"
        >
          <span>{pending ? labels.sending : labels.send}</span>
          <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  )
}
