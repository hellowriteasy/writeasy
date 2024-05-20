'use client'
import React from "react";
import Pencil from "@/public/Game/Pencil.svg";
import Image from "next/image";
import Link from "next/link";

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
    <div>
      
        <div
      
          className="w-11/12 h-40 flex relative bg-white border-2 z-10 border-gray-300 rounded-3xl overflow-hidden mb-4"
        >
          <div className="px-6 py-4 w-10/12">
            <div className="font-bold font-comic text-xl mb-2">
              {prompt.promptText}
            </div>
            <p className="text-gray-900 font-bold font-comic pt-8 text-base">
              Category: {prompt.category}
            </p>
          </div>
          <Link href={`/Practices/practice/`}>
          {/* ${prompt.promptId} */}
            <div className="absolute right-10 top-10 flex cursor-pointer justify-end">
              <Image src={Pencil} alt="Pencil" />
            </div>
          </Link>
        </div>
    
    </div>
  );
};

export default Prompt;
