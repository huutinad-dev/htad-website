/**
 * Content update from the client's "Content Website HTAD" sheet (Oct 2026).
 *   MATERIALS_DIR=~/Downloads/MATERIALS npx payload run src/seed/update-2026-10.ts
 *
 * Unlike `npm run seed`, this never wipes anything: it updates documents in place
 * (matched by slug) and is safe to run more than once — images already uploaded by a
 * previous run are reused instead of uploaded again. Only the four old project
 * categories are deleted, once no project points to them anymore.
 *
 * Images come from the client's original MATERIALS folder (one sub-folder per project),
 * resized to 2400px max and re-encoded as JPEG before upload.
 */
import fs from 'fs'
import os from 'os'
import path from 'path'
import { getPayload } from 'payload'
import sharp from 'sharp'

import config from '../payload.config'
import { richText } from './lexical'

const MATERIALS = (process.env.MATERIALS_DIR || path.join(os.homedir(), 'Downloads/MATERIALS')).replace(/^~/, os.homedir())

const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(`[update] ${msg}`)

type L = { en: string; vi: string }

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

const IMAGE = /\.(jpe?g|png|webp)$/i
const folderImages = (folder: string) => {
  const dir = path.join(MATERIALS, folder)
  if (!fs.existsSync(dir)) throw new Error(`Missing materials folder: ${dir}`)
  // default (code-point) sort, so the indices below stay stable
  return fs.readdirSync(dir).filter((f) => IMAGE.test(f)).sort().map((f) => path.join(dir, f))
}

/** Upload `file` as `<name>.jpg`, or reuse the media doc a previous run created. */
const upload = async (file: string, name: string, alt: string) => {
  const filename = `${name}.jpg`
  const existing = await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1 })
  if (existing.docs[0]) return existing.docs[0].id
  const data = await sharp(file)
    .rotate()
    .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer()
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data, mimetype: 'image/jpeg', name: filename, size: data.length },
  })
  return doc.id
}

/** Cover + gallery from a materials folder; indices refer to the sorted image list. */
const folderMedia = async (folder: string, slug: string, alt: string, cover: number, skip: number[] = []) => {
  const files = folderImages(folder)
  const order = [cover, ...files.map((_, i) => i).filter((i) => i !== cover && !skip.includes(i))]
  const ids: number[] = []
  // sequential on purpose: parallel uploads race on the unique filename check
  for (const [n, i] of order.entries()) {
    ids.push(await upload(files[i], `${slug}-hd-${String(n + 1).padStart(2, '0')}`, `${alt} ${n + 1}`))
  }
  return { cover: ids[0], gallery: ids.slice(1) }
}

// ---------------------------------------------------------------------------
// Project categories: All | Creative | Consulting | Partnering | Event | Publishing
// ---------------------------------------------------------------------------

const categories: { slug: string; title: L }[] = [
  { slug: 'creative', title: { en: 'Creative', vi: 'Sáng tạo' } },
  { slug: 'consulting', title: { en: 'Consulting', vi: 'Tư vấn' } },
  { slug: 'partnering', title: { en: 'Partnering', vi: 'Hợp tác' } },
  { slug: 'event', title: { en: 'Event', vi: 'Sự kiện' } },
  { slug: 'publishing', title: { en: 'Publishing', vi: 'Xuất bản' } },
]
const OLD_CATEGORIES = ['branding-design', 'marketing-campaigns', 'video-production', 'events-publishing']

const categoryIds = new Map<string, number>()
for (const c of categories) {
  const found = await payload.find({ collection: 'project-categories', where: { slug: { equals: c.slug } }, limit: 1 })
  const id =
    found.docs[0]?.id ??
    (await payload.create({ collection: 'project-categories', locale: 'en', data: { slug: c.slug, title: c.title.en } })).id
  await payload.update({ collection: 'project-categories', id, locale: 'en', data: { title: c.title.en } })
  await payload.update({ collection: 'project-categories', id, locale: 'vi', data: { title: c.title.vi } })
  categoryIds.set(c.slug, id)
}
log(`${categories.length} categories`)

