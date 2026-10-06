/**
 * Project texts from the client's "Huu Tin - Company profile 2026.pdf" (Selected works, p. 13-23):
 * title, subtitle, excerpt, slogan, year, HTAd's role and partners, in English and Vietnamese.
 *
 *   npx payload run scripts/import-projects-from-profile.ts            # dry run: prints the changes
 *   APPLY=1 npx payload run scripts/import-projects-from-profile.ts    # writes them
 *
 * Only the fields listed below are touched: bodies, images, videos, categories and ordering stay
 * as they are, and a field left out of an entry keeps its current value. The .env may point at the
 * shared production database, so the default is a dry run. Re-running is safe.
 *
 * `source` notes where a value comes from: "pdf" = stated in the profile; "press" = public news
 * coverage (see the comment on the entry); "inferred" = read from the profile's section heading or
 * project name (e.g. a season "2025/26" gives the year 2025).
 */
import { getPayload } from 'payload'

import config from '../src/payload.config'

type L = { en: string; vi: string }
type Entry = {
  slug: string
  title?: L
  subtitle?: L
  excerpt?: L
  quote?: L
  year?: { value: string; source: 'pdf' | 'press' | 'inferred' }
  role?: L & { source: 'pdf' | 'inferred' }
  /** Partner names from the Partners list. If any is missing there, `partnerText` is used instead. */
  partners?: string[]
  partnerText?: L
}

const same = (s: string): L => ({ en: s, vi: s })

const TRAILER_ROLE = { en: 'Trailer production', vi: 'Sản xuất trailer', source: 'inferred' } as const
const BRANDING_ROLE = { en: 'Brand identity design', vi: 'Thiết kế nhận diện thương hiệu', source: 'inferred' } as const

