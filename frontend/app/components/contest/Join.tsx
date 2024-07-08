"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import { TContest } from "@/app/utils/types";
import NotFound from "../Others/NotFound";
import { axiosInstance } from "@/app/utils/config/axios";
import useAuthStore from "@/app/store/useAuthStore";

const Join = () => {
  const router = useRouter();
  const [contests, setContests] = useState<TContest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuthStore();
  const axiosIns = axiosInstance(token || "");

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const { data } = await axiosIns.get(`/contests/ongoing`);
        setContests(data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchContests();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div className="flex">
      
      {contests.length > 0 ? (
        <div className="flex flex-col justify-center items-center gap-7 w-full p-4">
            
          {contests.map((contest) => (
            <div
              key={contest._id}
              className="flex flex-col font-comic rounded-3xl w-full max-w-4xl h-auto gap-4 bg-white border-2 border-gray-300 p-8"
            >
              <div className="flex flex-col gap-y-2 text-center">
                  <p className="text-lg sm:text-sm md:text-2xl lg:text-2xl">
                    <span className="">Until </span>
                    {moment(contest.submissionDeadline).format("llll")}
                  </p>
                </div>
              <div className="flex flex-col items-center gap-y-4">
                <div className="text-xl sm:text-sm md:text-3xl lg:text-4xl text-center">
                  {contest.contestTheme}
                </div>
              
              </div>
              <div className="flex justify-center mt-4 sm:mt-6">
                <button
                  onClick={() => router.push(`/Contests/${contest._id}`)}
                  className="bg-black font-comic rounded-3xl text-white h-10 sm:h-10 sm:text-sm w-32 sm:w-28 text-center text-lg  md:text-3xl"
                >
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <NotFound text="No contest available at the moment." />
      )}
    </div>
  );
};

export default Join;
