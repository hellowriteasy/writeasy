'use client'
import React from "react";
import Pencil from "@/public/Game/Pencil.svg";
import Image from "next/image";
import Link from "next/link";
import { TPrompt } from "@/app/utils/types";

interface PromptProps {
  prompt: TPrompt
}

const Prompt: React.FC<PromptProps> = ({ prompt }) => {
  
  return (
    <div className="flex justify-center px-4 md:px-0 sm:px-0">
      <div className="w-full max-w-3xl h-auto flex relative bg-white border-2 border-gray-300 rounded-3xl overflow-hidden mb-4">
        <div className="px-4 py-4 md:px-6 md:py-4 w-full md:w-10/12">
          <div className="font-bold font-comic text-wrap text-base md:text-xl mb-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
            {prompt.title}
          </div>
          <p className="text-gray-900 font-bold text-wrap font-comic pt-4 md:pt-8 text-sm md:text-base">
            Category: {prompt.promptCategory.join(",")}
          </p>
        </div>
        <Link href={`/Practices/${prompt._id}`}>
          <div className="absolute right-4 top-4 md:right-10 md:top-10 flex cursor-pointer justify-end">
            <Image 
              src={Pencil} 
              alt="Pencil" 
              width={24} 
              height={24} 
              className="transition-transform md:w-auto md:h-auto sm:w-8  duration-300 ease-in-out transform hover:scale-125" 
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Prompt;
