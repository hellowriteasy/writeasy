"use client";

import React, { useEffect, useState } from "react";
import TopWriting from "./../../../components/Others/TopWriting";
import WeeklyTest from "../../../components/Others/WeeklyTest";
import Categories from "@/app/components/Categories";
import Bee from "@/public/Game/cloud3.svg";
import Image from "next/image";
import Prompt from "@/app/components/Others/Prompt";
import { SimpleEditor } from "@/app/components/WriteStory";
import Pagination from "@/app/components/Pagination";

interface CreateContestProps {
  contestId: string;
  promptId: string;
}

const CreateContest = ({ contestId, promptId }: CreateContestProps) => {
  const [promptTitle, setPromptTitle] = useState<string>("");

  useEffect(() => {
    const fetchPrompt = async () => {
      if (!promptId) return;

      try {
        const response = await fetch(
          `${process.env.SERVER_URL}/prompts/${promptId}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setPromptTitle(data.promptText);
      } catch (err: any) {
        console.error(err.message);
      }
    };

    fetchPrompt();
  }, [promptId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Implement submission logic here
  };

  return (
    <div className="w-full h-[1900px] mt-6 z-0 relative flex justify-center">
      <div className="w-10/12 h-screen ms-12">
        <div className="w-full h-32 relative pt-4">
          <h1 className="text-5xl pt-4 ps-16 font-bold font-comic">
            {promptTitle}
          </h1>
        </div>
        <div className="flex w-[100%] relative mt-0">
          <div className="absolute -top-40 mt-3 -left-48">
            <Image src={Bee} alt="bee" />
          </div>
          <div className="gap-8 border-game relative w-4/5 flex flex-col">
            <form action="" onSubmit={handleSubmit} className="height-[800px]">
              <div className="flex flex-col w-full items-center gap-8 h-96">
                <div className="flex gap-5">
                  <input
                    className="border border-gray-500 z-10 text-xl rounded-3xl indent-7 w-[38vw] h-12 focus:outline-none focus:border-yellow-600"
                    placeholder="Email or Username comma separated"
                  />
                  <button
                    type="submit"
                    className="text-white hover:opacity-80 bg-black border text-2xl font-bold font-comic rounded-full w-40 h-12"
                  >
                    Invite
                  </button>
                </div>
                <div>
                  <input
                    className="border border-gray-500 z-10 text-xl rounded-3xl indent-7 w-[50vw] h-12 focus:outline-none focus:border-yellow-600"
                    placeholder="Untitled Story"
                  />
                </div>
                <div>
                  <Categories />
                </div>
                <div className="h-[800px] rounded-full">
                  <SimpleEditor />
                </div>
                <div className="flex gap-10 h-28">
                  <button className="text-white bg-black border text-2xl font-bold font-comic rounded-full w-[20vw] h-14">
                    Save to Profile
                  </button>
                  <button className="text-white bg-black border text-2xl font-bold font-comic rounded-full w-[20vw] h-14">
                    Submit to Story
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap w-96 gap-4 font-comic">
              <div>
                <button className="w-40 h-14 bg-black text-white hover:opacity-80 font-bold text-2xl rounded-full">
                  Grammar
                </button>
              </div>
              <div>
                <button className="w-40 h-14 bg-black text-white hover:opacity-80 font-bold text-2xl rounded-full">
                  Rewrite
                </button>
              </div>
              <div>
                <button className="w-40 h-14 bg-black text-white hover:opacity-80 font-bold text-2xl rounded-full">
                  Improve
                </button>
              </div>
              <div>
                <button className="w-40 h-14 bg-black text-white hover:opacity-80 font-bold text-2xl rounded-full">
                  PDF
                </button>
              </div>
            </div>
            <WeeklyTest />
            <TopWriting />
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-10 ms-10 w-[60vw]">
          <Prompt />
          <Prompt />
          <Prompt />
        </div>
        <div className="w-full ms-28 mt-10">
          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default CreateContest;
