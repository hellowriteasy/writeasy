"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Prompt from "../components/Others/Prompt";
import TopWriting from "../components/Others/TopWriting";
import WeeklyTest from "../components/Others/WeeklyTest";
import halfmoon from "@/public/Game/half_moon.svg";
import group from "@/public/Game/Group.svg";
import Bee from "@/public/Game/Bee.svg";
import Cloud from "@/public/Game/cloud.svg";
import ReactPaginate from "react-paginate";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { TPrompt } from "../utils/types";
import { axiosInstance } from "../utils/config/axios";
import NotFound from "../components/Others/NotFound";

const Games: React.FC = () => {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [prompts, setPrompts] = useState<TPrompt[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [pageDetails, setPageDetails] = useState({
    page: 1,
    perPage: 10,
    total: 0,
  });
  const AxiosIns = axiosInstance("");
  useEffect(() => {
    const fetchPrompts = async (page = 1, perPage = itemsPerPage) => {
      try {
        const response = await AxiosIns.get("/prompts/game-prompts", {
          params: {
            page: currentPage,
          },
        });
        setPrompts(response.data?.data.reverse());
        setPageDetails(response.data.pageData);
      } catch (error: any) {
        setError(error.message);
      }
    };
    fetchPrompts();
  }, [currentPage]);

  const handleSelectOption = (selectedOption: string) => {
    console.log(selectedOption);
    setSelectedOption(selectedOption);
    setCurrentPage(1); // Reset to the first page whenever a new option is selected
  };

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1);
  };

  const offset = currentPage * itemsPerPage;

  if (error) return <p>Error: {error}</p>;
  function handlePromptClick() {}

  console.log("user", prompts);

  return (
    <div className="w-full min-h-screen mt-6 z-0 relative flex justify-center">
      <div className="absolute -top-14 right-0">
        <Image className="w-[5vw]" src={halfmoon} alt="halfmoon" />
      </div>
      <div className="w-10/12 min-h-screen ms-12">
        <div className="w-full h-60 sm:h-40 relative pt-4">
          <h1 className="text-3xl sm:text-xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-comic">
            Embark on a Collaborative Adventure
          </h1>
          <div className="absolute top-2 -right-14">
            <Image className="w-[14vw] md-hide" src={group} alt="group" />
          </div>
          <p className="text-lg sm:text-sm md:text-xl lg:text-2xl font-comic pt-4">
            Team up with friends to create captivating stories together.
          </p>
        </div>

        <div className="flex w-full h-auto relative mt-0  justify-around">
          <div className="absolute -top-40 mt-3 -left-32">
            <Image className="w-[12vw]" src={Bee} alt="bee" />
          </div>
          <div className="gap-8 w-full relative flex flex-col ">
            {prompts.length > 0 ? (
              prompts.map((prompt) => (
                <Prompt key={prompt._id} prompt={prompt} />
              ))
            ) : (
              <NotFound text="No games right now !!" />
            )}

            <div className="absolute bottom-1/3 -left-32">
              <Image src={Cloud} alt="Cloud" />
            </div>
            {pageDetails && pageDetails.total > 5 && (
              <div className="w-full  ">
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

          <div className="flex vvsm-hide flex-col gap-8">
            <WeeklyTest />
            <TopWriting />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;
