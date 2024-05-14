"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for the router
import Navbar from "../../components/Navbar";
import PromptComponent from "../../components/contest/Prompt";
import TopWriting from "../../components/Others/TopWriting";
import WeeklyTest from "../../components/Others/WeeklyTest";
import Cloud from "@/public/Game/cloud.svg";
import Cloud2 from "@/public/Game/cloud3.svg";
import Image from "next/image";
import Pagination from "@/app/components/Pagination";
import CreateContest from "./createcontest/page"; // Import the CreateContest component

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
}

const Page = () => {
  const router = useRouter();
  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<{
    contestId: string;
    promptId: string;
  } | null>(null);

  useEffect(() => {
    const fetchOngoingContest = async () => {
      try {
        const response = await fetch(
          `${process.env.SERVER_URL}/contests/ongoing`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data: Contest[] = await response.json();
        if (data.length === 0) {
          throw new Error("No ongoing contest found.");
        }
        setContest(data[0]); // Assuming the first contest is the one we want
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOngoingContest();
  }, []);

  const handleSelectPrompt = (contestId: string, promptId: string) => {
    setSelectedPrompt({ contestId, promptId });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!contest) return <p>No contest available at the moment.</p>;

  return (
    <div className="w-full h-[1300px] mt-6 z-0 relative flex justify-center">
      <div className="w-10/12 h-screen ms-12">
        {selectedPrompt ? (
          <CreateContest
            contestId={selectedPrompt.contestId}
            promptId={selectedPrompt.promptId}
          />
        ) : (
          <>
            <div className="w-full h-10 text-center text-2xl font-comic relative pt-4">
              until {new Date(contest.submissionDeadline).toLocaleString()} GMT
            </div>
            <div className="flex w-full h-auto relative mt-0 items-center justify-around">
              <div className="absolute top-0 -left-40">
                <Image src={Cloud2} alt="cloud" />
              </div>
              <div className="gap-8 relative flex flex-col">
                <div className="w-[53vw]">
                  <h1 className="text-6xl font-comic font-bold p-10">
                    #8: This title needs to be removed{contest.contestTitle}
                  </h1>
                  {/* <p className="text-xl">{contest.contestTheme}</p> */}
                </div>
                {/* Render Prompts Dynamically */}
                {contest.prompts.map((prompt) => (
                  <PromptComponent
                    key={prompt._id}
                    promptText={prompt.promptText}
                    promptCategory={prompt.promptCategory}
                    contestId={contest._id}
                    promptId={prompt._id}
                    onSelectPrompt={handleSelectPrompt}
                  />
                ))}
                <div className="absolute bottom-80 -left-32">
                  <Image src={Cloud} alt="Cloud" />
                </div>
              </div>
              <div className="flex -mt-28 flex-col gap-8">
                <WeeklyTest />
                <TopWriting />
              </div>
            </div>
            <div className="w-full ms-28 mt-10">
              <Pagination />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
