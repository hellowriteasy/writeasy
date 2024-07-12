"use client";
import { useState, useEffect } from "react";
import Card from "../../components/admin/practice/CardAdd";
import Modal from "../../components/admin/practice/Modal";
import ProtectedRoute from "@/app/utils/ProtectedRoute";
import { TPrompt, TPageDetails } from "@/app/utils/types";
import { axiosInstance } from "@/app/utils/config/axios";
import ReactPaginate from "react-paginate";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const Page = () => {
  const itemsPerPage = 5; // Adjust the items per page as needed
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prompts, setPrompts] = useState<TPrompt[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const AxiosIns = axiosInstance("");
  const [refetch, setRefetch] = useState(false);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const fetchPrompts = async (page = 1, perPage = itemsPerPage) => {
    try {
      const response = await AxiosIns.get("/prompts/practice-prompts", {
        params: {
          page,
          perPage,
        },
      });
      setPrompts(response.data.data);
      setTotalItems(response.data?.pageData?.total); // Adjust according to your API response
    } catch (error) {
      console.error("Error fetching prompts:", error);
    }
  };

  useEffect(() => {
    fetchPrompts(currentPage, itemsPerPage); // Pages are 1-indexed in the API
  }, [currentPage, refetch]);

  const onSuccess = () => {
    setRefetch(!refetch);
  };

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1);
  };

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 font-poppins min-h-screen">
        <div className="flex h-screen">
          <div className="flex-1 flex flex-col p-6 space-y-6">
            <div className="flex justify-between items-center w-5/6 bg-white shadow-sm p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-semibold text-gray-700">
                Practices
              </div>
              <button
                className="bg-black text-white px-4 py-2 rounded-lg"
                onClick={handleAddClick}
              >
                Add
              </button>
            </div>

            <div className="bg-white shadow-sm p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-xl font-semibold text-gray-700">
                  All prompts
                </div>
                <div className="text-lg flex gap-4 text-gray-500">
                  <i className="fas fa-plus cursor-pointer"></i>
                  <i className="fas fa-hashtag cursor-pointer"></i>
                </div>
              </div>
              <div className="mt-4 space-y-4">
                {prompts.map((prompt, index) => (
                  <Card
                    key={index}
                    id={prompt._id}
                    title={prompt.title}
                    onSuccess={onSuccess}
                    type={prompt.promptCategory}
                  />
                ))}
              </div>
              {totalItems > itemsPerPage && (
                <div className="mt-4">
                  <ReactPaginate
                    previousLabel={
                      <FaAngleLeft className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                    }
                    nextLabel={
                      <FaAngleRight className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                    }
                    breakLabel="..."
                    breakClassName="break-me"
                    pageCount={Math.ceil(totalItems / itemsPerPage)}
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
          {isModalOpen && (
            <Modal setIsModalOpen={setIsModalOpen} onSuccess={onSuccess} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Page;
