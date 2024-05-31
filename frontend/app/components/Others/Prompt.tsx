import React from 'react';
import Pencil from "@/public/Game/Pencil.svg";
import Image from 'next/image';
import Link from 'next/link';

interface PromptProps {
  prompt: {
    promptText: string;
    category: string;
    contestId: string;
    promptId: string;
  };
}

const Prompt: React.FC<PromptProps> = ({ prompt }) => {
  return (
    <div className="w-11/12 h-40 flex relative bg-white border-2 border-gray-300 rounded-3xl overflow-hidden">
      <div className="px-6 py-4 w-5/6">
        <div className="font-bold font-comic text-xl mb-2">{prompt.promptText}</div>
        <p className="text-gray-700 font-comic pt-8 text-base">Category: {prompt.category}</p>
      </div>
      <Link href="/Games/creategames">
        <div className="absolute right-10 top-10 flex cursor-pointer justify-end">
          <Image src={Pencil} alt='Pencil' />
        </div>
      </Link>
    </div>
  );
};

export default Prompt;
