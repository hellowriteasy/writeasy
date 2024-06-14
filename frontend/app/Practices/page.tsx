"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
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

const Page: React.FC = () => {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);
  const [promptData, setPromptData] = useState<TPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string>("");

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:8000/api/prompts/practice-prompts")
      .then((response) => {
        setPromptData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
        setIsLoading(false);
      });
  }, []);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  const handleSelectOption = (selectedOption: string) => {
    console.log(selectedOption);
    setSelectedOption(selectedOption);
    setCurrentPage(0); // Reset to the first page whenever a new option is selected
  };

  const filteredPrompts = selectedOption
    ? promptData.filter((prompt) =>
        prompt.promptCategory.includes(selectedOption)
      )
    : promptData;

  const offset = currentPage * itemsPerPage;
  const currentPrompts = filteredPrompts.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredPrompts.length / itemsPerPage);

  return (
    <div className="w-full h-[1400px] mt-6 z-0 relative flex justify-center">
      <div className="absolute -top-10 right-0">
        <Image className="w-[10vw]" src={moon} alt="moon" />
      </div>
      <div className="w-10/12 h-screen ms-12">
        <div className="w-full h-80 relative pt-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-comic">
            Practice Your Craft
          </h1>
          <div className="absolute top-10 right-48">
            <Image className="w-[6vw] sm-hide" src={book} alt="group" />
          </div>
          <div className="absolute -top-6 right-96">
            <Image className="w-[10vw] md-hide" src={pencilman} alt="group" />
          </div>
          <p className="text-lg md:text-xl lg:text-2xl font-comic pt-4">
            Refine your skills with our AI-powered editor.
          </p>
        </div>

        <div className="flex w-full gap-x-5 h-auto relative -mt-10 justify-around sm:justify-start ">
          <div className="absolute -top-28 -left-32">
            <Image className="w-[10vw]" src={Bee} alt="bee" />
          </div>
          <div className="gap-8 practice-mobile-view relative flex flex-col">
            <div className="w-[50vw] flex justify-between items-center h-20">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl ps-2 sm:ps-4 md:ps-6 lg:ps-8 xl:ps-10 font-comic font-bold">
                All Prompts
              </h1>
              <SelectMenu
                selectedOption={selectedOption}
                onSelectOption={handleSelectOption}
              />
            </div>
            {isLoading ? (
              <LoadingAnimation />
            ) : currentPrompts.length > 0 ? (
              currentPrompts.map((prompt) => (
                <Prompt key={prompt._id} prompt={prompt} />
              ))
            ) : (
              <NotFound text={`Nothing to show for ${selectedOption} `} />
            )}
            <div className="w-full mt-10 text-lg md:text-xl font-comic ">
              <ReactPaginate
                previousLabel={
                  <FaAngleLeft className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                }
                nextLabel={
                  <FaAngleRight className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                }
                breakLabel="..."
                breakClassName="break-me"
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName="flex justify-center gap-2 md:gap-4 lg:gap-6 rounded-full mt-8"
                pageLinkClassName="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 flex items-center justify-center border border-gray-300 rounded-full"
                previousLinkClassName="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 flex items-center justify-center border border-gray-300 rounded-full"
                nextLinkClassName="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 flex items-center justify-center border border-gray-300 rounded-full"
                activeClassName="bg-black text-white rounded-full"
              />
            </div>
          </div>
          <div className="vvsm-hide">
            <TopWriting />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
