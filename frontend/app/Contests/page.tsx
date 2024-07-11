"use client";
import React, { useEffect, useState } from "react";
import TopWriting from "../components/Others/TopWriting";
import WeeklyTest from "../components/Others/WeeklyTest";
import earth from "../../public/Game/earth.svg";
import A from "../../public/Game/A.svg";
import Dumbelman from "../../public/Game/dumbelman.svg";
import Bee from "../../public/Game/Bee.svg";
import Cloud from "../../public/Game/cloud.svg";
import Image from "next/image";
import Join from "../components/contest/Join";
import Contestitle from "../components/contest/Contestitle";
import ReactPaginate from "react-paginate";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { axiosInstance } from "../utils/config/axios";

const Contest = () => {
  const itemsPerPage = 5;

  const [currentPage, setCurrentPage] = useState(1);
  const [endedContests, setEndedContests] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const AxiosIns = axiosInstance("");
  const [pageDetails, setPageDetails] = useState({
    page: 1,
    perPage: 10,
    total: 0,
  });
  useEffect(() => {
    AxiosIns.get(`/contests/ended?page=${currentPage}`)
      .then((response) => {
        setEndedContests(response.data?.data.reverse());
        setPageDetails(response.data?.pageData);
      })
      .catch((error) => {
        setError("Error fetching contest data: " + error.message);
      });
  }, [currentPage]);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1);
  };

  const offset = currentPage * itemsPerPage;
  console.log("page data", pageDetails);
  // infite scrolll library

  if (error) return <p>{error}</p>;

  return (
    <div className="w-full h-auto mt-6 z-0 relative flex justify-center">
      <div className="absolute sm-hide -top-14 right-0">
        <Image className="w-[9vw]" src={earth} alt="earth" />
      </div>
      <div className="w-10/12 h-screen ms-12">
        <div className="w-full h-60 sm:h-40 relative pt-4">
          <h1 className="text-3xl sm:text-xl md:text-5xl lg:text-6xl font-bold font-comic">
            Enter the Contest Arena
          </h1>
          <div className="absolute top-6 md-hide right-20 ">
            <Image className=" w-[7vw]" src={A} alt="group" />
          </div>
          <div className="absolute top-10 md-hide right-48  ">
            <Image className="w-[12vw]" src={Dumbelman} alt="group" />
          </div>
          <p className="text-lg sm:text-sm md:text-2xl font-comic pt-4">
            Compete with young writers worldwide and unleash your creativity.
          </p>
        </div>

        <div className="flex w-full h-auto relative mt-0 justify-around gap-x-5 sm:gap-x-0">
          <div className="w-full">
            <div className="absolute top-40 -left-32">
              <Image className="w-[12vw]" src={Bee} alt="bee" />
            </div>
            <div className="gap-8 relative flex flex-col gap-y-20 sm:gap-9 w-full ">
              <div className="flex flex-col gap-y-3">
                <Join />
              </div>
              <div className="flex flex-col  gap-y-3 sm:gap-y-0 w-full ">
                {endedContests.map((contest, index) => (
                  <Contestitle key={index} contest={contest} />
                ))}
              </div>
              <div className="absolute bottom-32 -left-40">
                <Image className="w-[7vw]" src={Cloud} alt="Cloud" />
              </div>
            </div>
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
          </div>

          <div className="flex flex-col vsm-hide gap-8">
            <WeeklyTest />
            <TopWriting />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contest;
