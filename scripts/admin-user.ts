/**
 * Recover access to /admin when the login is forgotten.
 *   npm run payload run scripts/admin-user.ts                      # list admin emails
 *   npm run payload run scripts/admin-user.ts <email> <password>   # set that user's password
 * (creates the user if the email doesn't exist yet). Only touches the Payload `users`
 * collection. Runs against whatever DATABASE_URL is set, so prefix the command with the
 * production DATABASE_URL to fix the live site.
 */
import { getPayload } from 'payload'

import config from '../src/payload.config'

const [email, password] = process.argv.slice(2).filter((a) => !a.endsWith('admin-user.ts'))
const payload = await getPayload({ config })

if (!email) {
  const { docs } = await payload.find({ collection: 'users', limit: 100, depth: 0 })
  console.log(docs.length ? docs.map((u) => `${u.id}\t${u.email}\t${u.name ?? ''}`).join('\n') : 'No users yet.')
} else if (!password) {
  throw new Error('Usage: admin-user.ts <email> <password>')
} else {
  const { docs } = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
  if (docs[0]) {
    // also clears a lockout from too many failed logins
    await payload.update({ collection: 'users', id: docs[0].id, data: { password, loginAttempts: 0, lockUntil: null } })
    console.log(`Password updated for ${email}`)
  } else {
    await payload.create({ collection: 'users', data: { email, password } })
    console.log(`Created ${email}`)
  }
}
process.exit(0)
