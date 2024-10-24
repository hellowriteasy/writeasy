"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import PromptComponent from "../../components/contest/ContestPrompt";
import TopWriting from "../../components/Others/TopWriting";
import WeeklyTest from "../../components/Others/WeeklyTest";
import Cloud from "@/public/Game/cloud.svg";
import Cloud2 from "@/public/Game/cloud3.svg";
import { TContest, TPrompt } from "@/app/utils/types";
import moment from "moment";
import PromptNotPublished from "@/app/components/Others/PromptNotPublished";
import { axiosInstance } from "@/app/utils/config/axios";
import ReactPaginate from "react-paginate";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import LoadingAnimation from "../loading";

interface ContestPageProps {
  params: {
    _id: string;
  };
}

const Page: React.FC<ContestPageProps> = ({ params }) => {
  const { _id: contestId } = params;
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [contest, setContest] = useState<TContest | null>(null);
  const [promptList, setPromptList] = useState<TPrompt[]>([]);
  
  const [error, setError] = useState<string | null>(null);
  const [hasPromptPublished, setHasPromptPublished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [pageDetails, setPageDetails] = useState({
    page: 1,
    perPage: 10,
    total: 0,
  });
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

    const fetchPromptsOfContest = async (page = 1, perPage = itemsPerPage) => {
      try {
        const response = await AxiosIns.get(`/prompts/list/${contestId}`,{
          params: {
            page
          },}
        );
        if (response.status !== 200) {
          throw new Error(`Error: ${response.status}`);
        }

        setPromptList(response.data?.data);
       
        setPageDetails(response.data?.pageData);
      } catch (err: any) {
        setError(err.message);
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
        const response = await AxiosIns.get(`/contests/${contestId}`);
        if (response.status !== 200) {
          throw new Error(`Error: ${response.status}`);
        }

        const data: TContest = response.data;
        setContest(data);
      } catch (err: any) {
        setError(err.message);
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
  const handleSelectOption = (selectedOption: string) => {
    setSelectedOption(selectedOption);
    setCurrentPage(1); // Reset to the first page whenever a new option is selected
  };

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1);
  };

  const offset = currentPage * itemsPerPage;
  if (!contest) return <LoadingAnimation></LoadingAnimation>;

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] h-auto z-0 relative flex justify-center">
      <div className="w-10/12  h-auto">
        <div className="flex mt-8  sm:items-center sm:mt-0  ">
          <div className="py-2 mb-6 flex flex-col gap-y-2">
            <div className="flex gap-y-1 flex-col">
              <h2 className="text-4xl font-unkempt sm:text-xl font-bold">
                {contest.contestTheme}
              </h2>
              <p className="text-xl py-4 sm:text-sm ">{contest.description}</p>
              <div className="flex w-full">
                <p className="text-xl sm:text-sm text-center font-unkempt">
                  <b className="font-medium">Submission deadline</b> -
                  {moment(contest.submissionDeadline).format("llll")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col-reverse gap-y-10 w-full h-auto relative mt-0 justify-around gap-x-5 sm:gap-x-0">
          <div className="absolute sm-hide top-0 -left-40">
            <Image src={Cloud2} alt="cloud" />
          </div>
          <div className="w-[60%] sm:w-full">
            {hasPromptPublished ? (
              promptList.length > 0 ? (
                promptList.map((prompt) => (
                  <PromptComponent
                    key={prompt._id}
                    promptText={prompt.title}
                    contestId={contest._id}
                    promptId={prompt._id}
                    onSelectPrompt={handleSelectPrompt}
                    isActive={contest.isActive}
                  />
                ))
              ) : null
            ) : (
              <PromptNotPublished
                publishDate={moment(contest.promptPublishDate).format("llll")}
              />
            )}

            <div className="absolute md-hide bottom-80 -left-32">
              <Image src={Cloud} alt="Cloud" />
            </div>
            {pageDetails && pageDetails.total > 5 && (
              <div className="w-full ms-28">
                <ReactPaginate
                  previousLabel={
                    <FaAngleLeft className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                  }
                  nextLabel={
                    <FaAngleRight className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                  }
                  breakLabel="..."
                  breakClassName="break-me"
                  pageCount={Math.ceil(pageDetails.total / pageDetails.perPage)}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageClick}
                  containerClassName="flex justify-center gap-2 md:gap-4 lg:gap-6 rounded-full mt-8"
                  pageClassName=""
                  pageLinkClassName="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 flex items-center justify-center border border-gray-300 rounded-full"
                  previousClassName=""
                  previousLinkClassName="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 flex items-center justify-center border border-gray-300 rounded-full"
                  nextClassName=""
                  nextLinkClassName="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 flex items-center justify-center border border-gray-300 rounded-full"
                  activeClassName="bg-black text-white rounded-full"
                />
              </div>
            )}
          </div>
          <div className="flex w-[40%] sm:w-full flex-col gap-8">
            <WeeklyTest />
            <TopWriting />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
