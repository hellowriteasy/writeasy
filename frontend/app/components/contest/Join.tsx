"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import { TContest, TPageDetails } from "@/app/utils/types";
import NotFound from "../Others/NotFound";
import { axiosInstance } from "@/app/utils/config/axios";
import useAuthStore from "@/app/store/useAuthStore";
import ReactPaginate from "react-paginate";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
const Join = () => {
  const router = useRouter();
  const [contests, setContests] = useState<TContest[]>([]);
  const [hasContestFetched, setHasContestFetched] = useState(false);
  const { token } = useAuthStore();
  const axiosIns = axiosInstance(token || "");
  const [pageDetails, setPageDetails] = useState<TPageDetails | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { email } = useAuthStore();
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const { data } = await axiosIns.get(
          `/contests/ongoing?page=${currentPage}`
        );
        setHasContestFetched(true);
        setContests(data.data);
        setPageDetails(data?.pageData);
      } catch (err: any) {}
    };
    fetchContests();
  }, [currentPage]);

  const handleChangePage = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1);
  };

  const handleJoinClick = (contestId: string) => {
    if (!email) {
      router.push(`/login`);
      return;
    }
    router.push(`/Contests/${contestId}`);
  };
  return (
    <div className="flex">
      {hasContestFetched && contests.length === 0 ? (
        <NotFound text="" />
      ) : (
        <div className="flex flex-col justify-center items-center gap-7 w-full ">
          {contests.map((contest) => (
            <div
              key={contest._id}
              className="flex flex-col flex-wrap font-unkempt rounded-3xl w-full max-w-4xl h-auto gap-4 bg-white border-2 border-gray-300 p-8"
            >
              <div className="flex justify-center vsm:flex-col text-xl sm:text-sm items-center gap-x-2 gap-y-2 text-center">
                <div className="text-yellow-400 text-xl pr-3 font-bold">
                  LIVE
                </div>
                Until {moment(contest.submissionDeadline).format("llll")}
              </div>
              <div className="flex flex-col items-center gap-y-4">
                <div className="text-xl sm:text-sm md:text-3xl lg:text-4xl text-center">
                  {contest.contestTheme}
                </div>
              </div>
              <div className="flex justify-center mt-4 sm:mt-6">
                <button
                  onClick={() => handleJoinClick(contest._id)}
                  className="bg-black font-unkempt rounded-full text-white h-10 sm:h-10 sm:text-sm w-32 sm:w-28 text-center text-lg  md:text-3xl"
                >
                  Join
                </button>
              </div>
            </div>
          ))}
          {pageDetails && pageDetails.total > 5 && (
            <div className="w-full ms-28">
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
                onPageChange={handleChangePage}
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
  );
};

export default Join;
