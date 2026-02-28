'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

const FooterComponent = dynamic(() => import('@/components/layout/footer'), { ssr: false })

export default function DynamicFooter() {
  const pathname = usePathname()
  if (pathname?.startsWith('/dashboard')) return null
  return <FooterComponent />
}
