import React from 'react';
import Image from 'next/image';
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import cloud from "@/public/Game/sm-cloud.svg"
const Pagination = () => {
  return (
    <div className=' w-[53vw]  relative h-20 flex ' >
      <div className='flex space-x-4 font-unkempt items-center text-white'>
        <button className='rounded-full relative w-20 h-20  border border-slate-200 bg-white text-black p-2'>
          <FaAngleLeft className='w-10 h-10 absolute left-5 top-5' />
        </button>
        <button className='rounded-full relative w-20 h-20 text-2xl border border-slate-200  bg-black  text-white p-2'>
          1
        </button>
        <button className='rounded-full relative w-20 h-20 text-2xl border border-slate-200 bg-white   text-black p-2'>
          2
        </button>
        <button className='rounded-full relative w-20 h-20 text-2xl border border-slate-200 bg-white    text-black p-2'>
          ...
        </button>
        <button className='rounded-full relative w-20 h-20 text-2xl border border-slate-200 bg-white     text-black p-2'>
          10
        </button>
        <button className='rounded-full relative w-20 h-20 text-2xl border border-slate-200 bg-white     text-black p-2'>
          <FaAngleRight className='w-10 h-10 absolute left-5 top-5' />
        </button>
      </div>
      <div className='absolute top-0 -right-96'>
        <Image src={cloud} alt='cloud'></Image>
      </div>
    </div>
  );
};

export default Pagination;
