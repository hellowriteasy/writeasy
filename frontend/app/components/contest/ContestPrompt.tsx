"use client";
import React, { useEffect, useState } from "react";
import Pencil from "@/public/Game/Pencil.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/app/utils/config/axios";
import useAuthStore from "@/app/store/useAuthStore";

interface PromptProps {
  promptText: string;
  contestId: string;
  promptId: string;
  onSelectPrompt: (contestId: string, promptId: string, title: string) => void;
  isActive: boolean;
}

const ContestPrompt: React.FC<PromptProps> = ({
  promptText,
  contestId,
  promptId,
  onSelectPrompt,
  isActive,
}) => {
  const router = useRouter();
  const { token, userId } = useAuthStore();
  const [hasSubmittedStory, setHasSubmittedStory] = useState<boolean | null>(
    null
  );
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  const axiosIns = axiosInstance(token || "");

  useEffect(() => {
    const handleFetchStoryOfAUserByPromptId = async () => {
      try {
        const { data } = await axiosIns.get(
          `/stories/user/${promptId}/${userId}`
        );
        setHasSubmittedStory(!!data);
      } catch (error) {
        //
      }
    };
    handleFetchStoryOfAUserByPromptId();
  }, [promptId, userId]);

  const handleRedirectToCreateStory = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/Contests/${contestId}/prompt/${promptId}/story/create`);
  };

  const handleRedirectToStory = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/profile/contest?search=${promptId}`);
  };

  const handleRedirectToPromptWritings = () => {
    if (isActive) return;
    router.push(`/Contests/${contestId}/${promptId}`);
  };

  const toggleShowFullPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFullPrompt((prevShowFullPrompt) => !prevShowFullPrompt);
  };

  const getPromptText = () => {
    const words = promptText.split(' ');
    if (words.length > 15) {
      return showFullPrompt ? promptText : words.slice(0, 15).join(' ') + '...';
    }
    return promptText;
  };

  return (
    <div
      className="flex justify-center px-4 md:px-0 w-full bg-white border-2 border-gray-300 rounded-3xl cursor-pointer"
      onClick={handleRedirectToPromptWritings}
    >
      <div className="w-full h-auto md:h-40 relative overflow-hidden mb-4">
        <div className="px-4 py-4 md:px-6 md:py-4 w-full md:w-5/6">
          <div className="font-bold font-comic text-wrap text-base w-5/6 md:text-xl mb-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
            {getPromptText()}
            {promptText.split(" ").length > 15 && (
              <button
                onClick={toggleShowFullPrompt}
                className="ml-2 text-yellow-500 underline"
              >
                {showFullPrompt ? "Read Less" : "Read More"}
              </button>
            )}
          </div>
        </div>

        {isActive && hasSubmittedStory !== null ? (
          !hasSubmittedStory ? (
            <div className="absolute right-4 top-4 md:right-10 md:top-10 flex cursor-pointer justify-end">
              <Image
                onClick={handleRedirectToCreateStory}
                src={Pencil}
                alt="Pencil"
                width={24}
                height={24}
                className="transition-transform md:w-auto md:h-auto sm:w-8 duration-300 ease-in-out transform hover:scale-125"
              />
            </div>
          ) : (
            <div
              className="absolute right-4 top-4 flex cursor-pointer"
              onClick={handleRedirectToStory}
            >
              <button className="border text-xl mid:text-[8px] mx-auto font-comic hover:bg-slate-800 border-slate-400 bg-black rounded-full text-white mid:w-20 mid:h-8  px-4 h-12">
                View your story
              </button>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default ContestPrompt;