const entries: Entry[] = [
  {
    slug: 'vleague-rebranding',
    title: { en: 'Rebranding V.League', vi: 'Tái định vị thương hiệu V.League' },
    subtitle: { en: 'Vietnam Professional Football Leagues', vi: 'Hệ thống giải bóng đá chuyên nghiệp Việt Nam' },
    excerpt: {
      en: 'A comprehensive rebranding of V.League 1, V.League 2 and the National Cup, with a bold, modern and distinctly Vietnamese identity.',
      vi: 'Tái định vị toàn diện V.League 1, V.League 2 và Cúp Quốc gia với bản sắc táo bạo, hiện đại và đậm chất Việt.',
    },
    quote: same('World Game, Our Festival'),
    // VPF unveiled the new identity on 6 August 2026, for use from the 2026/27 season
    // (e.g. vov.vn, baovanhoa.vn, en.vff.org.vn)
    year: { value: '2026', source: 'press' },
    role: BRANDING_ROLE,
    partners: ['VPF'],
  },
  {
    slug: 'vpf-rebranding',
    title: { en: 'Rebranding VPF', vi: 'Tái định vị thương hiệu VPF' },
    subtitle: {
      en: 'Vietnam Professional Football Company (VPF)',
      vi: 'Công ty Cổ phần Bóng đá Chuyên nghiệp Việt Nam (VPF)',
    },
    // same announcement as the leagues' rebranding (6 August 2026)
    year: { value: '2026', source: 'press' },
    role: BRANDING_ROLE,
    partners: ['VPF'],
  },
  {
    slug: 'watch-world-cup-on-vtvgo',
    title: { en: 'Campaign: “Watch World Cup on VTVgo”', vi: 'Chiến dịch: “Xem World Cup trên VTVgo”' },
    subtitle: same('VTVgo × Mobifone'),
    excerpt: {
      en: 'An integrated marketing campaign promoting the World Cup VIP package on the VTVgo app, with a promotion for Mobifone users and a performance-driven strategy built around subscription sales KPIs.',
      vi: 'Chiến dịch marketing tích hợp quảng bá gói VIP World Cup trên ứng dụng VTVgo, kèm chương trình ưu đãi cho thuê bao Mobifone, với chiến lược tập trung vào KPI doanh số thuê bao.',
    },
    // the campaign is for the FIFA World Cup 2026
    year: { value: '2026', source: 'pdf' },
    role: {
      en: 'Creative design, media promotion, KOL partnerships & TVC production',
      vi: 'Thiết kế sáng tạo, truyền thông, hợp tác KOL & sản xuất TVC',
      source: 'pdf',
    },
    partners: ['VTV Go', 'Mobifone'],
    partnerText: same('VTVgo × Mobifone'),
  },
  {
    slug: 'trailer-lpbank-vleague-2026-27',
    title: same('Trailer LPBank V.League 2026/27'),
    subtitle: { en: 'A new look. A new spirit. A new journey.', vi: 'Diện mạo mới. Tinh thần mới. Hành trình mới.' },
    excerpt: {
      en: 'Inspired by Vietnamese propaganda art, the trailer introduces a bold new visual identity that brings together tradition and modernity, national character and global integration.',
      vi: 'Lấy cảm hứng từ tranh cổ động Việt Nam, trailer giới thiệu bộ nhận diện mới táo bạo, kết hợp truyền thống và hiện đại, bản sắc dân tộc và hội nhập quốc tế.',
    },
    quote: same('World Game, Our Festival!'),
    year: { value: '2026', source: 'inferred' },
    role: TRAILER_ROLE,
    partners: ['LPBank', 'V.League'],
  },
  {
    slug: 'trailer-lpbank-vleague-2025-26',
    title: same('Trailer LPBank V.League 2025/26'),
    subtitle: { en: 'Identity and Technology', vi: 'Bản sắc và Công nghệ' },
    excerpt: {
      en: 'Where machines represent more than technological power: they embody the spirit, culture and unique identity of every team.',
      vi: 'Nơi những cỗ máy không chỉ đại diện cho sức mạnh công nghệ, mà còn mang tinh thần, văn hoá và bản sắc riêng của mỗi đội bóng.',
    },
    // the profile shows the premiere date, 26.09.25
    year: { value: '2025', source: 'pdf' },
    role: TRAILER_ROLE,
    partners: ['LPBank', 'V.League'],
  },
  {
    slug: 'trailer-lpbank-vleague-2024-25',
    title: same('Trailer LPBank V.League 2024/25'),
    excerpt: {
      en: 'Where football and national culture grow together as one.',
      vi: 'Nơi bóng đá và văn hoá dân tộc cùng hoà làm một.',
    },
    year: { value: '2024', source: 'inferred' },
    role: TRAILER_ROLE,
    partners: ['LPBank', 'V.League'],
  },
  {
    slug: 'key-visual-design',
    title: { en: 'V.League 2025/26 Club Key Visuals', vi: 'Key visual các CLB V.League 2025/26' },
    year: { value: '2025', source: 'inferred' },
    role: { en: 'Key visual design', vi: 'Thiết kế key visual', source: 'inferred' },
    partners: ['V.League'],
  },
  {
    slug: 'total-football-game-launch',
    title: { en: 'Total Football Game Launch', vi: 'Ra mắt game Total Football' },
    subtitle: same('Total Football × VNG Games'),
    // Total Football VNG launched in Southeast Asia on 22 April 2026 (e.g. baovanhoa.vn, tienphong.vn)
    year: { value: '2026', source: 'press' },
    role: { en: 'Launch campaign creatives', vi: 'Thiết kế ấn phẩm chiến dịch ra mắt', source: 'inferred' },
    partners: ['VNG'],
  },
  {
    slug: 'book-1999-manchester-united',
    title: {
      en: '1999: Manchester United, the Treble and All That',
      vi: '1999: Manchester United, cú ăn ba và tất cả những điều đó',
    },
    subtitle: {
      en: 'Published by HTAd in 2025. Designed by Grammy nominee Duy Dao.',
      vi: 'HTAd xuất bản năm 2025. Thiết kế bởi đề cử Grammy Duy Đào.',
    },
    year: { value: '2025', source: 'pdf' },
    role: {
      en: 'Publishing: content development, localisation, distribution & promotion',
      vi: 'Xuất bản: phát triển nội dung, bản địa hoá, phát hành & quảng bá',
      source: 'pdf',
    },
    // no partner: the book is HTAd's own publication
    partners: [],
  },
  {
    slug: 'next-generation-vietnam',
    title: same('Next Generation Vietnam'),
    subtitle: same('Mitsubishi Heavy Industries × Urawa Reds'),
    excerpt: {
      en: 'A youth football talent selection programme in Hanoi, organised by Urawa Red Diamonds and Mitsubishi Heavy Industries. More than 30 promising players from five leading Vietnamese clubs took part; two were selected for a two-week training stint with Urawa Reds U21 in Japan.',
      vi: 'Chương trình tuyển chọn tài năng bóng đá trẻ tại Hà Nội do Urawa Red Diamonds và Mitsubishi Heavy Industries tổ chức. Hơn 30 cầu thủ triển vọng từ năm CLB hàng đầu Việt Nam tham gia; hai cầu thủ xuất sắc được chọn sang Nhật Bản tập luyện hai tuần cùng đội U21 của Urawa Reds.',
    },
    // year: not in the profile, and not found in public coverage
    role: { en: 'Consultancy & event organisation', vi: 'Tư vấn & tổ chức sự kiện', source: 'pdf' },
    partners: ['Mitsubishi Heavy Industries', 'Urawa Red Diamonds'],
    partnerText: same('Mitsubishi Heavy Industries × Urawa Reds'),
  },
  {
    slug: 'fan-culture-event',
    title: { en: 'Fan Culture Event', vi: 'Sự kiện văn hoá người hâm mộ' },
    // year: not in the profile, and not found in public coverage
    role: { en: 'Event organisation', vi: 'Tổ chức sự kiện', source: 'inferred' },
  },
]

