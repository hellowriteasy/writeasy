"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Cloud from "@/public/Game/cloud.svg";
import Cloud2 from "@/public/Game/cloud3.svg";
import Pagination from "@/app/components/Pagination";
import Storycard from "@/app/components/Storycard";
import { axiosInstance } from "@/app/utils/config/axios";
import NotFound from "@/app/components/Others/NotFound";
import { TStory } from "@/app/utils/types";

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
    id: string;
  };
}

const ViewContest: React.FC<ViewContestProps> = ({ params }) => {
  const [stories, setStories] = useState<TStory[]>([]);
  const AxiosIns = axiosInstance("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await AxiosIns.get(
          `/stories/contest/prompt?prompt_id=${params.id}&sortKey=score`
        );
        setStories(response.data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchStories();
  }, [params.id]);

  if (error) return <p>{error}</p>;
  if (stories.length === 0) return <NotFound text="No Stories to show !!" />;

  return (
    <div className="w-full min-h-screen mt-6 z-0 relative flex justify-center">
      <div className="w-10/12 h-auto ms-12">
        <div className="w-full text-center text-2xl font-comic relative pt-4">
          CONTEST ENDED
        </div>
        <div className="flex justify-center mt-8"></div>
        <div className="flex w-full h-auto relative mt-0 justify-around">
          <div className="absolute md-hide top-0 -left-48 ">
            <Image src={Cloud2} alt="cloud" />
          </div>
          <div className="gap-8 relative w-full flex flex-col">
            {/* <div className="w-[53vw]">
              {/* <h1 className="text-6xl font-comic font-bold p-10">
                {prompt_title}
              </h1> */}
        
            {stories.map((story, index) => {
              let starType: "main" | "second" | "none" = "none";
              if (index === 0) {
                starType = "main";
              } else if (index === 1 || index === 2) {
                starType = "second";
              }
              return (
                <Storycard
                  key={story._id}
                  title={story.title}
                  content={story.content}
                  corrections={story.corrections}
                  starType={starType}
                  username={story.user.username}
                  email={story.user.email}
                />
              );
            })}
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
