import React from 'react';
import Pencil from "@/public/Game/Pencil.svg";
import Image from 'next/image';
import Link from 'next/link';
import promptData from '@/app/json/prompt.json';

interface PromptData {
  promptText: string;
  category: string;
}
const Prompt = () => {
  
  return (
  
    <div>
      {promptData.map((prompt, index) => (
        <div key={index} className="w-11/12 h-40 flex bg-white shadow-md rounded-3xl overflow-hidden mb-4">
          <div className="px-6 py-4">
            <div className="font-bold font-comic text-xl mb-2">{prompt.promptText}</div>
            <p className="text-gray-700 font-comic pt-8 text-base">Category: {prompt.category}</p>
          </div>
          <Link href="/Practices/practice">
            <div className="px-6 py-12 flex cursor-pointer justify-end">
              <Image src={Pencil} alt='Pencil' />
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Prompt;
