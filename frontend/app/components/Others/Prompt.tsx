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
    
    <div className="w-11/12 h-40 flex relative bg-white border-2 border-gray-300 rounded-3xl overflow-hidden">
      <div className="px-6 py-4 w-5/6">
        <div className="font-bold font-comic text-xl mb-2">{prompt.title}</div>
        <div className="font-bold font-comic text-xl mb-2">{prompt.promptCategory.join(",")}</div>
        
      </div>
      <Link href={`/Games/${prompt._id}`}>
      <div className="absolute right-10 top-10 flex cursor-pointer justify-end">
      <Image
        src={Pencil}
        alt='Pencil'
        className="w-10 h-10 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
      />
    </div>
      </Link>
    </div>
  );
};

export default Prompt;
