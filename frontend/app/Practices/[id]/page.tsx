"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import cloud2 from "@/public/Game/cloud2.svg";
import shootingstar from "@/public/Game/shotting_star.svg";
import Storytitle from "@/app/components/Others/Storytitle";
import { TPrompt, TStory } from "@/app/utils/types";
import ReactPaginate from "react-paginate";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/app/utils/config/axios";
import NotFound from "@/app/components/Others/NotFound";
import useAuthStore from "@/app/store/useAuthStore";

interface PageProps {
  params: {
    id: string;
  };
}

const Page: React.FC<PageProps> = ({ params }) => {
  const [stories, setStories] = useState<TStory[]>([]);
  const [hasStoriesFetched, setHasStoriesFetched] = useState(false);
  const [prompt, setPrompt] = useState<TPrompt | null>(null);
  const [userGameStory, setUserGameStory] = useState<TStory | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageDetails, setPageDetails] = useState({
    perPage: 10,
    page: 1,
    total: 0,
  });
  const { userId } = useAuthStore();
  const router = useRouter();
  const AxiosIns = axiosInstance("");

  const fetchStories = async () => {
    try {
      const response = await AxiosIns.get(
        `/stories/contest/prompt?prompt_id=${params.id}&public=true`,
        {
          params: {
            page: currentPage,
            perPage: 5,
          },
        }
      );
      const fetchedStories: TStory[] = response.data?.data;
      setStories(fetchedStories);
      setPageDetails(response.data?.pageData);
      setHasStoriesFetched(true);
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };
  const getPromptById = async () => {
    if (!params.id) return;
    try {
      AxiosIns.get(`prompts/${params.id}`)
        .then((response) => {
          setPrompt(response.data);
        })
        .catch((error) => {
          console.error("Error fetching prompt:", error);
        });
    } catch (error) {
      //
    }
  };

  const fetchStoryOfUserByPromptId = async () => {
    try {
      const { data } = await AxiosIns.get(
        `/stories/user/${params.id}/${userId}`
      );
      if (data) {
        setUserGameStory(data);
      }
    } catch (error) {
      //
    }
  };
  useEffect(() => {
    if (!params.id) return;
    getPromptById();
    fetchStoryOfUserByPromptId();
  }, [params.id]);
  useEffect(() => {
    if (!params.id) return;
    fetchStories();
  }, [params.id, currentPage]);
  // useEffect(() => {
  //   const filtered = stories.filter(
  //     (story) => story.storyType === "game" && story.prompt._id === params._id
  //   );
  //   setFilteredStories(filtered);
  // }, [stories, params._id]);

  const handleReadMore = (story: TStory) => {
    // setIsCreating(false);
  };

  const handleCreateStory = () => {
    router.push(`/Practices/${params.id}/playground`);
  };

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1);
  };

  // const offset = currentPage * itemsPerPage;
  // const currentStories = filteredStories.slice(offset, offset + itemsPerPage);
  // const pageCount = Math.ceil(filteredStories.length / itemsPerPage);

  // if (selectedStory || isCreating) {
  //   return <StoryEditor id={params._id} />;
  // }

  return (
    <div className="w-screen font-unkempt h-auto flex flex-col">
      <div className="h-auto  relative w-full flex items-center flex-col">
        <div className="absolute left-0">
          <Image className="w-[9vw]" src={shootingstar} alt="shootingstar" />
        </div>
        <div className="w-4/5  font-unkempt flex flex-col gap-10 sm:gap-5 sm:my-10 mt-20 mb-10">
          <h1 className="text-3xl  md:text-4xl lg:text-5xl xl:text-6xl sm:text-xl font-bold font-unkempt">
            {prompt?.title}
          </h1>
          {/* <p className="sm:text-sm text-xl  font-medium">
            {prompt?.description}
          </p> */}
          <button
            onClick={handleCreateStory}
            className=" sm:px-2 w-60  sm:text-md  sm:w-40 sm:h-12  bg-black hover:opacity-80 text-center text-white rounded-full border h-16  md:text-2xl  lg:text-md xl:text-2xl"
          >
            Create your story
          </button>
        </div>
        <div className="absolute right-5 sm-hide top-60">
          <Image className="w-[12vw]" src={cloud2} alt="cloud2" />
        </div>
      </div>
      <div className="w-screen flex sm:mt-[2vw]  flex-col items-center min-h-[300px]">
        {hasStoriesFetched && stories.length === 0 ? (
          <NotFound text="No stories to show!!" />
        ) : (
          <div className="w-4/5 ">
            <h1 className="font-bold text-2xl sm:text-xl md:text-3xl lg:text-3xl xl:text-3xl pt-5 font-unkempt">
              {pageDetails.total} Stories
            </h1>

            <div className="mt-4 flex flex-col gap-8">
              {stories.map((story: TStory, index) => (
                <Storytitle
                  key={index}
                  story={story}
                  onReadMore={() => handleReadMore(story)}
                />
              ))}
            </div>
            {pageDetails.total > 5 && (
              <div className="w-full mt-10 text-lg md:text-xl font-unkempt">
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
        )}
      </div>
    </div>
  );
};

export default Page;
