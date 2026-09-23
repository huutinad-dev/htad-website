import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[80svh] flex-col items-start justify-center pt-24">
      <p className="display text-[30vw] leading-none text-gold md:text-[18vw]">404</p>
      <p className="mt-4 text-lg text-muted">Page not found · Không tìm thấy trang</p>
      <Link href="/" className="mt-10 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-ink hover:bg-white">
        Home
      </Link>
    </section>
  )
}
