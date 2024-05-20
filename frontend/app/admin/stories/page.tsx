'use client';
import { useState } from "react";
import Navbar from "../../components/admin/Navbar";
import Sidebar from "../../components/admin/Sidebar";
import Card from "../../components/admin/stories/StoryTitleCard";
import PracticeModal from "../../components/admin/stories/PracticeModal";
import StoryNav from "@/app/components/admin/stories/StoryNav";

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col p-6 space-y-6">
          <StoryNav />

          <div className="flex justify-between items-center w-5/6 bg-white shadow-sm p-4 rounded-lg border border-gray-00">
            <div className="text-2xl font-semibold text-gray-700">All Stories</div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={handleAddClick}
            >
              Add
            </button>
          </div>

          <div className="bg-white shadow-sm p-4 rounded-lg border border-gray-200 space-y-4">
            <Card title="Story Title" usernames="abcd123, abcd32, abcd32" />
            <Card title="Story Title 2" usernames="lorem322, abcd32, abcd32" />
            <Card title="Story Title 3" usernames="lorem323, abcd32, abcd32" />
            <Card title="Story Title 4" usernames="lorem34, abcd32, abcd32" />
          </div>
        </div>
        {isModalOpen && <PracticeModal setIsModalOpen={setIsModalOpen} />}
      </div>
    </div>
  );
};

export default Page;
