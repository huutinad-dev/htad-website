import Link from 'next/link'
import type { ReactNode } from 'react'

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={`h-4 w-4 ${className ?? ''}`}>
      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type Props = {
  href: string
  children: ReactNode
  variant?: 'solid' | 'outline' | 'text'
  external?: boolean
  className?: string
}

export function ArrowLink({ href, children, variant = 'outline', external, className }: Props) {
  const styles = {
    solid: 'bg-gold text-ink hover:bg-white px-6 py-3.5',
    outline: 'border border-white/25 text-white hover:border-gold hover:text-gold px-6 py-3.5',
    text: 'text-gold hover:text-white',
  }[variant]
  const cls = `group inline-flex shrink-0 items-center gap-3 whitespace-nowrap rounded-full text-sm font-semibold uppercase tracking-wider transition-colors duration-300 ${styles} ${className ?? ''}`
  const inner = (
    <>
      <span>{children}</span>
      <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
    </>
  )
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  )
}
