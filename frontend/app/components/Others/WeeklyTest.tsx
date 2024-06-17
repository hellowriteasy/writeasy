import Image from "next/image";
import mic from "@/public/Game/Clip path group.svg";
import axios from "axios";
import { useEffect, useState } from "react";
import { TContest } from "@/app/utils/types";
import { axiosInstance } from "@/app/utils/config/axios";

const WeeklyTest = () => {
  const [contest, setContest] = useState<TContest | null>(null);
  const { submissionDeadline, prompts } = contest || {}; // Use default values if contest is null
 const AxiosIns=axiosInstance("")
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
        var response = await AxiosIns.get(
          "/contests/ongoing"
        );
        setContest(response.data[1]);
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
          <p className="text-sm pt-4">
            <span className="font-bold">CLoses</span>{new Date(contest.submissionDeadline).toLocaleString()}
          </p>

          <ul className="p-4">
            {prompts?.map((prompt) => (
              <li key={prompt._id}>{prompt.title}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading contest data...</p> // Display a loading message while fetching
      )}

      <button className="w-40 h-12 bg-black font-bold font-comic text-white rounded-2xl ">
        {" "}
        view details
      </button>
    </div>
  );
};

export default WeeklyTest;
