import FooterComponent from '@/components/FooterComponent'
import GreenLoopNavBar from '@/components/Navbar'
import React from 'react'

const layout = ({ children} : { children: React.ReactNode }) => {
  return (
    <>
    <GreenLoopNavBar />
    <main>
        {children}
    </main>
    <FooterComponent />
    </>
  )
}

export default layout