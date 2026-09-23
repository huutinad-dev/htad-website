// Minimal helper to build Lexical rich text from plain paragraphs.
// Supports **bold** segments, which is all the seeded copy needs.
const textNodes = (paragraph: string) =>
  paragraph
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part) => {
      const bold = part.startsWith('**') && part.endsWith('**')
      return {
        type: 'text',
        text: bold ? part.slice(2, -2) : part,
        format: bold ? 1 : 0,
        detail: 0,
        mode: 'normal',
        style: '',
        version: 1,
      }
    })

export const richText = (...paragraphs: string[]) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: paragraphs.map((p) => ({
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      textFormat: 0,
      children: textNodes(p),
    })),
  },
})
