import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

// Content is served with ISR; purge the whole frontend whenever an editor saves.
// Outside of a Next.js request (e.g. the seed script) revalidatePath throws, so it is ignored.
const purge = async () => {
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
  } catch {
    // not running inside Next.js
  }
}

export const revalidateCollection: CollectionAfterChangeHook = async ({ doc }) => {
  await purge()
  return doc
}

export const revalidateCollectionDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await purge()
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = async ({ doc }) => {
  await purge()
  return doc
}
