"use client";
import React, { useEffect, useState } from "react";
import Pencil from "@/public/Game/Pencil.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/app/utils/config/axios";
import useAuthStore from "@/app/store/useAuthStore";

interface PromptProps {
  promptText: string;
  promptCategory: string[];
  contestId: string;
  promptId: string;
  onSelectPrompt: (contestId: string, promptId: string, title: string) => void;
  isActive: boolean;
}

const ContestPrompt: React.FC<PromptProps> = ({
  promptText,
  promptCategory,
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
  const axiosIns = axiosInstance(token || "");

  // fetch api here and
  useEffect(() => {
    handleFetchStoryOfAUserByPromptId();
  }, [promptId]);

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
  const handleRedirectToCreateStory = () => {
    router.push(`/Contests/${contestId}/prompt/${promptId}/story/create`);
  };

  const handleRedirectToStory = () => {
    router.push(`/profile/contest?search=${promptId}`);
  };
  const handleRedirectToPromptWritings = () => {
    if (isActive) return;
    router.push(`/Contests/${contestId}/${promptId}`);
  };

  console.log(isActive && hasSubmittedStory !== null);

  return (
    <div
      className="flex justify-center px-4 md:px-0 w-5/6   bg-white border-2 border-gray-300 rounded-3xl "
      onClick={handleRedirectToPromptWritings}
    >
      <div className="w-full  h-auto md:h-40 flex relative overflow-hidden mb-4">
        <div className="px-4 py-4 md:px-6 md:py-4 w-full md:w-5/6">
          <div className="font-bold  font-comic text-wrap text-base md:text-xl mb-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
            {promptText}
          </div>
          <p className="text-gray-700 font-bold text-wrap font-comic pt-4 md:pt-8 text-sm md:text-base">
            Category: {promptCategory.join(",")}
          </p>
        </div>

        {isActive && hasSubmittedStory !== null ? (
          !hasSubmittedStory ? (
            <div
              onClick={handleRedirectToCreateStory}
              className="absolute right-4 top-5 md:right-10 md:top-10 flex cursor-pointer justify-end"
            >
              <Image
                src={Pencil}
                alt="Pencil"
                width={24}
                height={24}
                className="md:w-auto md:h-auto"
              />
            </div>
          ) : (
            <div
              className="absolute right-4 top-5 md:right-10 md:top-10 flex cursor-pointer justify-end"
              onClick={handleRedirectToStory}
            >
              <button className="border text-2xl mx-auto font-comic hover:bg-slate-800 border-slate-400 bg-black rounded-3xl text-white w-60 h-14">
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