// ---------------------------------------------------------------------------
// Existing projects: new category, partner / role, original high-res images
// ---------------------------------------------------------------------------

type ProjectUpdate = {
  slug: string
  category: string
  title?: L
  partner?: L
  role?: L
  images?: { folder: string; cover: number; skip?: number[] }
}

const same = (s: string): L => ({ en: s, vi: s })

const projectUpdates: ProjectUpdate[] = [
  {
    slug: 'vleague-rebranding',
    category: 'consulting',
    partner: same('VPF'),
    images: { folder: 'V.LEAGUE Rebranding', cover: 1 },
  },
  {
    slug: 'vpf-rebranding',
    category: 'consulting',
    partner: same('VPF'),
    images: { folder: 'VPF Rebranding', cover: 1, skip: [8] },
  },
  {
    slug: 'watch-world-cup-on-vtvgo',
    category: 'creative',
    partner: same('VTVgo × Mobifone'),
    role: {
      en: 'Creative design, media, KOL partnerships & TVC production',
      vi: 'Thiết kế sáng tạo, truyền thông, hợp tác KOL & sản xuất TVC',
    },
    images: { folder: 'Xem World Cup trên VTVgo', cover: 6 },
  },
  { slug: 'trailer-lpbank-vleague-2026-27', category: 'creative' },
  { slug: 'trailer-lpbank-vleague-2025-26', category: 'creative' },
  { slug: 'trailer-lpbank-vleague-2024-25', category: 'creative' },
  {
    slug: 'key-visual-design',
    category: 'creative',
    title: { en: 'V.League 2025/26 Club Key Visuals', vi: 'Key visual các CLB V.League 2025/26' },
    images: { folder: 'KV V.LEAGUE 25-26', cover: 29 },
  },
  {
    slug: 'total-football-game-launch',
    category: 'creative',
    partner: same('VNG Games'),
    // index 1 is a 415px thumbnail
    images: { folder: 'Launch Game Total Football', cover: 3, skip: [1] },
  },
  {
    slug: 'book-1999-manchester-united',
    category: 'publishing',
    role: { en: 'Publisher', vi: 'Đơn vị xuất bản' },
    // 12 and 13 are low-res duplicates
    images: { folder: 'SÁCH 1999', cover: 1, skip: [12, 13] },
  },
  {
    slug: 'next-generation-vietnam',
    category: 'event',
    partner: same('Mitsubishi Heavy Industries × Urawa Reds'),
    role: { en: 'Consultancy & event organisation', vi: 'Tư vấn & tổ chức sự kiện' },
    images: { folder: 'MHI x URAWA REDS - Next Generarion Vietnam', cover: 2 },
  },
  { slug: 'fan-culture-event', category: 'event' },
]

for (const u of projectUpdates) {
  const found = await payload.find({ collection: 'projects', where: { slug: { equals: u.slug } }, limit: 1, depth: 0 })
  const project = found.docs[0]
  if (!project) {
    log(`skip ${u.slug}: not found`)
    continue
  }
  const media = u.images
    ? await folderMedia(u.images.folder, u.slug, u.title?.en ?? project.title, u.images.cover, u.images.skip)
    : null
  for (const locale of ['en', 'vi'] as const) {
    await payload.update({
      collection: 'projects',
      id: project.id,
      locale,
      data: {
        ...(locale === 'en' ? { category: categoryIds.get(u.category)! } : {}),
        ...(locale === 'en' && media ? media : {}),
        ...(u.title ? { title: u.title[locale] } : {}),
        ...(u.partner ? { partner: u.partner[locale] } : {}),
        ...(u.role ? { role: u.role[locale] } : {}),
      },
    })
  }
  log(`project ${u.slug}${media ? ` (${media.gallery.length + 1} images)` : ''}`)
}

