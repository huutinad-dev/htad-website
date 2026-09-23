'use client'

import { motion } from 'motion/react'
import type { ReactNode } from 'react'

// Re-mounts on every navigation, giving each page a soft fade-in.
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
      {children}
    </motion.div>
  )
}
