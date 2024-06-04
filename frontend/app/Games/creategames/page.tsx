'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import cloud2 from '@/public/Game/cloud2.svg';
import shootingstar from '@/public/Game/shotting_star.svg';
import Storytitle from '@/app/components/Others/Storytitle';
import Pagination from '@/app/components/Pagination';
import Link from 'next/link';
import Story from "@/app/json/Story.json"
interface Story {
  user: string;
  title: string;
  content: string;
  wordCount: number;
  submissionDateTime: string;
  score: number;
  corrections: string;
  contest: string;
  prompt: string;
  storyType: string;
}

const Page: React.FC = () => {
 

 
  return (
    <div className='w-screen font-comic h-[1750px] flex flex-col'>
      <div className='h-80 border-game relative w-full flex items-center flex-col'>
      <div className='absolute left-0'>
  <Image className='w-[9vw]' src={shootingstar} alt='shootingstar' />
</div>
<div className='w-4/5 font-comic flex flex-col gap-10 mt-20'>
  <h1 className='text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-comic'>Setting text of this story</h1>
  <Link href="/Games/creategames/play">
    <button className='w-full bg-black hover:opacity-80 text-center text-white rounded-3xl border h-20 text-xl md:text-2xl lg:text-3xl xl:text-4xl'>Create your Story</button>
  </Link>
</div>
<div className='absolute right-5 sm-hide top-60'>
  <Image className='w-[12vw]' src={cloud2} alt='cloud2' />
</div>

      </div>
      <div className='w-screen flex flex-col items-center'>
        <div className='w-4/5'>
          <h1 className='font-bold text-7xl pt-5 font-comic'>Stories</h1>
          <div className='mt-4 flex flex-col gap-8'>
            {Story.map((story, index) => (
              <Storytitle key={index} story={story} />
            ))}
          </div>
          <div className='w-full ms-28 mt-10'>
            <Pagination />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
