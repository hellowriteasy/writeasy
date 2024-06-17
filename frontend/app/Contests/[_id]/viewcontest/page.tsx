"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import PromptComponent from "../../../components/contest/ContestPrompt";
import TopWriting from "../../../components/Others/TopWriting";
import WeeklyTest from "../../../components/Others/WeeklyTest";
import Cloud from "@/public/Game/cloud.svg";
import Cloud2 from "@/public/Game/cloud3.svg";
import Pagination from "@/app/components/Pagination";
import Storycard from "@/app/components/Storycard";
import { axiosInstance } from "@/app/utils/config/axios";

interface Prompt {
  _id: string;
  promptText: string;
  promptCategory: string;
}

interface Contest {
  _id: string;
  contestTitle: string;
  contestTheme: string;
  submissionDeadline: string;
  prompts: Prompt[];
  description: string;
  promptId: string;
}

interface ContestPageProps {
  contestId: string;
  promptId: string;
  prompt_title: string;
}

const ViewContest: React.FC<ContestPageProps> = ({ contestId, promptId, prompt_title }) => {
  const [contest, setContest] = useState<Contest | null>(null);
  const AxiosIns=axiosInstance("")
  const [error, setError] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<{
    contestId: string;
    promptId: string;
  } | null>(null);

  useEffect(() => {
    if (!contestId) {
      setError("Contest ID is missing.");
    
      return;
    }

    const fetchContestById = async () => {
      try {
        const response = await AxiosIns.get(`/stories/top`);
        if (response.status !== 200) {
          throw new Error(`Error: ${response.status}`);
        }
        const data: Contest = response.data;
        setContest(data);
      } catch (err: any) {
        setError(err.message);
      } finally {

      }
    };

    fetchContestById();
  }, [contestId]);


  // if (error) return <p>{error}</p>;
  if (!contest) return <p>No contest available at the moment.</p>;

  return (
    <div className="w-full h-auto mt-6 z-0 relative flex justify-center">
      <div className="w-10/12 h-auto ms-12">
        <>
          <div className="w-full text-center text-2xl font-comic relative pt-4">
            until {new Date(contest.submissionDeadline).toLocaleString()} GMT
          </div>
          <div className="flex justify-center mt-8">
            <div className="p-6 mb-6">
              <h2 className="text-4xl font-comic font-bold mb-4">
                {contest.contestTheme}
              </h2>
              <p className="text-xl w-10/12 ">
                {contest.description || "Paragraphs are the building blocks of papers. Many students define paragraphs in terms of length: a paragraph is a group of at least five sentences, a paragraph is half a page long, etc. In reality, though, the unity and coherence of ideas among sentences is what constitutes a paragraph."}
              </p>
            </div>
            <div>
              <WeeklyTest />
            </div>
          </div>
          <div className="flex w-full h-auto relative mt-0 justify-around">
            <div className="absolute top-0 -left-40">
              <Image src={Cloud2} alt="cloud" />
            </div>
            <div className="gap-8 relative flex flex-col">
              <div className="w-[53vw]">
                <h1 className="text-6xl font-comic font-bold p-10">
                  {prompt_title}
                </h1>
              </div>
              <Storycard />
              <div className="absolute bottom-80 -left-32">
                <Image src={Cloud} alt="Cloud" />
              </div>
            </div>
          </div>
          <div className="w-full ms-28">
            <Pagination />
          </div>
        </>
      </div>
    </div>
  );
};

export default ViewContest;
