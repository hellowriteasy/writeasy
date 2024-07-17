"use client";
import { useState, useEffect } from "react";
import { Params,  TContest } from "@/app/utils/types"; // Make sure to import necessary types
import { axiosInstance } from "@/app/utils/config/axios";
import Card from "../../../components/admin/contests/CardUpdate";
import Modal from "@/app/components/admin/contests/ContestModal";
import ProtectedRoute from "@/app/utils/ProtectedRoute";
import { TPromptAdd } from "../edit/page";
interface PageProps {
  params: Params;
}

const Page = ({ params }: PageProps) => {
  const { _id } = params;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [promptCards, setPromptCards] = useState<TPromptAdd[]>([]);
  const [contestDetails, setContestDetails] = useState({
    promptPublishDate: new Date(),
    submissionDeadline: new Date(),
    topWritingPublishDate: new Date(),
    description: "",
    contestTheme: "",
  });
  const AxiosIns = axiosInstance("");

  useEffect(() => {
    const fetchContest = async () => {
      try {

        const response = await AxiosIns.get(`/contests/${_id}`);
        const contest: TContest = response.data;

        setPromptCards(
          contest.prompts.map((prompt) => ({
            _id: prompt._id,
            promptText: prompt.title,
            title: prompt.title,
          }))
        );

        // Format dates from fetched data
        setContestDetails({
          promptPublishDate: new Date(contest.promptPublishDate),
          submissionDeadline: new Date(contest.submissionDeadline),
          topWritingPublishDate: new Date(contest.topWritingPublishDate),
          description: contest.description,
          contestTheme: contest.contestTheme,
        });

     
      } catch (error) {
        console.error("Error fetching contest:", error);
     
      }
    };

    if (_id) {
      fetchContest();
    }
  }, [_id]);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleSubmitContest = async () => {
    try {
  
      const response = await AxiosIns.put(`/contests/${_id}`, {
        prompts: promptCards.map((prompt) => prompt._id),
        contestTheme: contestDetails.contestTheme,
        submissionDeadline: contestDetails.submissionDeadline,
        
      });

      // Handle success state if necessary
    } catch (error) {
      console.error("Error updating contest:", error);
    } finally {
    
    }
  };

  const handlePromptAdd = (prompt: TPromptAdd) => {
    setPromptCards([...promptCards, prompt]);
  };

  const handleInputChange = (name: string, value: string | Date) => {
    // Validation logic if needed
    setContestDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <ProtectedRoute>
      <div>
       
        
          <div className="flex h-screen">
            <div className="flex-1 p-6">
              <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="deadline"
                  >
                    Prompt Publish Date
                  </label>
                  <input
                    type="date"
                    value={contestDetails.promptPublishDate.toISOString().split("T")[0]}
                    onChange={(e) =>
                      handleInputChange("promptPublishDate", new Date(e.target.value))
                    }
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <i>Time to publish the prompt in a contest</i>
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="deadline"
                  >
                    Submission Deadline
                  </label>
                  <input
                    type="date"
                    value={contestDetails.submissionDeadline.toISOString().split("T")[0]}
                    onChange={(e) =>
                      handleInputChange("submissionDeadline", new Date(e.target.value))
                    }
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <i>Deadline for story submission / contest end time</i>
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="deadline"
                  >
                    Top writing publish date
                  </label>
                  <input
                    type="date"
                    value={contestDetails.topWritingPublishDate.toISOString().split("T")[0]}
                    onChange={(e) =>
                      handleInputChange("topWritingPublishDate", new Date(e.target.value))
                    }
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <i>Date to publish the top writings of a contest</i>
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="theme"
                  >
                    Theme
                  </label>
                  <input
                    id="theme"
                    type="text"
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={contestDetails.contestTheme}
                    onChange={(e) =>
                      handleInputChange("contestTheme", e.target.value)
                    }
                  />
                </div>

                <button
                  onClick={handleAddClick}
                  className="bg-black text-white px-4 py-2 rounded-lg"
                >
                  Add Prompt
                </button>
                {promptCards.map((prompt, index) => (
                  <Card
                    key={index}
                    title={prompt.title}
                    id={prompt._id}
                
                  />
                ))}
                <button
                  onClick={handleSubmitContest}
                  className="bg-black text-white px-4 py-2 rounded-lg  mt-4 w-full"
                >
                  Submit Contest
                </button>
              </div>
            </div>
          </div>
        
        {isModalOpen && (
          <Modal
            setIsModalOpen={setIsModalOpen}
            onAddPrompt={handlePromptAdd}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Page;
