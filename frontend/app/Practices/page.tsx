"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Prompt from "../components/Practice/PracticePrompt";
import TopWriting from "../components/Others/TopWriting";
import SelectMenu from "@/app/components/Others/SelectMenu"; // Ensure correct import path
import ReactPaginate from "react-paginate";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import moon from "@/public/Game/moon.svg";
import book from "@/public/Game/book.svg";
import pencilman from "@/public/Game/pensilman.svg";
import Bee from "@/public/Game/Bee.svg";
import LoadingAnimation from "../loading";
import { TPrompt } from "../utils/types";
import NotFound from "../components/Others/NotFound";
import { axiosInstance } from "../utils/config/axios";
import WeeklyTest from "../components/Others/WeeklyTest";
const Page: React.FC = () => {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [promptData, setPromptData] = useState<TPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [pageDetails, setPageDetails] = useState({
    page: 1,
    perPage: 10,
    total: 0,
  });
  const AxiosIns = axiosInstance("");

  const fetchPrompts = async (page = 1, perPage = itemsPerPage) => {
    setIsLoading(true);
    try {
      const response = await AxiosIns.get(`/prompts/practice-prompts`, {
        params: {
          page,
          category: selectedOption,
        },
      });
      setPromptData(response.data.data);
      setPageDetails(response.data.pageData);
      setIsLoading(false);
    } catch (error) {
      console.error("There was an error fetching the data!", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts(currentPage, itemsPerPage);
  }, [currentPage, selectedOption]);

  const handleSelectOption = (selectedOption: string) => {
    console.log(selectedOption);
    setSelectedOption(selectedOption);
    setCurrentPage(1); // Reset to the first page whenever a new option is selected
  };

  const filteredPrompts = selectedOption
    ? promptData.filter((prompt) =>
        prompt.promptCategory.includes(selectedOption)
      )
    : promptData;

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1);
  };

  const offset = currentPage * itemsPerPage;
  console.log("page data", pageDetails);
  return (
    <div className="w-full min-h-screen mt-6 z-0 relative flex justify-center">
      <div className="absolute -top-10 right-0">
        <Image className="w-[10vw]" src={moon} alt="moon" />
      </div>
      <div className="w-10/12 min-h-screen ">
        <div className="w-full h-[30vh] sm:h-40 relative pt-4">
          <h1 className="text-3xl md:text-4xl sm:text-sm lg:text-5xl xl:text-6xl font-bold font-comic">
            Practice Your Craft
          </h1>
          <div className="absolute top-10 right-48">
            <Image className="w-[6vw] sm-hide" src={book} alt="group" />
          </div>
          <div className="absolute -top-6 right-96">
            <Image className="w-[10vw] md-hide" src={pencilman} alt="group" />
          </div>
          <p className="text-lg md:text-xl sm:text-sm lg:text-2xl font-comic pt-4">
            Refine your skills with our AI-powered editor.
          </p>
        </div>

        <div className="flex w-full gap-x-5 h-auto relative  justify-around items-center sm:justify-start ">
          <div className="absolute -top-28 -left-32">
            <Image className="w-[10vw]" src={Bee} alt="bee" />
          </div>
          <div className="gap-8 practice-mobile-view relative w-1/2 flex flex-col">
            <div className="w-full flex justify-between gap-7 items-center h-20">
              <h1 className="text-2xl sm:text-sm   md:text-4xl lg:text-5xl xl:text-7xl font-comic font-bold">
                All Prompts
              </h1>
              <SelectMenu
                selectedOption={selectedOption}
                onSelectOption={handleSelectOption}
              />
            </div>
            {isLoading ? (
              <LoadingAnimation />
            ) : promptData.length > 0 ? (
              promptData.map((prompt) => (
                <Prompt key={prompt._id} prompt={prompt} />
              ))
            ) : (
              <NotFound text={`No practise prompt available... `} />
            )}

            {pageDetails && pageDetails.total > 5 && (
              <div className="w-full ">
                <ReactPaginate
                  previousLabel={
                    <FaAngleLeft className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                  }
                  nextLabel={
                    <FaAngleRight className="w-6 h-6 font-comic text-xl md:w-8 md:h-8 lg:w-10 lg:h-10" />
                  }
                  breakLabel="..."
                  breakClassName="break-me"
                  pageCount={Math.ceil(pageDetails.total / pageDetails.perPage)}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageClick}
                  containerClassName="flex justify-center  gap-2 md:gap-4 lg:gap-6 rounded-full mt-8"
                  pageClassName=""
                  pageLinkClassName="w-8 h-8 md:w-12 md:h-12  lg:w-16 lg:h-16 flex items-center justify-center border border-gray-300 rounded-full"
                  previousClassName=""
                  previousLinkClassName="w-8 h-8 md:w-12 md:h-12  lg:w-16 lg:h-16 flex items-center justify-center border border-gray-300 rounded-full"
                  nextClassName=""
                  nextLinkClassName="w-8 h-8 md:w-12 md:h-12  text-black text-xl font-comic lg:w-16 lg:h-16 flex items-center justify-center border border-gray-300 rounded-full"
                  activeClassName="bg-black text-white rounded-full"
                />
              </div>
            )}
          </div>
          <div className="vvsm-hide flex flex-col gap-y-4">
            <WeeklyTest></WeeklyTest>
            <TopWriting />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
