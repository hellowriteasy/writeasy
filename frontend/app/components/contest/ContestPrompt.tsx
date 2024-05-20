import React from "react";
import Pencil from "@/public/Game/Pencil.svg";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Use next/navigation for the router

interface PromptProps {
  promptText: string;
  promptCategory: string;
  contestId: string;
  promptId: string;
  onSelectPrompt: (contestId: string, promptId: string) => void;
}

const Prompt = ({
  promptText,
  promptCategory,
  contestId,
  promptId,
  onSelectPrompt,
}: PromptProps) => {
  const handleClick = () => {
    onSelectPrompt(contestId, promptId);
  };

  return (
    <div className="w-11/12 h-40 flex bg-white shadow-md rounded-3xl overflow-hidden">
      <div className="px-6 py-4">
        <div className="font-bold font-comic text-xl mb-2">{promptText}</div>
        <p className="text-gray-700 font-comic pt-8 text-base">
          Category: {promptCategory}
        </p>
      </div>
      <div
        onClick={handleClick}
        className="px-6 py-12 flex cursor-pointer justify-end"
      >
        <Image src={Pencil} alt="Pencil" />
      </div>
    </div>
  );
};

export default Prompt;
