import { Gutter } from '@payloadcms/ui'
import type { AdminViewServerProps, CollectionSlug, Payload, Where } from 'payload'
import { formatAdminURL } from 'payload/shared'
import type { ReactNode } from 'react'

import { localePath, type Locale } from '@/i18n/config'

// The admin home, laid out like the website: one card per section of the site (in the order of
// its menu) with what it holds, where to edit it and where to see it live, then the new contact
// messages and the latest edits. Styles: .htad-dash in app/(payload)/custom.scss.

type Lang = 'en' | 'vi'
type Text = { en: string; vi: string }
const t = (en: string, vi: string): Text => ({ en, vi })

type SectionCard = {
  key: string
  title: Text
  icon: ReactNode
  count?: number | null
  /** what the count is of, e.g. "projects" */
  unit?: Text
  details: (Text | string)[]
  manage: { href: string; label: Text }
  create?: string
  /** the public page, opened in a new tab */
  live?: string
}

type Recent = { id: string; title: string; type: Text; updatedAt: string; href: string }

const count = async (payload: Payload, collection: CollectionSlug, where?: Where) => {
  try {
    return (await payload.count({ collection, where })).totalDocs
  } catch {
    return null
  }
}

const updatedAt = async (payload: Payload, slug: 'home-page' | 'about-page') => {
  try {
    return (await payload.findGlobal({ slug, depth: 0, select: { updatedAt: true } })).updatedAt ?? null
  } catch {
    return null
  }
}

