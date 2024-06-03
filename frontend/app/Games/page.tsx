"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Prompt from "../components/Others/Prompt";
import TopWriting from "../components/Others/TopWriting";
import WeeklyTest from "../components/Others/WeeklyTest";
import halfmoon from "@/public/Game/half_moon.svg";
import group from "@/public/Game/Group.svg";
import Bee from "@/public/Game/Bee.svg";
import Cloud from "@/public/Game/cloud.svg";
import ReactPaginate from "react-paginate";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

interface PromptData {
  promptText: string;
  category: string;
  contestId: string;
  promptId: string;
}

interface ApiResponse {
  creatorUser: string;
  title: string;
  content: {
    author: string;
    text: string;
    timestamp: string;
    approved: boolean;
  }[];
  contributors: string[];
  creationDateTime: string;
}

const Games: React.FC = () => {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);
  const [prompts, setPrompts] = useState<PromptData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await axios.get<ApiResponse[]>("http://localhost:5000/api/collaborative-stories");
        const formattedPrompts: PromptData[] = response.data.map((story) => ({
          promptText: story.title,
          category: "Collaborative Story",
          contestId: story.creatorUser, // Assuming contestId is based on creatorUser
          promptId: story.creatorUser,  // Assuming promptId is based on creatorUser
        }));
        setPrompts(formattedPrompts);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchPrompts();
  }, []); 

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentPrompts = prompts.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(prompts.length / itemsPerPage);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="w-full h-[1300px] mt-6 z-0 relative flex justify-center">
      <div className="absolute -top-14 right-0">
        <Image className="w-[5vw]" src={halfmoon} alt="halfmoon" />
      </div>
      <div className="w-10/12 h-screen ms-12">
        <div className="w-full h-60 relative pt-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-comic">
            Embark on a Collaborative Adventure
          </h1>
          <div className="absolute top-2 -right-14">
            <Image className="w-[14vw] md-hide" src={group} alt="group" />
          </div>
          <p className="text-lg md:text-xl lg:text-2xl font-comic pt-4">
            Team up with friends to create captivating stories together.
          </p>
        </div>

        <div className="flex w-full h-auto relative mt-0  justify-around">
          <div className="absolute -top-40 mt-3 -left-32">
            <Image className="w-[12vw]" src={Bee} alt="bee" />
          </div>
          <div className="gap-8 w-full  relative flex flex-col">
            {currentPrompts.map((prompt) => (
              <Prompt key={prompt.promptId} prompt={prompt} />
            ))}
            <div className="absolute bottom-1/3 -left-32">
              <Image src={Cloud} alt="Cloud" />
            </div>
          </div>
          <div className="flex  flex-col gap-8">
            <WeeklyTest />
            <TopWriting />
          </div>
        </div>
        <div className="w-full mt-10 text-lg md:text-xl font-comic">
          <ReactPaginate
            previousLabel={<FaAngleLeft className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />}
            nextLabel={<FaAngleRight className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />}
            breakLabel="..."
            breakClassName="break-me"
            pageCount={pageCount}
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
      </div>
    </div>
  );
};

export default Games;
