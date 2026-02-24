import DynamicFooter from '@/components/layout/dynamic-footer'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main>
        {children}
      </main>
      <DynamicFooter />
    </>
  )
}

export default layout