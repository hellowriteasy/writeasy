import React from 'react';
import Pencil from "@/public/Game/Pencil.svg"
import Image from 'next/image';
import Link from 'next/link';
const Prompt= () => {
  return (
    <div className=" w-11/12 h-40  flex  bg-white shadow-md rounded-3xl overflow-hidden">
      <div className="px-6 py-4 ">
        <div className="font-bold font-comic text-xl mb-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni corporis error</div>
        <p className="text-gray-700 font-comic pt-8 text-base">Category :</p>
      </div>
      <Link href="/creategames">
      <div className="px-6 py-12 flex cursor-pointer justify-end">
        <Image src={Pencil} alt='Pencil'  ></Image>
      </div>
      </Link>
    </div>
  );
};

export default Prompt;
