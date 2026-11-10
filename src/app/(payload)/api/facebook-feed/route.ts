import config from '@payload-config'
import { timingSafeEqual } from 'crypto'
import { getPayload } from 'payload'

// Called by the scheduled GitHub Action (.github/workflows/facebook-feed.yml), which renders
// Facebook's page plugin in a browser and reports whether it shows posts. Turns the Insights
// fanpage feed (Site settings → showFacebookFeed) on or off to match. Writes, and so purges
// the page cache, only when the value changes.
const authorized = (request: Request) => {
  const secret = process.env.CRON_SECRET
  const given = request.headers.get('authorization')?.replace(/^Bearer /, '') ?? ''
  if (!secret || given.length !== secret.length) return false
  return timingSafeEqual(Buffer.from(given), Buffer.from(secret))
}

export async function POST(request: Request) {
  if (!authorized(request)) return Response.json({ error: 'unauthorized' }, { status: 401 })

  const body = (await request.json().catch(() => null)) as { posts?: unknown } | null
  if (typeof body?.posts !== 'boolean') return Response.json({ error: 'expected { posts: boolean }' }, { status: 400 })

  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  const before = Boolean(settings.showFacebookFeed)
  if (before !== body.posts) {
    await payload.updateGlobal({ slug: 'site-settings', data: { showFacebookFeed: body.posts }, depth: 0 })
    payload.logger.info(`facebook feed: plugin ${body.posts ? 'shows posts again, feed on' : 'shows no posts, feed off'}`)
  }
  return Response.json({ showFacebookFeed: body.posts, changed: before !== body.posts })
}
