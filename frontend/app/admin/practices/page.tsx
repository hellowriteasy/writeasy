'use client';
import { useState } from "react";
import Navbar from "../../components/admin/Navbar";
import Sidebar from "../../components/admin/Sidebar";
import Card from "../../components/admin/practice/CardAdd";
import Modal from "../../components/admin/practice/Modal";

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
          <div className="flex justify-between items-center w-5/6 bg-white shadow-sm p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-semibold text-gray-700">Practices</div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={handleAddClick}
            >
              Add
            </button>
          </div>

          <div className="bg-white shadow-sm p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-xl font-semibold text-gray-700">All prompts</div>
              <div className="text-lg flex gap-4 text-gray-500">
                <i className="fas fa-plus cursor-pointer"></i>
                <i className="fas fa-hashtag cursor-pointer"></i>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              <Card title="prompt" type="lorem" />
              <Card title="prompt2" type="lorem2" />
              <Card title="prompt3" type="lorem3" />
              <Card title="prompt4" type="lorem4" />
            </div>
          </div>
        </div>
        {isModalOpen && <Modal setIsModalOpen={setIsModalOpen} />}
      </div>
    </div>
  );
};

export default Page;
