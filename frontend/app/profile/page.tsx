"use client";
import React, { useState, useEffect } from "react";
import UserStory from "@/app/components/profile/UserStory";
import ReactPaginate from "react-paginate";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import useAuthStore from "../store/useAuthStore";
import { TStory } from "../utils/types";
import NotFound from "../components/Others/NotFound";
import ProfileTabs from "../components/profile/ProfileTabs";
import { axiosInstance } from "../utils/config/axios";

const Page: React.FC = () => {
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

  const fetchUserStories = async (page = 1, perPage = itemsPerPage) => {
    try {
      const response = await AxiosIns.get("/stories/user", {
        params: {
          userId: userId,
          storyType: "practice",
          page,
        },
      });

      setUserStories(response.data?.data);
      setPageDetails(response.data.pageData);
    } catch (error: any) {
      setError("Error fetching user stories: " + error.message);
    }
  };
  useEffect(() => {
    fetchUserStories(currentPage, itemsPerPage);
  }, [currentPage]);

  async function onSuccess() {
    const fetchUserStories = async () => {
      try {
        const response = await AxiosIns.get("/stories/user", {
          params: {
            userId: userId,
            storyType: "practice",
          },
        });

        setUserStories(response.data?.data);
      } catch (error: any) {
        setError("Error fetching user stories: " + error.message);
      }
    };

    fetchUserStories();
  }

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1);
  };

  const offset = currentPage * itemsPerPage;

  if (error) return <p>{error}</p>;

  return (
    <div className="font-poppins">
      <ProfileTabs />
      <div className="flex flex-col items-center gap-10 min-h-[500px]">
        {userStories.length > 0 ? (
          userStories.map((story) => (
            <UserStory
              key={story._id}
              title={story.title}
              contestTitle={story.contest?.contestTheme || ""}
              promptTitle={story.prompt?.title}
              prompt_id={story.prompt?._id}
              description={story.content}
              id={story._id}
              corrections={story.corrections}
              type={story.storyType}
              contributors={story.contributors}
              onsuccess={onSuccess}
            />
          ))
        ) : (
          <NotFound text="No Practices To Show !!" />
        )}
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
  );
};

export default Page;
