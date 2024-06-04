import React from 'react'

import Navbar from '@/app/components/admin/Navbar'
// import Sidebar from '@/app/components/admin/SIdebar'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className='flex justify-around'>
      {/* <Sidebar/> */}
      {children}
      </div>
      
    </>
  )
}

export default layout