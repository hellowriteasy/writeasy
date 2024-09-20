import Image from "next/image";
import mic from "@/public/Game/Clip path group.svg";
import { useEffect, useState } from "react";
import { TContest } from "@/app/utils/types";
import { axiosInstance } from "@/app/utils/config/axios";
import useAuthStore from "@/app/store/useAuthStore";
import Link from "next/link";

const WeeklyTest = () => {
  const [contest, setContest] = useState<TContest | null>(null);
  const { token } = useAuthStore();
  const { submissionDeadline, prompts } = contest || {}; // Use default values if contest is null
  const AxiosIns = axiosInstance(token || "");
  const [hasFinishedFetching, setHasFinishedFetching] = useState(false);

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
        const response = await AxiosIns.get("/contests/ongoing");
        const currentContest = response.data?.data[0];
        if (currentContest) {
          setContest(currentContest);
        }
        setHasFinishedFetching(true);
      } catch (error) {
        console.error("Error fetching contest data:", error);
        setHasFinishedFetching(true);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-96  h-auto flex flex-col justify-center items-center relative yellow border-4 border-yellow-500 rounded-3xl py-5">
      <div className="absolute -top-12  sm-hide -right-12">
        <Image src={mic} alt="mic" />
      </div>

      {hasFinishedFetching ? (
        contest ? ( // Conditionally render content only if contest data is available
          <div className="text-center font-unkempt mid:text-xl w-11/12 text-3xl font-bold">
            <h2 className="py-5 leading-normal">Enter Our Contests!</h2>

            <ul className="p-2  mid:text-sm">
              <li>{contest.contestTheme}</li>
              {/* {prompts?.map((prompt) => (
              <li key={prompt._id}>{prompt.title}</li>
            ))} */}
            </ul>
            <p className="text-sm mid:text-[10px] pt-2">
              <span className="font-bold">Closes - </span>
              {new Date(contest.submissionDeadline).toLocaleString()}
            </p>
            <Link href={`/Contests/${contest._id}`}>
              <button className="text-sm w-40 mid:w-28 mid:h-10 h-12 mt-4 bg-black font-bold font-unkempt text-white rounded-2xl ">
                view details
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-y-3">
            <p className="font-unkempt leading-normal font-bold text-xl">
              Coming soon ,get your pen ready!
            </p>
            {/* <h1 className="font-unkempt text-[1vw] py-1 font-bold ">
            Contest will be started soon ...
          </h1> */}
          </div> // Display a loading message while fetching
        )
      ) : null}
    </div>
  );
};

export default WeeklyTest;
