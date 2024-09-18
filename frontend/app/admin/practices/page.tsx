"use client";
import { useState, useEffect } from "react";
import Card from "../../components/admin/practice/CardAdd";
import Modal from "../../components/admin/practice/Modal";
import ProtectedRoute from "@/app/utils/ProtectedRoute";
import { TPrompt } from "@/app/utils/types";
import { axiosInstance } from "@/app/utils/config/axios";

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prompts, setPrompts] = useState<TPrompt[]>([]);
  const AxiosIns = axiosInstance("");
  const [refetch, setRefetch] = useState(false);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const fetchPrompts = async () => {
    try {
      const response = await AxiosIns.get("/prompts/practice-prompts", {
        params: {
          page: 1,
          perPage: 1000, // Set a high number to fetch all items
        },
      });
      setPrompts(response.data.data);
    } catch (error) {
      console.error("Error fetching prompts:", error);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, [refetch]);

  const onSuccess = () => {
    setRefetch(!refetch);
  };

  return (
    <ProtectedRoute>
      <div className=" font-poppins min-h-screen">
        <div className="flex h-screen">
          <div className="flex-1 flex flex-col  space-y-6">
            {/* <div className="flex justify-between items-center w-full bg-white shadow-sm p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-semibold text-gray-700">
                Practices
              </div>
           
            </div> */}

            <div className="bg-white shadow-sm p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-xl font-semibold text-gray-700">
                  All prompts
                </div>
                <div className="text-lg flex gap-4 text-gray-500">
                  <i className="fas fa-plus cursor-pointer"></i>
                  <i className="fas fa-hashtag cursor-pointer"></i>
                </div>
                <button
                  className="bg-custom-yellow text-black border border-black px-4 py-2 rounded-lg font-unkempt"
                  onClick={handleAddClick}
                >
                  Add
                </button>
              </div>
              <div className="mt-4 space-y-4 ">
                {prompts.map((prompt, index) => (
                  <Card
                    key={index}
                    id={prompt._id}
                    title={prompt.title}
                    onSuccess={onSuccess}
                    type={prompt.promptCategory}
                  />
                ))}
              </div>
            </div>
          </div>
          {isModalOpen && (
            <Modal setIsModalOpen={setIsModalOpen} onSuccess={onSuccess} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Page;
