'use client'
import Navbar from '@/app/components/profile/Navbar';
import React, { useState, useEffect } from 'react';
import UserStory from "@/app/components/profile/UserStory";
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

interface UserStory {
  _id: string;
  title: string;
  content: string;
}

const Page: React.FC = () => {
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchUserStories = async () => {
      try {
        const response = await axios.get<UserStory[]>('http://localhost:5000/api/stories/user', {
          params: {
            userId: '6640daca328ae758689fcfc1',
            storyType: 'game',
            skip: currentPage * itemsPerPage,
            limit: itemsPerPage
          }
        });
        setUserStories(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching user stories: ' + error.message);
        setLoading(false);
      }
    };

    fetchUserStories();
  }, [currentPage]);

  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
  };

  const pageCount = Math.ceil(userStories.length / itemsPerPage);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='font-poppins'>
      <Navbar />
      <div className='flex flex-col items-center gap-10'>
        {userStories.map((story) => (
          <UserStory
            key={story._id}
            title={story.title}
            description={story.content}
            id={story._id}
          />
        ))}
      </div>
      <div className="w-full mt-10 text-lg md:text-xl font-comic">
          <ReactPaginate
            previousLabel={<FaAngleLeft className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />}
            nextLabel={<FaAngleRight className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />}
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
    </div>
  );
};

export default Page;
