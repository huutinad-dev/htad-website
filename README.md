# HTAd Portfolio — Payload CMS + Next.js

Website portfolio của **Huu Tin Trading & Advertising (HTAd)**, xây dựng từ file *Company profile 2026*.
Song ngữ **EN / VI**, toàn bộ nội dung quản lý qua Payload CMS tại `/admin`.

- **Stack:** Payload 3 · Next.js 16 (App Router) · PostgreSQL · Tailwind CSS 4 · Motion · Lenis · font Be Vietnam Pro (hỗ trợ đầy đủ tiếng Việt)
- **Ảnh:** khi có `BLOB_READ_WRITE_TOKEN` (bắt buộc trên Vercel), ảnh lưu trên **Vercel Blob**; không có token thì lưu local trong `media/` (không commit). Ảnh gốc để seed nằm ở `seed-assets/`.

## Deploy (Vercel)

Env: `DATABASE_URL`, `DATABASE_SCHEMA=htad`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `BLOB_READ_WRITE_TOKEN` (tạo Blob store trong tab Storage của project).
Lần đầu chuyển ảnh local lên Blob: `npx tsx scripts/upload-media-to-blob.ts` (cần token trong `.env`).

## Cài đặt

```bash
npm install
cp .env.example .env   # rồi điền DATABASE_URL, PAYLOAD_SECRET
npm run migrate        # tạo bảng trong schema `htad`
npm run seed           # nạp nội dung + ảnh từ company profile
npm run dev            # http://localhost:3000  (admin: /admin)
```

Lần đầu vào `/admin` sẽ được yêu cầu tạo tài khoản quản trị.

## ⚠️ Database dùng chung

DB đang dùng chung với một ứng dụng khác (schema `public`). Vì vậy:

- Payload chỉ tạo bảng trong schema **`htad`** (`DATABASE_SCHEMA`), cấu hình ở `src/payload.config.ts`.
- `push` (tự đồng bộ schema khi dev) đã **tắt**. Mọi thay đổi schema phải đi qua migration:
  ```bash
  npm run migrate:create <ten>   # sinh file trong src/migrations
  # đọc lại SQL, đảm bảo chỉ chạm "htad".*
  npm run migrate
  ```
- Trên Vercel, migration **tự chạy khi build**: Vercel ưu tiên script `vercel-build` (`npm run migrate && npm run build`). Vì vậy migration nào đã commit sẽ chạy trên DB production trước khi build. Migration lỗi thì build dừng và bản deploy cũ vẫn chạy.
- **Không bao giờ** chạy `payload migrate:fresh`, `migrate:reset` hay bật `push: true`.

## Cấu trúc nội dung (CMS)

| Mục | Loại | Nội dung |
|---|---|---|
| Home page | Global | Hero + slideshow, marquee, giới thiệu, số liệu, tiêu đề các section, dự án nổi bật, logo đối tác, CTA |
| About page | Global | Giới thiệu công ty, mạng lưới, nhà sáng lập |
| Site settings | Global | Logo, thông tin liên hệ, footer, SEO |
| Services | Collection | 7 dịch vụ: mô tả, điểm nổi bật, gallery, logo đối tác, dự án liên quan |
| Projects | Collection | 11 dự án: danh mục, năm, gallery, link YouTube, link ngoài |
| Project categories | Collection | Danh mục dùng để lọc dự án |
| Media | Upload | Ảnh (có focal point) |

Đổi ngôn ngữ nội dung bằng bộ chọn **Locale** ở góc trên trang admin. Trường nào chưa dịch sẽ tự lấy bản tiếng Anh.

## Trang

`/en` · `/vi` — Trang chủ
`/[locale]/about` · `/[locale]/services` · `/[locale]/services/[slug]`
`/[locale]/projects` (lọc theo `?category=`) · `/[locale]/projects/[slug]` · `/[locale]/contact`

Trang được cache (ISR, 10 phút). Khi lưu nội dung trong CMS, cache được xoá ngay (`src/hooks/revalidate.ts`).

## Mã nguồn

```
src/
  app/(frontend)/[locale]/   Các trang public
  app/(payload)/             Admin + API của Payload
  collections/  globals/     Schema CMS
  components/                UI; components/motion/ chứa animation (Reveal, SplitHeading, Parallax, Counter, SmoothScroll)
  lib/                       Truy vấn Payload, từ điển UI (dictionary.ts), helper media
  seed/                      Nội dung EN/VI trích từ PDF + script seed
  migrations/                Migration SQL (schema htad)
seed-assets/                 Ảnh & logo trích từ PDF
```

## Ghi chú

- Ảnh trích từ PDF đã bị Canva nén (tối đa ~800px). Nên thay bằng ảnh gốc độ phân giải cao qua `/admin → Media`.
- Mô tả các dự án *VPF Rebranding, Key Visuals, Total Football, Fan Culture Event* không có trong PDF và là bản viết tạm — cần kiểm tra lại.
