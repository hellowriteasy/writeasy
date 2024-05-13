'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import contest from '@/app/json/contest.json'
interface contest{
  contestTitle:string,
  date:string,
  time:string
}
const Join = () => {
  const router = useRouter();
  return (
    <div  className='flex flex-col font-comic rounded-3xl w-[50vw] h-80 gap-7 bg-white justify-center items-center'>
     <h3 className='text-3xl'>until {contest[0].time} - {contest[0].date} GMT</h3>
     <h1 className='text-5xl font-comic font-bold'>#8: {contest[0].contestTitle}</h1>
     <button onClick={() => router.push('/Contests/viewcontest')} className='bg-black font-comic rounded-3xl text-white h-12 w-40 text-center text-3xl' >Join</button>
    </div>
  )
}

export default Join