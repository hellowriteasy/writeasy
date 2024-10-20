'use client'
import React, { useState } from "react";
import Pencil from "@/public/Game/Pencil.svg";
import Image from "next/image";
import Link from "next/link";
import { TPrompt } from "@/app/utils/types";

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
    <div className="flex justify-center md:px-0 sm:px-0 ">
      <div
        className={`w-full  h-auto flex relative bg-white border-2 ${
          prompt.isPinned ? "border-custom-yellow" : "border-gray-300"
        }  rounded-3xl overflow-hidden mb-4 `}
      >
        <div className="py-4 px-6 md:py-4 w-full md:w-10/12">
          <div className={` font-bold w-5/6 font-unkempt text-wrap text-base md:text-xl mb-2 overflow-hidden overflow-ellipsis whitespace-nowrap`}>
            {getTitle()}
            {prompt.title.split(" ").length > 15 && (
              <button
                onClick={toggleShowFullTitle}
                className="ml-2 text-yellow-500 underline"
              >
                {showFullTitle ? "Read Less" : "Read More"}
              </button>
            )}
          </div>
          <p className="text-gray-900 font-bold text-wrap font-unkempt pt-4 md:pt-8 text-sm md:text-base">
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
