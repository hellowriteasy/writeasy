"use client";
import React, { useEffect, useState } from "react";
import UserStory from "@/app/components/profile/UserStory";
import ReactPaginate from "react-paginate";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import useAuthStore from "@/app/store/useAuthStore";
import { TStory } from "@/app/utils/types";
import NotFound from "@/app/components/Others/NotFound";
import ProfileTabs from "@/app/components/profile/ProfileTabs";
import { axiosInstance } from "@/app/utils/config/axios";

const ContestPage: React.FC = () => {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [userStories, setUserStories] = useState<TStory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [pageDetails, setPageDetails] = useState({
    page: 1,
    perPage: 10,
    total: 0,
  });
  const { userId } = useAuthStore();

  const AxiosIns = axiosInstance("");

  const fetchData = async (page = 1, perPage = itemsPerPage) => {
    try {
      const response = await AxiosIns.get("/stories/user", {
        params: {
          userId: userId,
          storyType: "contest",
          page,
        },
      });
      setUserStories(response.data?.data);
      setPageDetails(response.data.pageData);
    } catch (error) {}
  };
  useEffect(() => {
    fetchData(currentPage, itemsPerPage);
  }, [currentPage]);
  async function onsuccess() {
    try {
      const response = await AxiosIns.get("/stories/user", {
        params: {
          userId: userId,
          storyType: "contest",
        },
      });
      setUserStories(response.data?.data);
    } catch (error) {}
  }

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1);
  };

  const offset = currentPage * itemsPerPage;

  return (
    <div className="font-poppins">
      <ProfileTabs />
      <div className="flex flex-col items-center gap-10 min-h-[500px]">
        {
          <>
            {userStories.length > 0 ? (
              userStories.map((story, index) => (
                <UserStory
                  key={index}
                  title={story.title}
                  description={story.content}
                  id={story._id}
                  corrections={story.corrections}
                  type={story.storyType}
                  contributors={story.contributors}
                  promptTitle={story.prompt.title}
                  prompt_id={story.prompt._id}
                  contestTitle={story.contest?.contestTheme || ""}
                  onsuccess={onsuccess}
                />
              ))
            ) : (
              <NotFound text="No Contest To Show !!" />
            )}
          </>
        }
      </div>
      {pageDetails && pageDetails.total > 5 && (
        <div className="w-full">
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
  );
};

export default ContestPage;
