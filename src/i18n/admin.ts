import type { Field } from 'payload'

/** A label in both admin languages. The admin UI language is each user's own setting. */
export const t = (en: string, vi: string) => ({ en, vi })

// Labels for field names used across collections and globals. A field that sets its own
// `label` keeps it; names missing here fall back to Payload's default (the field name).
const fieldLabels: Record<string, ReturnType<typeof t>> = {
  title: t('Title', 'Tiêu đề'),
  subtitle: t('Subtitle', 'Phụ đề'),
  headline: t('Headline', 'Tiêu đề phụ'),
  heading: t('Heading', 'Tiêu đề'),
  eyebrow: t('Eyebrow', 'Dòng chữ nhỏ phía trên'),
  lead: t('Lead', 'Đoạn mở đầu'),
  excerpt: t('Excerpt', 'Tóm tắt'),
  body: t('Body', 'Nội dung'),
  text: t('Text', 'Nội dung'),
  quote: t('Quote', 'Trích dẫn'),
  highlights: t('Highlights', 'Điểm nổi bật'),
  partner: t('Partner', 'Đối tác'),
  role: t('Role', 'Chức danh'),
  category: t('Category', 'Danh mục'),
  type: t('Type', 'Loại'),
  year: t('Year', 'Năm'),
  featured: t('Featured', 'Nổi bật'),
  cover: t('Cover', 'Ảnh bìa'),
  image: t('Image', 'Hình ảnh'),
  photo: t('Photo', 'Ảnh chân dung'),
  gallery: t('Gallery', 'Thư viện ảnh'),
  galleryCaption: t('Gallery caption', 'Chú thích thư viện ảnh'),
  logo: t('Logo', 'Logo'),
  logoStacked: t('Stacked logo', 'Logo dạng xếp dọc'),
  partners: t('Partners', 'Đối tác'),
  slides: t('Slides', 'Ảnh trình chiếu'),
  alt: t('Alt text', 'Mô tả ảnh'),
  videoUrl: t('Video URL', 'Link video'),
  externalUrl: t('External URL', 'Link ngoài'),
  relatedProjects: t('Related projects', 'Dự án liên quan'),
  featuredProjects: t('Featured projects', 'Dự án nổi bật'),
  hero: t('Hero', 'Phần mở đầu (Hero)'),
  marquee: t('Marquee', 'Dải chữ chạy'),
  stats: t('Key figures', 'Số liệu'),
  value: t('Value', 'Giá trị'),
  prefix: t('Prefix', 'Tiền tố'),
  suffix: t('Suffix', 'Hậu tố'),
  label: t('Label', 'Nhãn'),
  cta: t('Call to action', 'Kêu gọi hành động'),
  founder: t('Founder', 'Nhà sáng lập'),
  name: t('Name', 'Tên'),
  company: t('Company', 'Công ty'),
  message: t('Message', 'Nội dung'),
  bio: t('Bio', 'Tiểu sử'),
  companyName: t('Company name', 'Tên công ty'),
  shortName: t('Short name', 'Tên viết tắt'),
  tagline: t('Tagline', 'Khẩu hiệu'),
  contact: t('Contact details', 'Thông tin liên hệ'),
  phone: t('Phone', 'Điện thoại'),
  email: t('Email', 'Email'),
  website: t('Website', 'Website'),
  address: t('Address', 'Địa chỉ'),
  city: t('City', 'Thành phố'),
  mapUrl: t('Map URL', 'Link bản đồ'),
  social: t('Social links', 'Liên kết mạng xã hội'),
  url: t('URL', 'Đường dẫn'),
  link: t('Link', 'Liên kết'),
  visible: t('Visible', 'Hiển thị'),
  footerText: t('Footer text', 'Nội dung footer'),
  seoTitle: t('SEO title', 'Tiêu đề SEO'),
  seoDescription: t('SEO description', 'Mô tả SEO'),
  ogImage: t('Share image', 'Ảnh khi chia sẻ link'),
}

/** Fills in the bilingual label of every named field, recursing through tabs, groups and arrays. */
export const withLabels = (fields: Field[]): Field[] =>
  fields.map((field) => {
    const next = { ...field } as Field
    if ('name' in next && fieldLabels[next.name]) {
      if (next.label === undefined) next.label = fieldLabels[next.name]
      if (next.type === 'array' && !next.labels) next.labels = { singular: fieldLabels[next.name], plural: fieldLabels[next.name] }
    }
    if ('fields' in next) next.fields = withLabels(next.fields)
    if (next.type === 'tabs') next.tabs = next.tabs.map((tab) => ({ ...tab, fields: withLabels(tab.fields) }))
    return next
  })
