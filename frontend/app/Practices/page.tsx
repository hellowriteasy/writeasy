"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Prompt from "../components/Practice/PracticePrompt";
import TopWriting from "../components/Others/TopWriting";
import SelectMenu from "@/app/components/Others/SelectMenu";
import ReactPaginate from "react-paginate";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import moon from "@/public/Game/moon.svg";
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
    setSelectedOption(selectedOption);
    setCurrentPage(1); // Reset to the first page whenever a new option is selected
  };

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1);
  };

  return (
    <div className="w-full min-h-screen flex justify-center mt-6 relative">
      <div className="absolute -top-10 right-0">
        <Image className="w-[10vw]" src={moon} alt="moon" />
      </div>
      <div className="w-10/12 min-h-screen">
        <div className="absolute top-24 left-2">
          <Image className="w-[10vw]" src={Bee} alt="bee" />
        </div>
        <div className="flex w-full gap-x-5 min-h-screen justify-around sm:justify-start relative">
          <div className="flex flex-col gap-8 w-full mid-w-full">
            <div className="flex justify-between items-center h-20 gap-7">
              <h1 className="text-2xl sm:text-xl md:text-4xl lg:text-5xl xl:text-7xl font-comic font-bold">
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
              <NotFound text="No practice prompt available..." />
            )}

            {pageDetails.total > itemsPerPage && (
              <div className="w-full">
                <ReactPaginate
                  previousLabel={
                    <FaAngleLeft className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                  }
                  nextLabel={
                    <FaAngleRight className="w-6 h-6 font-comic text-xl md:w-8 md:h-8 lg:w-10 lg:h-10" />
                  }
                  breakLabel="..."
                  pageCount={Math.ceil(pageDetails.total / pageDetails.perPage)}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageClick}
                  containerClassName="flex justify-center gap-2 md:gap-4 lg:gap-6 rounded-full mt-8"
                  pageLinkClassName="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 flex items-center justify-center border border-gray-300 rounded-full"
                  previousLinkClassName="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 flex items-center justify-center border border-gray-300 rounded-full"
                  nextLinkClassName="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 text-black text-xl font-comic flex items-center justify-center border border-gray-300 rounded-full"
                  activeClassName="bg-black text-white rounded-full"
                />
              </div>
            )}
          </div>
          <div className="vvsm-hide flex mt-3 flex-col gap-y-4">
            <WeeklyTest />
            <TopWriting />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
