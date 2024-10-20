"use client";
import { useState, useEffect } from "react";
import Card from "../../components/admin/stories/contests/StoryCard";
import StoryNav from "@/app/components/admin/stories/StoryNav";
import ProtectedRoute from "@/app/utils/ProtectedRoute";
import { TStory } from "@/app/utils/types";
import { axiosInstance } from "@/app/utils/config/axios";
import ReactPaginate from "react-paginate";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const Page = ({ params }: { params: { id: string } }) => {
  const [stories, setStories] = useState<TStory[]>([]);
  const [pageDetails, setPageDetails] = useState<{
    page: number;
    perPage: number;
    total: number;
  } | null>(null);
  const AxiosIns = axiosInstance("");
  const [currentPage, setCurrentPage] = useState(1);
 const fetchStories = async () => {
   try {
     const response = await AxiosIns.get(
       `/stories/contest/prompt?contest_id=${params.id}&sortKey=score&page=${currentPage}`
     );
     setStories(response.data?.data);
     setPageDetails(response.data.pageData);
   } catch (error) {
     console.error("Error fetching stories:", error);
   }
 };
  useEffect(() => {
   

    fetchStories();
  }, [params.id, currentPage]);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1);
  };

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-screen">
        <div className="flex h-screen">
          <div className="flex-1 flex flex-col p-6 space-y-6">
            <StoryNav />
            <div className="bg-white shadow-sm p-4 rounded-lg border w-full border-gray-200 space-y-4">
              {stories.map((story) => (
                <Card
                  key={story._id}
                  story={story}
                  refetchStory={fetchStories}
                />
              ))}
              {pageDetails && pageDetails.total > 5 && (
                <div className="w-full  ">
                  <ReactPaginate
                    previousLabel={
                      <FaAngleLeft className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                    }
                    nextLabel={
                      <FaAngleRight className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                    }
                    breakLabel="..."
                    breakClassName="break-me"
                    pageCount={Math.ceil(
                      pageDetails.total / pageDetails.perPage
                    )}
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
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Page;
