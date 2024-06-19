import Image from "next/image";
import mic from "@/public/Game/Clip path group.svg";
import axios from "axios";
import { useEffect, useState } from "react";
import { TContest } from "@/app/utils/types";
import { axiosInstance } from "@/app/utils/config/axios";
import useAuthStore from "@/app/store/useAuthStore";
import Link from "next/link";

const WeeklyTest = () => {
  const [contest, setContest] = useState<TContest | null>(null);
  const {token} = useAuthStore()
  const { submissionDeadline, prompts } = contest || {}; // Use default values if contest is null
  const AxiosIns = axiosInstance(token||"")

  const formattedDate = submissionDeadline
    ? new Date(submissionDeadline).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : ""; // Handle potential null value for formattedDate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosIns.get(
          "/contests/ongoing"
        );
        setContest(response.data[0]);
      } catch (error) {
        console.error("Error fetching contest data:", error);

      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-[360px] h-auto flex flex-col justify-center items-center relative yellow border-4 border-yellow-500 rounded-3xl py-5">
      <div className="absolute -top-12 -right-12">
        <Image src={mic} alt="mic" />
      </div>

      {contest ? ( // Conditionally render content only if contest data is available
        <div className="text-center font-comic w-11/12 text-3xl font-bold">
          <h2 className="py-5">Enter Our Weekly Contests!</h2>

          <ul className="p-2">
            <li>{contest.contestTheme}</li>
            {/* {prompts?.map((prompt) => (
              <li key={prompt._id}>{prompt.title}</li>
            ))} */}
          </ul>
          <p className="text-sm pt-2">
            <span className="font-bold">Closes</span>
            {new Date(contest.submissionDeadline).toLocaleString()}
          </p>
          <Link href={`/Contests/${contest._id}`}>
            <button className="w-40 h-12 mt-4 bg-black font-bold font-comic text-white rounded-2xl ">
              view details
            </button>
          </Link>
        </div>
      ) : (
        <p>Loading contest data...</p> // Display a loading message while fetching
      )}
    </div>
  );
};

export default WeeklyTest;
