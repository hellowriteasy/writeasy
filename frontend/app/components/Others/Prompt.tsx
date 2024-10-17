import React, { useState } from 'react';
import Pencil from "@/public/Game/Pencil.svg";
import Image from 'next/image';
import Link from 'next/link';
import { TPrompt } from '@/app/utils/types';

interface PromptProps {
  prompt: TPrompt
}

const Prompt: React.FC<PromptProps> = ({ prompt }) => {
  const [showFullTitle, setShowFullTitle] = useState(false);

  const toggleShowFullTitle = () => {
    setShowFullTitle(prevShowFullTitle => !prevShowFullTitle);
  };

  const getTitle = () => {
    const words = prompt.title.split(' ');
    if (words.length > 15) {
      return showFullTitle ? prompt.title : words.slice(0, 15).join(' ') + '...';
    }
    return prompt.title;
  };

  return (
    <div className={`w-full h-40 sm:h-28 flex relative bg-white border-2  ${prompt.isPinned ? "border-custom-yellow" : "border-gray-300"} rounded-3xl overflow-hidden`}>
      <div className="px-6 py-4 w-5/6">
        <div className="font-bold w-5/6 font-unkempt text-wrap text-base md:text-xl mb-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
          {getTitle()}
          {prompt.title.split(" ").length > 15 && (
            <button
              onClick={toggleShowFullTitle}
              className="ml-2 text-blue-500 underline"
            >
              {showFullTitle ? "Read Less" : "Read More"}
            </button>
          )}
        </div>
      </div>
      <Link href={`/Games/${prompt._id}`}>
        <div className="absolute right-4 top-4 md:right-10 md:top-10 flex cursor-pointer justify-end">
          <Image
            src={Pencil}
            alt="Pencil"
            width={24}
            height={24}
            className="transition-transform md:w-auto md:h-auto sm:w-8 duration-300 ease-in-out transform hover:scale-125"
          />
        </div>
      </Link>
    </div>
  );
};

export default Prompt;
