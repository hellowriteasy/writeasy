"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import cloud2 from "@/public/Game/cloud2.svg";
import shootingstar from "@/public/Game/shotting_star.svg";
import Storytitle from "@/app/components/Others/Storytitle";
import { TStory } from "@/app/utils/types";
import ReactPaginate from "react-paginate";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/app/utils/config/axios";
import NotFound from "@/app/components/Others/NotFound";
interface PageProps {
  params: {
    _id: string;
  };
}

const itemsPerPage = 5; // Adjust this value to the number of items per page you want

const Page: React.FC<PageProps> = ({ params }) => {
  const [stories, setStories] = useState<TStory[]>([]);
  const [filteredStories, setFilteredStories] = useState<TStory[]>([]);
  const [selectedStory, setSelectedStory] = useState<TStory | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // State to track the current page
  const [pageDetails, setPageDetails] = useState({
    perPage: 10,
    page: 1,
    total: 0,
  });
  const router = useRouter();
  const AxiosIns = axiosInstance("");
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await AxiosIns.get(
          `/stories/contest/prompt?prompt_id=${params._id}`
        );
        const fetchedStories: TStory[] = response.data;
        setStories(fetchedStories);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchStories();
  }, [params._id]);

  // useEffect(() => {
  //   const filtered = stories.filter(
  //     (story) => story.storyType === "game" && story.prompt._id === params._id
  //   );
  //   setFilteredStories(filtered);
  // }, [stories, params._id]);

  const handleReadMore = (story: TStory) => {
    setSelectedStory(story);
    setIsCreating(false);
  };

  const handleCreateStory = () => {
    router.push(`/Games/${params._id}/play`);
    setSelectedStory(null);
    setIsCreating(true);
  };

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  // const offset = currentPage * itemsPerPage;
  // const currentStories = filteredStories.slice(offset, offset + itemsPerPage);
  // const pageCount = Math.ceil(filteredStories.length / itemsPerPage);

  // if (selectedStory || isCreating) {
  //   return <StoryEditor id={params._id} />;
  // }

  return (
    <div className="w-screen font-comic h-auto flex flex-col">
      <div className="h-80  relative w-full flex items-center flex-col">
        <div className="absolute left-0">
          <Image className="w-[9vw]" src={shootingstar} alt="shootingstar" />
        </div>
        <div className="w-4/5 font-comic flex flex-col gap-10 mt-20">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-comic">
            Setting text of this story
          </h1>
          <button
            onClick={handleCreateStory}
            className="w-full bg-black hover:opacity-80 text-center text-white rounded-3xl border h-20 text-xl md:text-2xl lg:text-3xl xl:text-4xl"
          >
            Create your Story
          </button>
        </div>
        <div className="absolute right-5 sm-hide top-60">
          <Image className="w-[12vw]" src={cloud2} alt="cloud2" />
        </div>
      </div>
      <div className="w-screen flex flex-col items-center">
        {stories.length > 0 ? (
          <div className="w-4/5">
            <h1 className="font-bold text-7xl pt-5 font-comic">Stories</h1>
            <div className="mt-4 flex flex-col gap-8">
              {stories.map((story: TStory, index) => (
                <Storytitle
                  key={index}
                  story={story}
                  onReadMore={() => handleReadMore(story)}
                />
              ))}
            </div>
            <div className="w-full mt-10 text-lg md:text-xl font-comic">
              <ReactPaginate
                previousLabel={
                  <FaAngleLeft className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                }
                nextLabel={
                  <FaAngleRight className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                }
                breakLabel="..."
                breakClassName="break-me"
                pageCount={pageDetails.page}
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
        ) : (
          <NotFound text="No stories to show!!" />
        )}
      </div>
    </div>
  );
};

export default Page;
