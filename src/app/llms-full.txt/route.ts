import { llmsResponse } from '@/lib/llms'

// The full text of the site as Markdown for AI assistants (src/lib/llms.ts), rebuilt with the pages.
export const revalidate = 600

export const GET = () => llmsResponse(true)
