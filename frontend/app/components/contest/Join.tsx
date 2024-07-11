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
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuthStore();
  const axiosIns = axiosInstance(token || "");
  const [pageDetails, setPageDetails] = useState<TPageDetails | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const { data } = await axiosIns.get(
          `/contests/ongoing?page=${currentPage}`
        );
        setContests(data.data);
        setPageDetails(data?.pageData);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchContests();
  }, [currentPage]);

  const handleChangePage = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1);
  };

  console.log("debug 1 ", pageDetails);
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
      ) : (
        <NotFound text="No contest available at the moment." />
      )}
    </div>
  );
};

export default Join;
