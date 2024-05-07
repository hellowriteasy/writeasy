import React from 'react'
import Image from 'next/image'
import cloud2 from '@/public/Game/cloud2.svg'
import shootingstar from '@/public/Game/shotting_star.svg'
import Storytitle from '@/app/components/Others/Storytitle'
import Pagination from '@/app/components/Pagination'
const page = () => {
  return (
    <div className='w-screen  font-comic h-[1750px] flex flex-col '>
   <div className='h-80  border-game  relative w-full flex  items-center   flex-col '>
    <div className='absolute left-0'>
        <Image src={shootingstar} alt='shootingstar' ></Image>
    </div>
    <div className='w-4/5 font-comic flex flex-col gap-10 mt-20'>

   <h1 className='text-6xl font-bold font-comic '>Setting text of this story </h1>
   <button className='w-full bg-black  text-center text-white rounded-3xl border h-20 text-4xl'>Create you Story </button>
    </div>
    <div className='absolute right-5 top-60'>
        <Image src={cloud2} alt='cloud2' ></Image>
    </div>
   </div>
   <div className='w-screen   flex flex-col  items-center'>
    <div className='w-4/5'>
      <h1 className='font-bold text-7xl pt-5  font-comic'>Stories</h1>
      <div className='mt-4  flex flex-col gap-8'>
       <Storytitle></Storytitle>
       <Storytitle></Storytitle>
       <Storytitle></Storytitle>
       
      </div>
    <div className='w-full ms-28  mt-10'>
      <Pagination></Pagination>
    </div>
    </div>
   </div>
    </div>
  )
}

export default page