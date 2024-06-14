"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import { TContest } from "@/app/utils/types";

const Join = () => {
  const router = useRouter();
  const [contests, setContests] = useState<TContest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/contests/ongoing`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data: TContest[] = await response.json();
        setContests(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);

  if (loading) return <div></div>;
  if (error) return <p>{error}</p>;
  if (contests.length === 0) return <p>No contest available at the moment.</p>;

  return (
    <div className="flex flex-col items-center gap-7  ">
      {contests.map((contest) => (
        <div
          key={contest._id}
          className="flex  font-comic rounded-3xl w-full  h-auto  gap-4 bg-white border-2 border-gray-300 justify-center items-center  sm:justify-between p-8 "
        >
          <div className="flex flex-col items-center sm:items-start gap-y-4">
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center sm:text-left">
              {contest.contestTheme}
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="text-2xl sm:text-xl md:text-2xl lg:text-2xl text-center sm:text-left">
                {/* until {new Date(contest.submissionDeadline).toLocaleString()} GMT */}

                <span className="font-bold"> Prompt publish date : </span>
                {moment(contest.promptPublishDate).format("llll")}
              </p>
              <p className="text-2xl sm:text-xl md:text-2xl lg:text-2xl text-center sm:text-left">
                {/* until {new Date(contest.submissionDeadline).toLocaleString()} GMT */}
                <span className="font-bold"> Submission Deadline : </span>
                {moment(contest.submissionDeadline).format("llll")}
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push(`/Contests/${contest._id}`)}
            className="mt-4 self-end sm:mt-6 bg-black font-comic rounded-3xl text-white h-10 sm:h-12 w-32 sm:w-40 text-center text-lg sm:text-2xl md:text-3xl"
          >
            Join
          </button>
        </div>
      ))}
    </div>
  );
};

export default Join;
