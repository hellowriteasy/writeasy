'use client';
import { useState } from "react";
import Navbar from "../../components/admin/Navbar";
import Sidebar from "../../components/admin/Sidebar";
import CardAdd from "@/app/components/admin/Games/CardAdd";
import ModalGame from "@/app/components/admin/Games/Modal";

const Games = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };
   const description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit ducimus asperiores ipsa! Maiores corporis nesciunt accusamus obcaecati quibusdam, sunt, asperiores placeat impedit minus architecto illo, facere dignissimos totam dolores saepe?"
  return (
    <div>
      <Navbar />
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="flex flex-col space-y-8">
            <div className="flex justify-between items-center border-e-2 border-slate-300 bg-white shadow p-4 rounded-lg">
              <div className="text-xl font-semibold">Games</div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                onClick={handleAddClick}
              >
                Add
              </button>
            </div>

            <div className="flex justify-between space-y-4 rounded-lg">
              <div className="text-xl font-semibold">All Story Titles</div>
              <div className="text-lg flex gap-4">
                <i>+</i>
                <i>#</i>
              </div>

            </div>
          </div>
          <CardAdd title="Story" description={description} />
          <CardAdd title="Story2" description={description} />
          <CardAdd title="Story3" description={description} />
          <CardAdd title="Story4" description={description} />
        </div>
      {isModalOpen && <ModalGame setIsModalOpen={setIsModalOpen} />}
      </div>
    </div>
  );
};

export default Games;
