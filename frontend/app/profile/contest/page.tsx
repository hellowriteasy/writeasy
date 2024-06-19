'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserStory from '@/app/components/profile/UserStory';
import ReactPaginate from 'react-paginate';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import useAuthStore from '@/app/store/useAuthStore';
import { TStory } from '@/app/utils/types';
import NotFound from '@/app/components/Others/NotFound';
import ProfileTabs from '@/app/components/profile/ProfileTabs';
import { axiosInstance } from '@/app/utils/config/axios';


const ContestPage: React.FC = () => {
  const [userStories, setUserStories] = useState<TStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const {userId}=useAuthStore();
  const itemsPerPage = 5;
 const AxiosIns=axiosInstance("")
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosIns.get('/stories/user', {
          params: {
            userId:userId,
            storyType: 'contest',
            skip: currentPage * itemsPerPage,
            limit: itemsPerPage
          }
        });
        setUserStories(response.data.reverse());
        setLoading(false);
      } catch (error) {
   
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handlePageClick = (data:{selected:number}) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
  };

  const pageCount = Math.ceil(userStories.length / itemsPerPage);

  
  return (
    <div className="font-poppins">
      <ProfileTabs />
      <div className="flex flex-col items-center gap-10 min-h-[500px]">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
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
                  contestTitle={story.contest.contestTheme}
                />
              ))
            ) : (
              <NotFound text="No Contest To Show !!" />
            )}
            {userStories.length > 0 ? (
              <div className="w-full mt-10 text-lg md:text-xl font-comic">
                <ReactPaginate
                  previousLabel={
                    <FaAngleLeft className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                  }
                  nextLabel={
                    <FaAngleRight className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                  }
                  breakLabel="..."
                  breakClassName="break-me"
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageClick}
                  containerClassName="flex justify-center gap-2 md:gap-4 lg:gap-6 rounded-full mt-8"
                  pageLinkClassName="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 flex items-center justify-center border border-gray-300 rounded-full"
                  previousLinkClassName="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 flex items-center justify-center border border-gray-300 rounded-full"
                  nextLinkClassName="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 flex items-center justify-center border border-gray-300 rounded-full"
                  activeClassName="bg-black text-white rounded-full"
                />
              </div>
            ) : (
              ""
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ContestPage;
