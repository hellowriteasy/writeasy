"use client";
import { useState } from "react";
import axios from "axios";

import Card from "../../../components/admin/contests/CardAdd";
import Modal from "@/app/components/admin/contests/ContestModal";
import ProtectedRoute from "@/app/utils/ProtectedRoute";
import { useCustomToast } from "@/app/utils/hooks/useToast";
import { axiosInstance } from "@/app/utils/config/axios";

interface Prompt {
  _id: string;
  title: string;
  promptCategories: string[];
  promptText: string;
}

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [promptCards, setPromptCards] = useState<Prompt[]>([]);
  const [contestDetails, setContestDetails] = useState({
    promptPublishDate: new Date(),
    submissionDeadline: new Date(),
    topWritingPublishDate: new Date(),
    description: "",
    contestTheme: "",
  });

  const toast = useCustomToast();
  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleSubmitContest = async () => {
    // Validation for deadline
    // const currentDate = new Date().toISOString().split("T")[0];
    // if (deadline < currentDate) {
    //   setError("Deadline cannot be earlier than today.");
    //   return;
    // }
  const AxiosIns=axiosInstance("")
    try {
      const { status } = await AxiosIns.post(
      "/api/contests",
        {
          prompts: promptCards.map((prompt) => prompt._id),
          ...contestDetails,
        }
      );
      if (status === 201) {
        setContestDetails((_) => ({
          submissionDeadline: new Date(),
          promptPublishDate: new Date(),
          topWritingPublishDate: new Date(),
          description: "",
          contestTheme: "",
        }));
        toast("Contest created successfully.", "success");
      }
    } catch (error) {
      toast("Faield to create contest.", "error");
    }
  };

  const handleInputChange = (name: string, value: string | Date) => {
    // Validate the entered dates
    // Validate the entered dates
    let warning = "";
    if (name === "submissionDeadline") {
      // Ensure submissionDeadline is before topWritingPublishDate
      if (value >= contestDetails.topWritingPublishDate) {
        warning =
          "Submission deadline must be before top writing publish date.";
      }
    } else if (name === "promptPublishDate") {
      // Ensure promptPublishDate is before submissionDeadline
      if (value >= contestDetails.submissionDeadline) {
        warning = "Prompt publish date must be before submission deadline.";
      }
    } else if (name === "topWritingPublishDate") {
      // Ensure topWritingPublishDate is after submissionDeadline
      if (value <= contestDetails.submissionDeadline) {
        warning = "Top writing publish date must be after submission deadline.";
      }
    }
    if (warning) {
      return toast(warning, "warning");
    }

    setContestDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePromptAdd = (prompt: Prompt) => {
    setPromptCards([...promptCards, prompt]);
  };

  console.log(contestDetails);

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
                  Submission Deadline
                </label>
                <input
                  id="submissionDeadline"
                  name="submissionDeadline"
                  type="date"
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e) =>
                    handleInputChange(e.target.name, e.target.value)
                  }
                  value={contestDetails.submissionDeadline}
                />
                <i>Deadline for story submission / contest end time</i>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="deadline"
                >
                  Prompt Publish Date
                </label>
                <input
                  id="deadline"
                  type="date"
                  name="promptPublishDate"
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e) =>
                    handleInputChange(e.target.name, e.target.value)
                  }
                  value={contestDetails.promptPublishDate}
                />
                <i>Time to publish the prompt in a contest</i>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="deadline"
                >
                  Top writing publish date
                </label>
                <input
                  id="promptPublishDate"
                  type="date"
                  name="topWritingPublishDate"
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e) =>
                    handleInputChange(e.target.name, e.target.value)
                  }
                  value={contestDetails.topWritingPublishDate}
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
                  name="contestTheme"
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e) =>
                    handleInputChange(e.target.name, e.target.value)
                  }
                  value={contestDetails.contestTheme}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="theme"
                >
                  Description
                </label>
                <input
                  id="theme"
                  type="text"
                  name="description"
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e) =>
                    handleInputChange(e.target.name, e.target.value)
                  }
                  value={contestDetails.description}
                />
              </div>

              {/* {error && <div className="text-red-500 mb-4">{error}</div>} */}

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
                  type={prompt.promptCategories.join(", ")}
                />
              ))}
              <button
                onClick={handleSubmitContest}
                className="bg-black text-white px-4 py-2 rounded-lg mt-4 w-full"
              >
                Add contests
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
