"use client";
import React, { useState } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Prompt from "../components/Practice/PracticePrompt";
import TopWriting from "../components/Others/TopWriting";
import SelectMenu from "@/app/components/Others/TypesButton";
import ReactPaginate from "react-paginate";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import moon from "@/public/Game/moon.svg";
import book from "@/public/Game/book.svg";
import pencilman from "@/public/Game/pensilman.svg";
import Bee from "@/public/Game/Bee.svg";
import promptData from "@/app/json/prompt.json";

interface PromptData {
  promptText: string;
  category: string;
  contestId: string;
  promptId: string;
}

const Page: React.FC = () => {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentPrompts: PromptData[] = promptData.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(promptData.length / itemsPerPage);

  return (
    <div className="w-full h-[1400px] mt-6 z-0 relative flex justify-center">
      <div className="absolute -top-10 right-0">
        <Image src={moon} alt="moon" />
      </div>
      <div className="w-10/12 h-screen ms-12">
        <div className="w-full h-60 relative pt-4">
          <h1 className="text-6xl font-bold font-comic">Practice Your Craft</h1>
          <div className="absolute top-10 right-48">
            <Image src={book} alt="group" />
          </div>
          <div className="absolute -top-6 right-96">
            <Image src={pencilman} alt="group" />
          </div>
          <p className="text-2xl font-comic pt-4">
            Refine your skills with our AI-powered editor.
          </p>
        </div>
        <div className="flex w-full h-auto relative -mt-10 items-center justify-around">
          <div className="absolute -top-28 -left-32">
            <Image src={Bee} alt="bee" />
          </div>
          <div className="gap-8 relative flex flex-col">
            <div className="w-[50vw] flex justify-between items-center h-20">
              <h1 className="text-5xl ps-2 font-comic font-bold">All Prompts</h1>
              <SelectMenu />
            </div>
            {currentPrompts.map((prompt) => (
              <Prompt key={prompt.promptId} prompt={prompt} />
            ))}
          </div>
          <div className="flex  flex-col">
            <TopWriting />
          </div>
        </div>
        <div className="w-full mt-10 text-2xl font-comic">
          <ReactPaginate
            previousLabel={<FaAngleLeft className="w-10 h-10" />}
            nextLabel={<FaAngleRight className="w-10 h-10" />}
            breakLabel="..."
            breakClassName="break-me"
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName="flex justify-center gap-6 rounded-full mt-8 "
            pageClassName=""
            pageLinkClassName="w-16 h-16 flex items-center  justify-center border border-gray-300 rounded-full "
            previousClassName=""
            previousLinkClassName="w-16 h-16 flex items-center justify-center border border-gray-300 rounded-full "
            nextClassName=""
            nextLinkClassName="w-16 h-16 flex items-center justify-center border border-gray-300 rounded-full "
            activeClassName="bg-black text-white rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