const apply = process.env.APPLY === '1'
const payload = await getPayload({ config })
const key = (s: string) => s.toLowerCase().replace(/\s+/g, '')
const partnerIds = new Map(
  (await payload.find({ collection: 'partners', limit: 500, depth: 0 })).docs.map((p) => [key(p.name), p.id]),
)
const show = (v: unknown) => JSON.stringify(v ?? null)

let changes = 0
for (const e of entries) {
  const found = await payload.find({ collection: 'projects', where: { slug: { equals: e.slug } }, limit: 1, depth: 0 })
  const project = found.docs[0]
  if (!project) {
    console.log(`! ${e.slug}: not found, skipped`)
    continue
  }

  // partners: all of them from the Partners list, or the text fallback
  const ids = e.partners?.map((name) => partnerIds.get(key(name)))
  const linked = ids && ids.every((id) => id !== undefined) ? (ids as number[]) : null
  const missing = e.partners?.filter((name) => !partnerIds.has(key(name))) ?? []

  const shared: Record<string, unknown> = {}
  if (e.year) shared.year = e.year.value
  if (linked) shared.partners = linked

  for (const locale of ['en', 'vi'] as const) {
    const current = await payload.findByID({ collection: 'projects', id: project.id, locale, depth: 0, fallbackLocale: false })
    const data: Record<string, unknown> = locale === 'en' ? { ...shared } : {}
    for (const field of ['title', 'subtitle', 'excerpt', 'quote', 'role'] as const) {
      const value = e[field]?.[locale]
      if (value !== undefined) data[field] = value
    }
    if (!linked && e.partnerText) data.partner = e.partnerText[locale]

    const diff = Object.entries(data).filter(([field, value]) => show((current as unknown as Record<string, unknown>)[field]) !== show(value))
    if (!diff.length) continue
    changes += diff.length
    console.log(`\n${e.slug} [${locale}]`)
    for (const [field, value] of diff) {
      const note = field === 'year' ? ` (${e.year!.source})` : field === 'role' ? ` (${e.role!.source})` : ''
      console.log(`  ${field}: ${show((current as unknown as Record<string, unknown>)[field])}\n      → ${show(value)}${note}`)
    }
    if (apply) {
      await payload.update({ collection: 'projects', id: project.id, locale, data: Object.fromEntries(diff) })
    }
  }
  if (missing.length) console.log(`  (partners not linked: ${missing.join(', ')} missing from the Partners list; text kept)`)
  if (!e.year) console.log(`  (${e.slug}: no year in the profile)`)
}

console.log(`\n${changes} field change(s) ${apply ? 'written' : 'found (dry run, nothing written; APPLY=1 to write)'}`)
process.exit(0)
