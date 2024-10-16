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
import { TPrompt } from "../utils/types";
import NotFound from "../components/Others/NotFound";
import { axiosInstance } from "../utils/config/axios";
import WeeklyTest from "../components/Others/WeeklyTest";
import SearchInput from "../components/SearchInput";

const Page: React.FC = () => {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [promptData, setPromptData] = useState<TPrompt[]>([]);
  const [hasPromptFetched, setHasPromptFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
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
          ...(searchInput ? { search: searchInput } : null),
        },
      });
      setPromptData(response.data.data);
      setPageDetails(response.data.pageData);
      setHasPromptFetched(true);
      setIsLoading(false);
    } catch (error) {
      console.error("There was an error fetching the data!", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts(currentPage, itemsPerPage);
  }, [currentPage, selectedOption,searchInput]);

  const handleSelectOption = (selectedOption: string) => {
    setSelectedOption(selectedOption);
    setCurrentPage(1); // Reset to the first page whenever a new option is selected
  };

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1);
  };
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  return (
    <div className="w-full min-h-screen flex justify-center mt-6 relative">
      <div className="absolute -top-10 right-0">
        <Image className="w-[10vw]" src={moon} alt="moon" />
      </div>
      <div className="w-10/12  min-h-screen ">
        <div className="absolute top-24 left-2">
          <Image className="w-[10vw]" src={Bee} alt="bee" />
        </div>
        <div className="flex sm:flex-col-reverse gap-y-10 w-full gap-x-5 min-h-screen justify-around sm:justify-start relative">
          <div className="flex flex-col w-[60%] sm:w-full gap-4 ">
            <div className="flex justify-between ">
              <h1 className="text-2xl sm:text-xl md:text-xl lg:text-xl xl:text-3xl font-unkempt font-extrabold">
                Choose a prompt and start your writing journey!
              </h1>
              <SelectMenu
                selectedOption={selectedOption}
                onSelectOption={handleSelectOption}
              />
            </div>
            <SearchInput
              placeholder="Search for practise prompt"
              onChange={handleSearchInputChange}
            />
            {isLoading ? (
              <></>
            ) : // <LoadingAnimation />
            hasPromptFetched && promptData.length === 0 ? (
              <NotFound text="No practice prompt available..." />
            ) : (
              promptData.map((prompt) => (
                <Prompt key={prompt._id} prompt={prompt} />
              ))
            )}

            {pageDetails.total > itemsPerPage && (
              <div className="w-full">
                <ReactPaginate
                  previousLabel={
                    <FaAngleLeft className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                  }
                  nextLabel={
                    <FaAngleRight className="w-6 h-6 font-unkempt text-xl md:w-8 md:h-8 lg:w-10 lg:h-10" />
                  }
                  breakLabel="..."
                  pageCount={Math.ceil(pageDetails.total / pageDetails.perPage)}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageClick}
                  containerClassName="flex justify-center gap-2 md:gap-4 lg:gap-6 rounded-full mt-8"
                  pageLinkClassName="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 flex items-center justify-center border border-gray-300 rounded-full"
                  previousLinkClassName="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 flex items-center justify-center border border-gray-300 rounded-full"
                  nextLinkClassName="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 text-black text-xl font-unkempt flex items-center justify-center border border-gray-300 rounded-full"
                  activeClassName="bg-black text-white rounded-full"
                />
              </div>
            )}
          </div>
          <div className=" flex sm:w-full w-[40%] flex-col gap-y-4">
            <WeeklyTest />
            <TopWriting />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
