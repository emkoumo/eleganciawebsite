import { RootShell } from '@/components/RootShell'
import { buildMetadata, sharedViewport } from '@/lib/metadata'

/* Greek root layout, serving "/el". */

export const metadata = buildMetadata('el')
export const viewport = sharedViewport

export default function ElLayout({ children }: { children: React.ReactNode }) {
  return <RootShell locale="el">{children}</RootShell>
}
