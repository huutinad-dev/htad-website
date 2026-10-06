'use client'

import Image, { type ImageProps } from 'next/image'
import { useEffect, useState } from 'react'

const RETRIES = 2

// next/image that retries a failed load. Right after a deploy, or when the image function is
// cold, the first request for an image can fail; the browser then shows a broken image (and may
// keep the failure cached until a hard reload). A retry asks for the same image under a new
// URL, after a short pause.
export function SafeImage({ src, onError, ...props }: ImageProps) {
  const [attempt, setAttempt] = useState(0)
  const [failedAt, setFailedAt] = useState<number | null>(null)

  useEffect(() => {
    if (failedAt === null || failedAt >= RETRIES) return
    const timer = setTimeout(() => setAttempt(failedAt + 1), 600 * (failedAt + 1))
    return () => clearTimeout(timer)
  }, [failedAt])

  const retrySrc =
    attempt > 0 && typeof src === 'string' ? `${src}${src.includes('?') ? '&' : '?'}r=${attempt}` : src

  return (
    <Image
      {...props}
      key={attempt}
      src={retrySrc}
      onError={(event) => {
        setFailedAt(attempt)
        onError?.(event)
      }}
    />
  )
}
