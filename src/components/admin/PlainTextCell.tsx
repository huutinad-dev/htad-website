import type { DefaultCellComponentProps } from 'payload'

// List-view cell for an optional text field: the value, or nothing at all when it is empty
// (Payload's default cell prints "<No Label>" there).
export function PlainTextCell({ cellData }: DefaultCellComponentProps) {
  return <span>{typeof cellData === 'string' ? cellData.trim() : ''}</span>
}
