'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import PromptComponent from "../../components/contest/ContestPrompt";
import TopWriting from "../../components/Others/TopWriting";
import WeeklyTest from "../../components/Others/WeeklyTest";
import Cloud from "@/public/Game/cloud.svg";
import Cloud2 from "@/public/Game/cloud3.svg";
import Pagination from "@/app/components/Pagination";
import CreateContest from "./createcontest/page";
import ViewContest from "./viewcontest/page";

interface Prompt {
  _id: string;
  title: string;
  promptCategory: string;
}

interface Contest {
  _id: string;
  contestTitle: string;
  contestTheme: string;
  submissionDeadline: string;
  prompts: Prompt[];
  description: string;
  isActive: boolean;
}

interface ContestPageProps {
  params: {
    _id: string;
  };
}

const Page: React.FC<ContestPageProps> = ({ params }) => {
  const { _id: contestId } = params;

  const [contest, setContest] = useState<Contest | null>(null);
 
  const [error, setError] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<{
    contestId: string;
    promptId: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    if (!contestId) {
      setError("Contest ID is missing.");
   
      return;
    }

    const fetchContestById = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/contests/${contestId}`);
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

  const handleSelectPrompt = (contestId: string, promptId: string, title: string) => {
    setSelectedPrompt({ contestId, promptId, title });
  };

  
  if (error) return <p>{error}</p>;
  if (!contest) return <p>No contest available at the moment.</p>;

  return (
    <div className="w-full h-auto mt-6 z-0 relative flex justify-center">
      <div className="w-10/12 h-auto ms-12">
        {selectedPrompt ? (
          contest.isActive ? (
            <CreateContest
              contestId={selectedPrompt.contestId}
              promptId={selectedPrompt.promptId}
              Prompttitle={selectedPrompt.title}
            />
          ) : (
            <ViewContest
              contestId={selectedPrompt.contestId}
              promptId={selectedPrompt.promptId}
              Prompttitle={selectedPrompt.title}
            />
          )
        ) : (
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
            </div>
            <div className="flex w-full h-auto relative mt-0 justify-around">
              <div className="absolute top-0 -left-40">
                <Image src={Cloud2} alt="cloud" />
              </div>
              <div className="gap-8 relative flex flex-col">
                <div className="w-[53vw]">
                  <h1 className="text-6xl font-comic font-bold p-10">
                    {contest.contestTitle}
                  </h1>
                </div>
                {contest.prompts.map((prompt) => (
                  <PromptComponent
                    key={prompt._id}
                    promptText={prompt.title}
                    promptCategory={prompt.promptCategory}
                    contestId={contest._id}
                    promptId={prompt._id}
                    onSelectPrompt={handleSelectPrompt}
                    isActive={contest.isActive}
                  />
                ))}
                <div className="absolute bottom-80 -left-32">
                  <Image src={Cloud} alt="Cloud" />
                </div>
              </div>
              <div className="flex flex-col gap-8">
                <WeeklyTest />
                <TopWriting />
              </div>
            </div>
            <div className="w-full ms-28">
              <Pagination />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
