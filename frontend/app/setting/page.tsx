import React from 'react'
import Image from 'next/image'
const page = () => {
  return (
    <div className='w-screen h-full flex flex-col justify-center font-comic items-center'>
       
       <div className='h-28'>
        <h1 className='text-5xl font-comic font-bold pt-5'>Account Settings</h1>
       </div>

       <div className='w-40 h-40 bg-slate-700 rounded-full '>
        <Image className='w-full h-full' src="" alt='profile'></Image>
       </div>
       <div className='w-screen flex justify-center items-center h-48 '>
      <form action="" className='w-[70%]  ms-72 flex  gap-8   mt-10 flex-wrap '>
         <input  className="border border-gray-500 w-96 z-10 text-xl rounded-3xl indent-7 h-14 focus:outline-none focus:border-yellow-600"  placeholder='email' />
         <input className="border border-gray-500 w-96 z-10 text-xl rounded-3xl indent-7 h-14 focus:outline-none focus:border-yellow-600"   placeholder='username' />
         <input  className="border border-gray-500 w-96 z-10 text-xl rounded-3xl indent-7 h-14 focus:outline-none focus:border-yellow-600"  placeholder='New password' />
         <input  className="border border-gray-500 w-96 z-10 text-xl rounded-3xl indent-7 h-14 focus:outline-none focus:border-yellow-600"  placeholder='Confirm new password' />
         </form>
       </div>
       <div className='mt-10'>
        <button className='text-white bg-black border text-2xl font-bold font-comic rounded-full w-96 h-14'>Update</button>
       </div>
    </div>
  )
}

export default page