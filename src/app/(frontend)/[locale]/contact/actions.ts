'use server'

import config from '@payload-config'
import { getPayload } from 'payload'

export type ContactState = { status: 'idle' | 'ok' | 'invalid' | 'error' }

const field = (data: FormData, name: string) => String(data.get(name) ?? '').trim()
const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

// Saves the message in the CMS (Admin → Contact messages), then emails it to the address in
// Site settings. The saved copy is the source of truth: a failed email never loses a message.
export async function sendContactMessage(_prev: ContactState, data: FormData): Promise<ContactState> {
  // honeypot: real visitors never see or fill this field, bots do — pretend it worked
  if (field(data, 'website')) return { status: 'ok' }

  const name = field(data, 'name')
  const email = field(data, 'email')
  const company = field(data, 'company')
  const message = field(data, 'message')
  const valid =
    name.length > 0 &&
    name.length <= 120 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    email.length <= 200 &&
    company.length <= 160 &&
    message.length >= 10 &&
    message.length <= 5000
  if (!valid) return { status: 'invalid' }

  const payload = await getPayload({ config })
  try {
    await payload.create({ collection: 'messages', data: { name, email, company: company || undefined, message } })
  } catch (error) {
    payload.logger.error({ err: error }, 'contact form: could not save the message')
    return { status: 'error' }
  }

  try {
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
    const to = settings.contact?.email
    if (to) {
      const rows = [
        ['Name', name],
        ['Email', email],
        ...(company ? [['Company', company]] : []),
      ]
      await payload.sendEmail({
        to,
        replyTo: email,
        subject: `[${settings.shortName || 'Website'}] Contact form: ${name}`,
        text: `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${message}`,
        html: `${rows.map(([k, v]) => `<p><strong>${k}:</strong> ${escapeHtml(v)}</p>`).join('')}<p style="white-space:pre-line">${escapeHtml(message)}</p>`,
      })
    }
  } catch (error) {
    payload.logger.error({ err: error }, 'contact form: message saved but the email was not sent')
  }
  return { status: 'ok' }
}
