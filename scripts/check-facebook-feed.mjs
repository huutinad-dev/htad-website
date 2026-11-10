// Does Facebook's page plugin show the fanpage's posts? Run by .github/workflows/facebook-feed.yml.
//
// Since late 2026 the plugin renders the page header ("… followers") but no posts, for every
// page. This renders it in headless Chrome, as a visitor would see it, and reports to the site:
//   header + posts   → { posts: true }   the Insights card shows the live feed
//   header, no posts → { posts: false }  the Insights card is the compact link card
//   anything else    → no report         (blocked, login wall, changed markup: change nothing)
//
// Env: SITE_URL (https://htad.com.vn), CRON_SECRET (same value as on Vercel), CHROME (optional
// path to Chrome). `--dry-run` prints the verdict without reporting it.
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const site = (process.env.SITE_URL || '').replace(/\/$/, '')
const dryRun = process.argv.includes('--dry-run')
if (!site) throw new Error('SITE_URL is not set')
if (!dryRun && !process.env.CRON_SECRET) throw new Error('CRON_SECRET is not set')

// the fanpage is the first Facebook link in Site settings → Social links, as on the Insights page
const settings = await (await fetch(`${site}/api/globals/site-settings?depth=0`)).json()
const fanpage = (settings.social ?? []).map((s) => s.url).find((u) => /(^|\.)(facebook|fb)\.com$/i.test(new URL(u).hostname))
if (!fanpage) {
  console.log('No Facebook link in Site settings → Social links; nothing to check.')
  process.exit(0)
}

const plugin = `https://www.facebook.com/plugins/page.php?${new URLSearchParams({
  href: fanpage,
  tabs: 'timeline',
  width: '500',
  height: '1200',
  small_header: 'true',
  hide_cover: 'true',
  show_facepile: 'false',
  locale: 'en_US',
})}`

const chrome =
  process.env.CHROME ||
  (process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : 'google-chrome')
const profile = mkdtempSync(join(tmpdir(), 'fb-feed-'))
let html
try {
  html = execFileSync(
    chrome,
    ['--headless=new', '--no-sandbox', '--disable-gpu', `--user-data-dir=${profile}`, '--window-size=500,1200', '--virtual-time-budget=20000', '--dump-dom', plugin],
    { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024, timeout: 90_000, stdio: ['ignore', 'pipe', 'ignore'] },
  )
} finally {
  rmSync(profile, { recursive: true, force: true })
}

const text = html
  .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z#0-9]+;/gi, ' ')
  .replace(/\s+/g, ' ')
  .trim()
const header = text.match(/\bfollowers?\b/i)
if (!header) {
  console.log(`Inconclusive: no page header in the plugin (blocked or changed?). Nothing changed.\n${text.slice(0, 300)}`)
  process.exit(0)
}
// everything the plugin shows below the header; post markup (timestamps, articles) also counts
const afterHeader = text.slice(header.index + header[0].length).trim()
const posts = afterHeader.length > 40 || /data-utime=|role="article"|timestampContent/.test(html)
console.log(`${fanpage}: ${posts ? 'posts shown' : 'header only, no posts'} (text after header: ${JSON.stringify(afterHeader.slice(0, 120))})`)

if (dryRun) process.exit(0)
const res = await fetch(`${site}/api/facebook-feed`, {
  method: 'POST',
  headers: { authorization: `Bearer ${process.env.CRON_SECRET}`, 'content-type': 'application/json' },
  body: JSON.stringify({ posts }),
})
console.log(res.status, await res.text())
if (!res.ok) process.exit(1)
