import React from 'react';
import Pencil from "@/public/Game/Pencil.svg";
import Image from 'next/image';
import Link from 'next/link';
import { TPrompt } from '@/app/utils/types';

interface PromptProps {
  prompt: TPrompt
}

const Prompt: React.FC<PromptProps> = ({ prompt }) => {
  return (
    
    <div className="w-11/12 h-40 sm:h-28 flex relative bg-white border-2 border-gray-300 rounded-3xl overflow-hidden">
      <div className="px-6 py-4 w-5/6">
      <div className="font-bold font-comic text-lg mid:text-sm md:text-2xl lg:text-3xl mb-2">{prompt.title}</div>

        
      </div>
      <Link href={`/Games/${prompt._id}`}>
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
  );
};

export default Prompt;
