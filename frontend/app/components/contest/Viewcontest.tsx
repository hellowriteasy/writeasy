import React from "react";
import Pencil from "@/public/Game/Pencil.svg";
import Image from "next/image";
import Link from "next/link";
import { title } from "process";

interface PromptProps {
  promptText: string;
  promptCategory: string;
  contestId: string;
  promptId: string;
  onSelectPrompt: (contestId: string, promptId: string) => void;
}

const ContestPrompt: React.FC<PromptProps> = ({
  promptText,
  promptCategory,
  contestId,
  promptId,
  onSelectPrompt,
}) => {
  const handleClick = () => {
    onSelectPrompt(contestId, promptId);
  };

  return (
    <div className="flex justify-center px-4 md:px-0">
      <div className="w-full max-w-3xl h-auto md:h-40 flex relative bg-white border-2 border-gray-300 rounded-3xl overflow-hidden mb-4">
        <div className="px-4 py-4 md:px-6 md:py-4 w-full md:w-10/12">
          <div className="font-bold font-comic text-wrap text-base md:text-xl mb-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
            {title}
          </div>
          <p className="text-gray-700 font-bold text-wrap font-comic pt-4 md:pt-8 text-sm md:text-base">
            Category: {promptCategory}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContestPrompt;
