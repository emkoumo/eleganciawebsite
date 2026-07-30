import { RootShell } from '@/components/RootShell'
import { buildMetadata, sharedViewport } from '@/lib/metadata'

/* English root layout, serving "/". Greek has its own root layout at
   src/app/(el)/el/layout.tsx. Two root layouts rather than one shared shell so
   that <html lang> is correct in the served document — see RootShell. */

export const metadata = buildMetadata('en')
export const viewport = sharedViewport

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <RootShell locale="en">{children}</RootShell>
}
