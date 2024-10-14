"use client";
import { useState, useEffect, ChangeEvent } from "react";
import CardAdd from "@/app/components/admin/Games/CardAdd";
import ModalGame from "@/app/components/admin/Games/Modal";
import ProtectedRoute from "@/app/utils/ProtectedRoute";
import { TPrompt } from "@/app/utils/types";
import { axiosInstance } from "@/app/utils/config/axios";
import ReactPaginate from "react-paginate";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import SearchInput from "@/app/components/SearchInput";

const Games: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [gamePrompts, setGamePrompts] = useState<TPrompt[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const AxiosIns = axiosInstance("");
  const [refetch, setRefetch] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const fetchGamePrompts = async (): Promise<void> => {
    try {
      const response = await AxiosIns.get(`prompts/game-prompts`, {
        params: {
          page: currentPage,
          perPage: 1000000,
          search: searchInput,
        },
      });
      setGamePrompts(response.data.data);
      setTotalItems(response.data?.pageData?.total); // Adjust according to your API response
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGamePrompts();
  }, [refetch, currentPage, searchInput]);

  const onSuccess = (): void => {
    setRefetch((prev) => !prev);
  };

  const handleAddClick = (): void => {
    setIsModalOpen(true);
  };

  const handlePageClick = (event: { selected: number }): void => {
    setCurrentPage(event.selected + 1);
  };

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <ProtectedRoute>
      <div className="bg-white">
        <div className="flex h-screen">
          <div className="flex-1 p-6  ">
            <div className="flex flex-col space-y-8 mb-3">
              {/* <div className="flex justify-between items-center border-e-2 border-slate-300 bg-white shadow p-4 rounded-lg">
                <div className="text-xl font-semibold">Games</div>
            
              </div> */}

              <div className="flex justify-between   rounded-lg items-center">
                <div className="text-xl font-semibold">All Games</div>
                <button
                  className="bg-custom-yellow text-black border border-black px-4 py-2 rounded-lg font-unkempt"
                  onClick={handleAddClick}
                >
                  Add
                </button>
              </div>
            </div>
            <SearchInput
              onChange={handleSearchInputChange}
              value={searchInput}
              placeholder="Search for games"
            />
            {gamePrompts &&
              gamePrompts.map((prompt) => (
                <CardAdd
                  key={prompt._id}
                  id={prompt._id}
                  onSuccess={onSuccess}
                  title={prompt.title}
                  description={prompt.description}
                />
              ))}
            {totalItems > 5 && (
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
                  pageCount={Math.ceil(totalItems / 5)}
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
          {isModalOpen && (
            <ModalGame setIsModalOpen={setIsModalOpen} onSuccess={onSuccess} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Games;
