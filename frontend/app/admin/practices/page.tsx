'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/admin/Navbar";
import Card from "../../components/admin/practice/CardAdd";
import Modal from "../../components/admin/practice/Modal";
import ProtectedRoute from "@/app/utils/ProtectedRoute";
import { TPrompt } from "@/app/utils/types";
import { axiosInstance } from "@/app/utils/config/axios";
const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prompts, setPrompts] = useState <TPrompt[]>([]);
  const handleAddClick = () => {
    setIsModalOpen(true);
  };
 const AxiosIns=axiosInstance("")
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await AxiosIns.get('/prompts/practice-prompts');
        setPrompts(response.data.reverse());
      } catch (error) {
        console.error('Error fetching prompts:', error);
      }
    };

    fetchPrompts();
  }, []);

  return (
    <ProtectedRoute>
    <div className="bg-gray-50 font-poppins min-h-screen">
     
      <div className="flex h-screen">
     
        <div className="flex-1 flex flex-col p-6 space-y-6">
          <div className="flex justify-between items-center w-5/6 bg-white shadow-sm p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-semibold text-gray-700">Practices</div>
            <button
              className="bg-black text-white px-4 py-2 rounded-lg "
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
              {prompts.map((prompt, index) => (
                <Card key={index} id={prompt._id} title={prompt.title} type={prompt.promptCategory} />
              ))}
            </div>
          </div>
        </div>
        {isModalOpen && <Modal setIsModalOpen={setIsModalOpen} />}
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default Page;
