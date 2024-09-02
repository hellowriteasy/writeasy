import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Crown from "@/public/Game/Crown.svg";
import Link from "next/link";
import { axiosInstance } from "@/app/utils/config/axios";
import { TUser } from "@/app/utils/types";
interface Story {
  _id: string;
  title: string;
  content: string;
  wordCount: number;
  contest: string;
  prompt: string;
  user: TUser;
}

const TopWriting: React.FC = () => {
  const [topStories, setTopStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const AxiosIns = axiosInstance("");
  useEffect(() => {
    AxiosIns.get("/stories/contest/previous-week-top-stories")
      .then((response) => {
        setTopStories(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError("There was an error fetching the top stories.");
        setIsLoading(false);
      });
  }, []);
  return (
    <div className="w-96 mid:w-[200px]   h-auto flex justify-center relative yellow border-4 border-yellow-500 rounded-3xl p-4 md:p-0">
      <div className="absolute -top-6 sm-hide md:-top-9 right-4 md:right-[-12px]">
        <Image
          src={Crown}
          alt="Crown"
          width={40}
          height={40}
          className="md:w-auto md:h-auto"
        />
      </div>

      <div className="text-center w-full md:w-11/12 pt-4 text-xl md:text-3xl font-bold">
        <h2 className="font-comic text-[2vw] py-4 font-bold leading-normal">
          Top writings of previous week
        </h2>
        {isLoading ? (
          <p className="font-comic">Loading...</p>
        ) : error ? (
          <p className="font-comic">{error}</p>
        ) : (
          <ul className="p-4 w-full flex flex-col gap-y-1">
            {topStories.map((story, index) => (
              <Link
                href={`/Contests/${story.contest}/${story.prompt}?top-writing=${story._id}`}
                key={story._id}
                className="my-2 flex flex-col  items-start"
              >
                <h1 className="text-xl text-start font-comic font-bold capitalize ">
                  {story.user.username}
                </h1>
                <h3 className="text-lg text-start font-comic md:text-xl font-normal line-clamp-1">
                  {story.content}
                </h3>
              </Link>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TopWriting;
