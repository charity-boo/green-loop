'use client'

import dynamic from 'next/dynamic'

const FooterComponent = dynamic(() => import('@/components/layout/footer'), {
  ssr: false,
})

export default function DynamicFooter() {
  return <FooterComponent />
}
