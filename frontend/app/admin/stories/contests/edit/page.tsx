'use client';
import { useState } from "react";
import Navbar from "../../../../components/admin/Navbar";
import Sidebar from "../../../../components/admin/Sidebar";
import Card from "../../../../components/admin/stories/contests/StoryCard";
import StoryNav from "@/app/components/admin/stories/StoryNav";
const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div>
      <Navbar />
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="flex flex-col space-y-8">

           <StoryNav></StoryNav>
           <div>
            <h1>#7 Contest Title</h1>
            <h3> Deadline :</h3>
           </div>
            
            <div className="flex justify-between items-center border-e-2  p-4 rounded-lg">
            
              <div className="text-xl font-semibold">All Stories
              
              </div>
              
              <div className="text-lg flex gap-4">
                <i>+</i>
                <i>#</i>
              </div>
            </div>

          </div>
          <Card title="Story Title" deadline="lorem" />
          <Card title="Story Title 2" deadline="lorem" />
          <Card title="Story Title 3" deadline="lorem" />
          <Card title="Story Title 4" deadline="lorem" />
        </div>
      </div>
      
    </div>
  );
};

export default Page;