// Old categories are empty now
for (const slug of OLD_CATEGORIES) {
  const found = await payload.find({ collection: 'project-categories', where: { slug: { equals: slug } }, limit: 1 })
  const old = found.docs[0]
  if (!old) continue
  const used = await payload.count({ collection: 'projects', where: { category: { equals: old.id } } })
  if (used.totalDocs) log(`keep category ${slug}: still used by ${used.totalDocs} project(s)`)
  else await payload.delete({ collection: 'project-categories', id: old.id })
}

// ---------------------------------------------------------------------------
// Home page
// ---------------------------------------------------------------------------

const homeCopy = {
  en: {
    title: 'Premium content.\nTrusted partners.',
    subtitle:
      'Vietnam-based media agency specializing in sports and entertainment.\n\nWe provide strategic advisory and media services to leagues, clubs, rights holders, and corporations across global markets.',
    cta: 'Every opportunity begins with a connection.',
  },
  vi: {
    title: 'Uy tín. Kết nối.\nCơ hội.',
    subtitle:
      'Hữu Tín là công ty truyền thông chuyên về lĩnh vực thể thao và giải trí, hoạt động tại Việt Nam.\n\nChúng tôi cung cấp dịch vụ tư vấn chiến lược và truyền thông cho các doanh nghiệp, giải đấu, câu lạc bộ và đơn vị sở hữu bản quyền trên thị trường quốc tế.',
    cta: 'Mọi cơ hội đều bắt đầu từ một kết nối.',
  },
}
for (const locale of ['en', 'vi'] as const) {
  const c = homeCopy[locale]
  const current = await payload.findGlobal({ slug: 'home-page', locale, depth: 0 })
  await payload.updateGlobal({
    slug: 'home-page',
    locale,
    data: {
      hero: { ...current.hero, title: c.title, subtitle: c.subtitle },
      // "Bỏ chữ nhỏ bên dưới": heading + button only
      cta: { heading: c.cta, text: null },
    },
  })
}
log('home page')

// ---------------------------------------------------------------------------
// About page (Who we are)
// ---------------------------------------------------------------------------

