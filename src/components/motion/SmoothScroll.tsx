'use client'

import { ReactLenis, useLenis } from 'lenis/react'
import { usePathname } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'

function ResetOnNavigate() {
  const lenis = useLenis()
  const pathname = usePathname()
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true })
  }, [pathname, lenis])
  return null
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
      <ResetOnNavigate />
      {children}
    </ReactLenis>
  )
}
