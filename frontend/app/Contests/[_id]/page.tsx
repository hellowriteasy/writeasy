"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import PromptComponent from "../../components/contest/ContestPrompt";
import TopWriting from "../../components/Others/TopWriting";
import WeeklyTest from "../../components/Others/WeeklyTest";
import Cloud from "@/public/Game/cloud.svg";
import Cloud2 from "@/public/Game/cloud3.svg";
import Pagination from "@/app/components/Pagination";
import { TContest, TPrompt } from "@/app/utils/types";
import moment from "moment";
import PromptNotPublished from "@/app/components/Others/PromptNotPublished";
import { axiosInstance } from "@/app/utils/config/axios";

interface ContestPageProps {
  params: {
    _id: string;
  };
}

const Page: React.FC<ContestPageProps> = ({ params }) => {
  const { _id: contestId } = params;

  const [contest, setContest] = useState<TContest | null>(null);
  const [promptList, setPromptList] = useState<TPrompt[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasPromptPublished, setHasPromptPublished] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<{
    contestId: string;
    promptId: string;
    title: string;
  } | null>(null);
  const AxiosIns = axiosInstance("");
  useEffect(() => {
    if (!contestId) {
      setError("Contest ID is missing.");
      return;
    }

    const fetchPromptsOfContest = async () => {
      try {
        const response = await AxiosIns.get(`/prompts/list/${contestId}`);
        if (response.status !== 200) {
          throw new Error(`Error: ${response.status}`);
        }
        setPromptList(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        //
      }
    };
    fetchPromptsOfContest();
  }, [contestId]);

  useEffect(() => {
    if (!contestId) {
      setError("Contest ID is missing.");

      return;
    }

    const fetchContestById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/contests/${contestId}`
        );
        if (response.status !== 200) {
          throw new Error(`Error: ${response.status}`);
        }
        const data: TContest = response.data;
        setContest(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
      }
    };

    fetchContestById();
  }, [contestId]);

  useEffect(() => {
    if (contest) {
      const currentTime = new Date().getTime();
      const promptPublishTime = new Date(contest.promptPublishDate).getTime();
      setHasPromptPublished(currentTime >= promptPublishTime);
    }
  }, [contest]);

  const handleSelectPrompt = (
    contestId: string,
    promptId: string,
    title: string
  ) => {
    setSelectedPrompt({ contestId, promptId, title });
  };

  if (error) return <p>{error}</p>;
  if (!contest) return <p>No contest available at the moment.</p>;

  return (
    <div className="w-full h-auto mt-6 z-0 relative flex justify-center">
      <div className="w-10/12 h-auto ms-12">
        <>
          <div className="flex mt-8 ">
            <div className="p-6 mb-6 flex flex-col gap-y-4 ">
              <div className="flex gap-x-7  items-center">
                <h2 className="text-4xl font-comic font-bold  ">
                  {contest.contestTheme}
                </h2>
                <div className="text-center text-2xl font-comic relative">
                  until {moment(contest.submissionDeadline).format("llll")}
                </div>
              </div>

              <p className="text-xl w-10/12 ">
                {contest.description ||
                  "Paragraphs are the building blocks of papers. Many students define paragraphs in terms of length: a paragraph is a group of at least five sentences, a paragraph is half a page long, etc. In reality, though, the unity and coherence of ideas among sentences is what constitutes a paragraph."}
              </p>
            </div>
          </div>
          <div className="flex w-full h-auto relative mt-0 justify-around gap-x-7">
            <div className="absolute top-0 -left-40">
              <Image src={Cloud2} alt="cloud" />
            </div>
            <div className="gap-8 relative flex flex-col ">
              {/* <h1 className="text-6xl font-comic font-bold p-10">
                    {contest.contestTheme}
                  </h1> */}
              {hasPromptPublished ? (
                promptList.length > 0 ? (
                  promptList.map((prompt) => (
                    <>
                      <PromptComponent
                        key={prompt._id}
                        promptText={prompt.title}
                        promptCategory={prompt.promptCategory}
                        contestId={contest._id}
                        promptId={prompt._id}
                        onSelectPrompt={handleSelectPrompt}
                        isActive={contest.isActive}
                      />
                    </>
                  ))
                ) : null
              ) : (
                <PromptNotPublished
                  publishDate={moment(contest.promptPublishDate).format("llll")}
                />
              )}
              <div className="w-full ms-28">
                <Pagination />
              </div>
              <div className="absolute bottom-80 -left-32">
                <Image src={Cloud} alt="Cloud" />
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <WeeklyTest />
              <TopWriting />
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default Page;
