"use client";
import { useState, useEffect, ChangeEvent } from "react";
import Card from "../../components/admin/practice/CardAdd";
import Modal from "../../components/admin/practice/Modal";
import ProtectedRoute from "@/app/utils/ProtectedRoute";
import { TPrompt } from "@/app/utils/types";
import { axiosInstance } from "@/app/utils/config/axios";
import SearchInput from "@/app/components/SearchInput";
import { useCustomToast } from "@/app/utils/hooks/useToast";

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prompts, setPrompts] = useState<TPrompt[]>([]);
  const AxiosIns = axiosInstance("");
  const [refetch, setRefetch] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [practiseLimit, setPractiseLimit] = useState(5);
  const toast = useCustomToast();
  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchCurrentPractiseLimit();
  }, []);

  const fetchPrompts = async () => {
    try {
      const response = await AxiosIns.get(
        `/prompts/practice-prompts?search=${searchInput}`,
        {
          params: {
            page: 1,
            perPage: 1000, // Set a high number to fetch all items
          },
        }
      );
      setPrompts(response.data.data);
    } catch (error) {
      console.error("Error fetching prompts:", error);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, [refetch, searchInput]);

  const onSuccess = () => {
    setRefetch(!refetch);
  };

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const fetchCurrentPractiseLimit = async () => {
    try {
      const { data } = await AxiosIns.get("/auth/users/practiseLimit");
      setPractiseLimit(data.limit);
    } catch (error) {
      console.log(error);
    }
  };

  const updatePractiseLimit = async () => {
    try {
      const res = await AxiosIns.post("/auth/users/practiseLimit", { limit: practiseLimit });
      if (res.status === 200) {
        fetchCurrentPractiseLimit();
        toast("Practise limit updated successfully", "success");
      }
    } catch (error) {
      console.log(error);
      toast("Failed to update practise limit", "success");
    }
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
                <div className="text-xl font-semibold text-gray-700 font-unkempt">
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
              <div className="flex items-center gap-x-2 my-4">
                <p className="text-xl font-semibold text-gray-700 font-unkempt">
                  Set practise limit
                </p>
                <input
                  type="input"
                  className="w-20 p-2 border border-gray-300 rounded-lg"
                  value={practiseLimit}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPractiseLimit(+e.target.value)
                  }
                />
                <button
                  className="bg-custom-yellow text-black border border-black px-4 py-2 rounded-lg font-unkempt"
                  onClick={updatePractiseLimit}
                >
                  Update
                </button>
              </div>
              <SearchInput
                onChange={handleSearchInputChange}
                value={searchInput}
                placeholder="Search for practise prompts"
              />
              <div className="mt-4 space-y-4 ">
                {prompts.map((prompt) => (
                  <Card
                    key={prompt._id}
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
