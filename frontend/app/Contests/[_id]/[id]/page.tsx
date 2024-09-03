"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Cloud from "@/public/Game/cloud.svg";
import Cloud2 from "@/public/Game/cloud3.svg";
import TopWriting from "@/app/components/contest/TopWritings";
import { axiosInstance } from "@/app/utils/config/axios";
import NotFound from "@/app/components/Others/NotFound";
import { TContest, TPrompt, TStory } from "@/app/utils/types";
import ReactPaginate from "react-paginate";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useParams, useSearchParams } from "next/navigation";
import Storycard from "@/app/components/Storycard";
interface Prompt {
  _id: string;
  promptText: string;
  promptCategory: string;
}

interface Contest {
  _id: string;
  title: string;
  content: string;
  corrections: string;
}

interface ViewContestProps {
  params: {
    _id: string;
    id: string;
  };
}

const ViewContest: React.FC<ViewContestProps> = ({ params }) => {
  const { _id, id } = useParams();
  const searchParams = useSearchParams();
  const selectedStory = new URLSearchParams(searchParams).get("top-writing");
  const [stories, setStories] = useState<TStory[]>([]);
  const [prompt, setPrompt] = useState<TPrompt | null>(null);
  const AxiosIns = axiosInstance("");
  const [topStories, setTopStories] = useState<TStory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [contestDetails, setContestDetails] = useState<TContest | null>(null);
  const topStoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const [pageDetails, setPageDetails] = useState({
    page: 1,
    perPage: 10,
    total: 0,
  });
  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const response = await AxiosIns.get(
          `/stories/contest/top-writings/${_id}?exclude_pagination=true`
        );
        setTopStories(response.data?.data);
        // setPageDetails(response.data?.pageData);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchTopStories();
  }, [params.id, _id]);

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        const { data } = await AxiosIns.get(`/contests/${_id}`);
        setContestDetails(data);
      } catch (error) {
        //
      }
    };
    fetchContestDetails();
  }, [params.id]);
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await AxiosIns.get(
          `/stories/contest/prompt?prompt_id=${id}&sortKey=score&page=${currentPage}&exclude_top_writings=true`
        );
        setStories(response.data?.data);
        setPageDetails(response.data?.pageData);
      } catch (err: any) {
        setError(err.message);
      }
    };
    const fetchPromptDetails = async () => {
      try {
        const { data } = await AxiosIns.get(`/prompts/${params.id}`);
        setPrompt(data);
      } catch (error) {
        //
      }
    };

    fetchStories();
    fetchPromptDetails();
  }, [params.id, currentPage]);
  useEffect(() => {
    if (selectedStory && topStoryRefs.current[selectedStory]) {
      const element = topStoryRefs.current[selectedStory];
      if (element) {
        // Scroll the element into view
        element.scrollIntoView({ behavior: "smooth" });

        // Calculate the position of the element relative to the viewport
        // const elementTop = element.getBoundingClientRect().top;

        // Only scroll up if the element's top is too close to the top of the viewport
        // if (elementTop < 200) {
        //   // Adjust 100 based on the height of your navbar
        //   setTimeout(() => {
        //     window.scrollBy(0, elementTop - 900); // Scroll up only by the necessary amount
        //   }, 200); // Adjust the delay as needed
        // }
      }
    }
  }, [selectedStory, topStories]);
  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1);
  };

  if (error) return <p>{error}</p>;
  if (stories.length === 0 && topStories.length === 0)
    return <NotFound text="No Stories to show !!" />;

  return (
    <div className="w-full min-h-screen mt-6 z-0 relative flex justify-center">
      <div className="w-10/12 sm:w-full h-auto ">
        <div className="w-full text-center sm:text-xl text-5xl font-bold font-comic relative pt-4">
          {prompt?.title}
        </div>
        <div className="flex justify-center mt-8"></div>
        <div className="flex w-full h-auto relative mt-0 justify-around">
          <div className="absolute md-hide top-0 -left-48 ">
            <Image src={Cloud2} alt="cloud" />
          </div>
          <div className="gap-8 relative w-full flex flex-col">
            {contestDetails?.topWritingPublished &&
              currentPage === 1 &&
              topStories.map((story) => {
                return (
                  <div
                    className=""
                    key={story._id}
                    ref={(el: HTMLDivElement | null) => {
                      topStoryRefs.current[story._id] = el;
                    }}
                  >
                    <TopWriting
                      title={story.title}
                      content={story.content}
                      corrections={story.corrections}
                      username={story.user.username}
                      email={story.user.email}
                      profile_image={story.user.profile_picture}
                    />
                  </div>
                );
              })}
            {stories.map((story) => {
              let starType: "main" | "none" = "none";
              if (story) {
                starType = "main";
              }
              return (
                <Storycard
                  key={story._id}
                  title={story.title}
                  content={story.content}
                  corrections={story.corrections}
                  username={story.user.username}
                  email={story.user.email}
                  profile_image={story.user.profile_picture}
                />
              );
            })}

            {pageDetails && pageDetails.total > 5 && (
              <div className="w-full ">
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
            <div className="absolute bottom-80 sm-hide  -right-40">
              <Image src={Cloud} alt="Cloud" />
            </div>
            <div className="absolute bottom-80 sm-hide -left-36">
              <Image src={Cloud} alt="Cloud" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewContest;
