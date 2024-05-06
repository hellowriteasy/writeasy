import React from 'react';
import Pencil from "@/public/Game/Pencil.svg"
import Image from 'next/image';
const Prompt= () => {
  return (
    <div className="w-[740px] mx-auto h-[180px ]  flex  bg-white shadow-md rounded-3xl overflow-hidden">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni corporis error</div>
        <p className="text-gray-700 text-base">Category :</p>
      </div>
      <div className="px-6 py-4 flex justify-end">
        <Image src={Pencil}  ></Image>
      </div>
    </div>
  );
};

export default Prompt;