const aboutCopy = {
  en: {
    heading: 'Who we are',
    company: [
      'Hữu Tín is a Vietnam-based boutique media agency specializing in sports and entertainment.',
      'Our mission is to connect Vietnam and Asia with the global stage through premium content, strategic advisory, and hands-on media execution.',
      'Operating from Vietnam, we believe in the growing potential of Asia and its ability to shape the future of global sports and entertainment.',
      'By connecting rights holders, brands, and audiences across markets, we create meaningful partnerships and opportunities that bring Asian stories, content, and value to the world.',
    ],
    founder: [
      'BA PHU is one of Vietnam’s recognized football commentators and sports media personalities, with more than 10 years of experience across sports media, content, and entertainment.',
      'In 2023, he became the only Vietnamese producer selected by FIFA to work on the FIFA Women’s World Cup, marking a significant milestone in his international sports career.',
      'Drawing on his extensive network across the sports and media industries, as well as his deep understanding of fan culture and content, Ba Phu founded HTAd with a vision to connect premium international sports and entertainment content with audiences in Vietnam and beyond. A key achievement in this regard was successfully negotiating the exclusive broadcasting rights for the J.LEAGUE in Vietnam.',
      'Through HTAd, he supports corporations and rights holders in developing international partnerships, pursuing cross-border opportunities and providing end-to-end support from strategic planning to on-the-ground execution.',
    ],
  },
  vi: {
    heading: 'Về HTAd',
    company: [
      'Hữu Tín là công ty truyền thông tại Việt Nam, chuyên về lĩnh vực thể thao và giải trí.',
      'Sứ mệnh của chúng tôi là kết nối các doanh nghiệp Việt Nam và châu Á thông qua nội dung chất lượng cao, tư vấn chiến lược và các giải pháp triển khai truyền thông thực tế.',
      'Chúng tôi đặt niềm tin vào tiềm năng ngày càng lớn của châu Á và vai trò của khu vực trong việc định hình tương lai của ngành thể thao và giải trí toàn cầu.',
      'Thông qua việc kết nối các đơn vị sở hữu bản quyền, thương hiệu và khán giả giữa các thị trường, chúng tôi kiến tạo những mối quan hệ đối tác và cơ hội có giá trị, đưa những câu chuyện, nội dung và bản sắc của châu Á đến với thế giới.',
    ],
    founder: [
      'BÁ PHÚ là gương mặt bình luận viên được khán giả Việt Nam yêu mến qua các giải đấu lớn như World Cup, Ngoại hạng Anh và Champions League.',
      'Năm 2023, anh trở thành nhà sản xuất người Việt duy nhất được FIFA lựa chọn tham gia FIFA Women’s World Cup, đánh dấu một cột mốc quan trọng trong hành trình hoạt động quốc tế ở lĩnh vực thể thao.',
      'Với hơn 10 năm kinh nghiệm trong lĩnh vực thể thao, truyền thông, nội dung và giải trí, Bá Phú sáng lập HTAd với định hướng kết nối các nội dung thể thao và giải trí quốc tế chất lượng cao với khán giả tại Việt Nam và các thị trường khác. Một trong số đó là việc thành công đàm phán bản quyền phát sóng J.LEAGUE độc quyền tại thị trường Việt Nam.',
      'Thông qua HTAd, anh hỗ trợ các doanh nghiệp và đơn vị sở hữu bản quyền phát triển quan hệ đối tác quốc tế, mở rộng sang các thị trường mới, đồng thời hoạch định chiến lược và đảm bảo kế hoạch triển khai thực tế mang lại hiệu quả tốt nhất.',
    ],
  },
}
for (const locale of ['en', 'vi'] as const) {
  const c = aboutCopy[locale]
  const current = await payload.findGlobal({ slug: 'about-page', locale, depth: 0 })
  const [lead, ...body] = c.company
  await payload.updateGlobal({
    slug: 'about-page',
    locale,
    data: {
      heading: c.heading,
      lead,
      body: richText(...body),
      founder: { ...current.founder, name: current.founder?.name ?? 'Nguyen Ba Phu', bio: richText(...c.founder) },
    },
  })
}
log('about page')

// ---------------------------------------------------------------------------
// Site settings: contact (no phone), contact page copy, social links
// ---------------------------------------------------------------------------

const settingsCopy = {
  en: {
    address: '29T1 Hoang Dao Thuy, Hanoi, Vietnam',
    heading: 'Contact us',
    lead: 'Get in touch to explore rights partnerships, business connections and the execution of your media plans.',
  },
  vi: {
    address: '29T1 Hoàng Đạo Thuý, Hà Nội, Việt Nam',
    heading: 'Liên hệ',
    lead: 'Để tìm hiểu các cơ hội hợp tác bản quyền, kết nối doanh nghiệp và thực thi kế hoạch truyền thông.',
  },
}
for (const locale of ['en', 'vi'] as const) {
  const c = settingsCopy[locale]
  const current = await payload.findGlobal({ slug: 'site-settings', locale, depth: 0 })
  await payload.updateGlobal({
    slug: 'site-settings',
    locale,
    data: {
      contact: { ...current.contact, phone: null, address: c.address },
      contactPage: { heading: c.heading, lead: c.lead },
      social: [
        { label: 'BLV Bá Phú', url: 'https://www.facebook.com/Blvbaphupages' },
        { label: 'Pacific Anime', url: 'https://www.youtube.com/@PacificAnime' },
      ],
    },
  })
}
log('site settings')

log('done')
process.exit(0)