export async function Dashboard({ initPageResult }: AdminViewServerProps) {
  const {
    req: { i18n, payload, user },
  } = initPageResult
  const lang: Lang = i18n.language === 'vi' ? 'vi' : 'en'
  const tr = (text: Text | string) => (typeof text === 'string' ? text : text[lang])
  const adminRoute = payload.config.routes.admin
  const admin = (path: `/${string}`) => formatAdminURL({ adminRoute, path })
  const site = (path: string) => localePath(lang as Locale, path)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [
    projects,
    featured,
    categories,
    services,
    published,
    drafts,
    products,
    productsShown,
    partners,
    partnersShown,
    messages,
    messagesThisWeek,
    homeUpdated,
    aboutUpdated,
    latestMessages,
    recent,
  ] = await Promise.all([
    count(payload, 'projects'),
    count(payload, 'projects', { featured: { equals: true } }),
    count(payload, 'project-categories'),
    count(payload, 'services'),
    count(payload, 'posts', { _status: { equals: 'published' } }),
    count(payload, 'posts', { _status: { equals: 'draft' } }),
    count(payload, 'products'),
    count(payload, 'products', { visible: { not_equals: false } }),
    count(payload, 'partners'),
    count(payload, 'partners', { visible: { not_equals: false } }),
    count(payload, 'messages'),
    count(payload, 'messages', { createdAt: { greater_than_equal: weekAgo } }),
    updatedAt(payload, 'home-page'),
    updatedAt(payload, 'about-page'),
    payload
      .find({ collection: 'messages', sort: '-createdAt', limit: 5, depth: 0 })
      .then((r) => r.docs)
      .catch(() => []),
    recentEdits(payload, lang),
  ])

  const ago = (date?: string | null) => (date ? relativeTime(date, lang) : null)
  const n = (value: number | null) => (value == null ? '—' : String(value))

  const sections: SectionCard[] = [
    {
      key: 'home',
      title: t('Home page', 'Trang chủ'),
      icon: <IconHome />,
      details: [homeUpdated ? `${tr(t('Updated', 'Cập nhật'))} ${ago(homeUpdated)}` : t('Hero, key figures, featured projects', 'Hero, số liệu, dự án nổi bật')],
      manage: { href: admin('/globals/home-page'), label: t('Edit', 'Chỉnh sửa') },
      live: site('/'),
    },
    {
      key: 'projects',
      title: t('Works', 'Dự án'),
      icon: <IconFolder />,
      count: projects,
      unit: t('projects', 'dự án'),
      details: [
        `${n(featured)} ${tr(t('featured', 'nổi bật'))}`,
        `${n(categories)} ${tr(t('categories', 'danh mục'))}`,
      ],
      manage: { href: admin('/collections/projects'), label: t('Manage', 'Quản lý') },
      create: admin('/collections/projects/create'),
      live: site('/projects'),
    },
    {
      key: 'about',
      title: t('Who we are', 'Về HTAd'),
      icon: <IconInfo />,
      details: [aboutUpdated ? `${tr(t('Updated', 'Cập nhật'))} ${ago(aboutUpdated)}` : t('Story, founder, network', 'Câu chuyện, nhà sáng lập, mạng lưới')],
      manage: { href: admin('/globals/about-page'), label: t('Edit', 'Chỉnh sửa') },
      live: site('/about'),
    },
    {
      key: 'services',
      title: t('What we do', 'Năng lực'),
      icon: <IconBriefcase />,
      count: services,
      unit: t('services', 'dịch vụ'),
      details: [],
      manage: { href: admin('/collections/services'), label: t('Manage', 'Quản lý') },
      create: admin('/collections/services/create'),
      live: site('/services'),
    },
    {
      key: 'insights',
      title: t('Insights', 'Tin tức'),
      icon: <IconNews />,
      count: published,
      unit: t('published', 'đã đăng'),
      details: drafts ? [`${drafts} ${tr(t('drafts', 'bản nháp'))}`] : [],
      manage: { href: admin('/collections/posts'), label: t('Manage', 'Quản lý') },
      create: admin('/collections/posts/create'),
      live: site('/insights'),
    },
    {
      key: 'shop',
      title: t('Shop', 'Cửa hàng'),
      icon: <IconBag />,
      count: productsShown,
      unit: t('on sale', 'đang bán'),
      details:
        products != null && productsShown != null && products > productsShown
          ? [`${products - productsShown} ${tr(t('hidden', 'đang ẩn'))}`]
          : [],
      manage: { href: admin('/collections/products'), label: t('Manage', 'Quản lý') },
      create: admin('/collections/products/create'),
      live: site('/shop'),
    },
    {
      key: 'partners',
      title: t('Partners', 'Đối tác'),
      icon: <IconHandshake />,
      count: partners,
      unit: t('partners', 'đối tác'),
      details: [`${n(partnersShown)} ${tr(t('on the home page', 'hiện ở trang chủ'))}`],
      manage: { href: admin('/collections/partners'), label: t('Manage', 'Quản lý') },
      create: admin('/collections/partners/create'),
      live: site('/'),
    },
    {
      key: 'contact',
      title: t('Contact', 'Liên hệ'),
      icon: <IconMail />,
      count: messages,
      unit: t('messages', 'tin nhắn'),
      details: messagesThisWeek ? [`${messagesThisWeek} ${tr(t('this week', 'tuần này'))}`] : [],
      manage: { href: admin('/collections/messages'), label: t('Read', 'Xem tin nhắn') },
      live: site('/contact'),
    },
  ]

  const name = (user as { name?: string } | null)?.name || user?.email?.split('@')[0] || ''

  return (
    <Gutter className="dashboard htad-dash">
      <header className="htad-dash__hero">
        <div>
          <p className="htad-dash__eyebrow">{greeting(lang)}</p>
          <h1 className="htad-dash__title">{name ? `${tr(t('Hello', 'Xin chào'))}, ${name}` : tr(t('Welcome back', 'Chào mừng trở lại'))}</h1>
          <p className="htad-dash__lead">{tr(t('Everything on the HTAd website, section by section.', 'Toàn bộ nội dung website HTAd, theo từng phần của trang.'))}</p>
        </div>
        <div className="htad-dash__actions">
          <a className="htad-dash__btn htad-dash__btn--solid" href={site('/')} target="_blank" rel="noopener noreferrer">
            {tr(t('View website', 'Xem website'))} <span aria-hidden>↗</span>
          </a>
          <a className="htad-dash__btn" href={admin('/collections/posts/create')}>+ {tr(t('New post', 'Tin mới'))}</a>
          <a className="htad-dash__btn" href={admin('/collections/projects/create')}>+ {tr(t('New project', 'Dự án mới'))}</a>
          <a className="htad-dash__btn" href={admin('/collections/products/create')}>+ {tr(t('New product', 'Sản phẩm mới'))}</a>
        </div>
      </header>

      <h2 className="htad-dash__heading">{tr(t('Website', 'Website'))}</h2>
      <div className="htad-dash__sections">
        {sections.map((s) => (
          <article key={s.key} className={`htad-dash__card htad-dash__card--${s.key}`}>
            <div className="htad-dash__card-head">
              <span className="htad-dash__icon">{s.icon}</span>
              <h3>{tr(s.title)}</h3>
              {s.live && (
                <a className="htad-dash__live" href={s.live} target="_blank" rel="noopener noreferrer" title={tr(t('See it on the website', 'Xem trên website'))}>
                  ↗
                </a>
              )}
            </div>
            {s.count !== undefined && (
              <p className="htad-dash__count">
                <strong>{n(s.count)}</strong> <span>{s.unit && tr(s.unit)}</span>
              </p>
            )}
            <ul className="htad-dash__details">
              {s.details.map((d) => (
                <li key={tr(d)}>{tr(d)}</li>
              ))}
            </ul>
            <div className="htad-dash__card-foot">
              <a href={s.manage.href}>{tr(s.manage.label)}</a>
              {s.create && (
                <a href={s.create} className="htad-dash__add" aria-label={`${tr(t('Add', 'Thêm'))} ${tr(s.title)}`}>
                  + {tr(t('Add', 'Thêm'))}
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="htad-dash__columns">
        <section className="htad-dash__panel">
          <div className="htad-dash__panel-head">
            <h2>{tr(t('New messages', 'Tin nhắn mới'))}</h2>
            <a href={admin('/collections/messages')}>{tr(t('All', 'Tất cả'))} →</a>
          </div>
          {latestMessages.length ? (
            <ul className="htad-dash__list">
              {latestMessages.map((m) => (
                <li key={m.id}>
                  <a href={admin(`/collections/messages/${m.id}`)}>
                    <span className="htad-dash__avatar" aria-hidden>
                      {(m.name || '?').trim().charAt(0).toUpperCase()}
                    </span>
                    <span className="htad-dash__list-main">
                      <strong>{m.name}</strong>
                      <span>{m.message}</span>
                    </span>
                    <time dateTime={m.createdAt}>{ago(m.createdAt)}</time>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="htad-dash__empty">{tr(t('No messages yet. Messages sent from the Contact page arrive here.', 'Chưa có tin nhắn. Tin nhắn gửi từ trang Liên hệ sẽ hiện ở đây.'))}</p>
          )}
        </section>

        <section className="htad-dash__panel">
          <div className="htad-dash__panel-head">
            <h2>{tr(t('Recently edited', 'Vừa cập nhật'))}</h2>
          </div>
          {recent.length ? (
            <ul className="htad-dash__list">
              {recent.map((r) => (
                <li key={r.id}>
                  <a href={r.href}>
                    <span className="htad-dash__tag">{tr(r.type)}</span>
                    <span className="htad-dash__list-main">
                      <strong>{r.title}</strong>
                    </span>
                    <time dateTime={r.updatedAt}>{ago(r.updatedAt)}</time>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="htad-dash__empty">—</p>
          )}
        </section>
      </div>

    </Gutter>
  )
}

/** The latest edits across the content collections, newest first. */
async function recentEdits(payload: Payload, lang: Lang): Promise<Recent[]> {
  const sources = [
    { collection: 'projects', type: t('Project', 'Dự án'), title: 'title' },
    { collection: 'posts', type: t('Post', 'Tin tức'), title: 'title' },
    { collection: 'services', type: t('Service', 'Dịch vụ'), title: 'title' },
    { collection: 'products', type: t('Product', 'Sản phẩm'), title: 'title' },
    { collection: 'partners', type: t('Partner', 'Đối tác'), title: 'name' },
  ] as const
  const lists = await Promise.all(
    sources.map((s) =>
      payload
        .find({ collection: s.collection, sort: '-updatedAt', limit: 6, depth: 0, locale: lang })
        .then((r) =>
          r.docs.map((doc) => {
            const raw = (doc as unknown as Record<string, unknown>)[s.title]
            return {
              id: `${s.collection}-${doc.id}`,
              title: typeof raw === 'string' ? raw.replace(/\s*\n\s*/g, ' ') : String(doc.id),
              type: s.type,
              updatedAt: doc.updatedAt,
              href: formatAdminURL({ adminRoute: payload.config.routes.admin, path: `/collections/${s.collection}/${doc.id}` }),
            }
          }),
        )
        .catch(() => [] as Recent[]),
    ),
  )
  return lists
    .flat()
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 6)
}

function relativeTime(date: string, lang: Lang) {
  const seconds = (new Date(date).getTime() - Date.now()) / 1000
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' })
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit)
  }
  return rtf.format(0, 'minute')
}

/** Morning / afternoon / evening greeting on Vietnam time, where the team works. */
function greeting(lang: Lang) {
  const hour = Number(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date()))
  const date = new Intl.DateTimeFormat(lang === 'vi' ? 'vi-VN' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(new Date())
  const part =
    hour < 11 ? (lang === 'vi' ? 'Chào buổi sáng' : 'Good morning') : hour < 18 ? (lang === 'vi' ? 'Chào buổi chiều' : 'Good afternoon') : lang === 'vi' ? 'Chào buổi tối' : 'Good evening'
  return `${part} · ${date}`
}

// ---- icons (lucide outlines, inline so the admin bundle needs nothing extra) -------------------

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  )
}
const IconHome = () => (
  <Icon>
    <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
  </Icon>
)
const IconFolder = () => (
  <Icon>
    <path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M8 11v5M12 13v3M16 10v6" />
  </Icon>
)
const IconInfo = () => (
  <Icon>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </Icon>
)
const IconBriefcase = () => (
  <Icon>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" />
  </Icon>
)
const IconNews = () => (
  <Icon>
    <path d="M4 5h13v14a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2z" />
    <path d="M17 9h3v10a2 2 0 0 1-2 2M8 9h5M8 13h5M8 17h3" />
  </Icon>
)
const IconBag = () => (
  <Icon>
    <path d="M6 8h12l-1 12H7L6 8Zm3 0V7a3 3 0 0 1 6 0v1" />
  </Icon>
)
const IconHandshake = () => (
  <Icon>
    <path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.6-4.6a2 2 0 0 0 0-2.8L15 7.6M3 11l4-4 3 1 2-1.5" />
    <path d="m7 13 3 3m-1-5 4 4m-6.5-7.5L3 11l5 5" />
  </Icon>
)
const IconMail = () => (
  <Icon>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Icon>
)
