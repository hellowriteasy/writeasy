"use client";
import { useState, useEffect } from "react";
import { Params, TContest } from "@/app/utils/types"; // Make sure to import necessary types
import { axiosInstance } from "@/app/utils/config/axios";
import Card from "../../../components/admin/contests/CardUpdate";
import Modal from "@/app/components/admin/contests/ContestModal";
import ProtectedRoute from "@/app/utils/ProtectedRoute";
import { TPromptAdd } from "../edit/page";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCustomToast } from "@/app/utils/hooks/useToast";

interface PageProps {
  params: Params;
}

const Page = ({ params }: PageProps) => {
  const { _id } = params;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [promptCards, setPromptCards] = useState<TPromptAdd[]>([]);
  const [contest, setContest] = useState<TContest | null>(null);
  const [contestDetails, setContestDetails] = useState({
    promptPublishDate: new Date(),
    submissionDeadline: new Date(),
    topWritingPublishDate: new Date(),
    description: "",
    contestTheme: "",
    comparisionCount: 0,
    topWritingPercent: 50,
  });

  const AxiosIns = axiosInstance("");
  const toast = useCustomToast();

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await AxiosIns.get(`/contests/${_id}`);
        const contest: TContest = response.data;
        setContest(contest);
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
          comparisionCount: contest.comparisionCount || 0,
          contestTheme: contest.contestTheme,
          topWritingPercent: contest.topWritingPercent || 50,
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
      await AxiosIns.put(`/contests/${_id}`, {
        prompts: promptCards.map((prompt) => prompt._id),
        contestTheme: contestDetails.contestTheme,
        submissionDeadline: contestDetails.submissionDeadline,
        promptPublishDate: contestDetails.promptPublishDate,
        topWritingPublishDate: contestDetails.topWritingPublishDate,
        comparisionCount: contestDetails.comparisionCount || undefined,
        topWritingPercent: contestDetails.topWritingPercent,
      });
      toast("Contest updated successfully", "success");
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
                {/* <input
                  type="date"
                  value={
                    contestDetails.promptPublishDate.toISOString().split("T")[0]
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "promptPublishDate",
                      new Date(e.target.value)
                    )
                  }
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                /> */}
                <DatePicker
                  dateFormat="MM/dd/yyyy h:mm aa"
                  showTimeInput
                  selected={contestDetails.promptPublishDate}
                  disabled={
                    contest
                      ? new Date(contest?.promptPublishDate) < new Date()
                      : false
                  }
                  onChange={(date) => {
                    if (!date) return;
                    handleInputChange("promptPublishDate", date);
                  }}
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

                <DatePicker
                  dateFormat="MM/dd/yyyy h:mm aa"
                  showTimeInput
                  selected={contestDetails.submissionDeadline}
                  disabled={
                    contest
                      ? new Date(contest?.submissionDeadline) < new Date()
                      : false
                  }
                  onChange={(date) => {
                    if (!date) return;
                    handleInputChange("submissionDeadline", date);
                  }}
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

                <DatePicker
                  dateFormat="MM/dd/yyyy h:mm aa"
                  showTimeInput
                  selected={contestDetails.topWritingPublishDate}
                  disabled={
                    contest
                      ? new Date(contest?.topWritingPublishDate) < new Date()
                      : false
                  }
                  onChange={(date) => {
                    if (!date) return;
                    handleInputChange("topWritingPublishDate", date);
                  }}
                />
                <i>Date to publish the top writings of a contest</i>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="deadline"
                >
                  Writing Comparision Count
                </label>
                <input
                  placeholder="Stories/2 by default"
                  type="number"
                  value={contestDetails.comparisionCount}
                  onChange={(e) =>
                    setContestDetails((prev) => ({
                      ...prev,
                      comparisionCount: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="deadline"
                >
                  Top writing stories percent
                </label>
                <input
                  placeholder="Stories/2 by default"
                  type="number"
                  value={contestDetails.topWritingPercent}
                  onChange={(e) =>
                    setContestDetails((prev) => ({
                      ...prev,
                      topWritingPercent: Number(e.target.value),
                    }))
                  }
                />
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
              {promptCards.map((prompt, index) => (
                <Card key={index} title={prompt.title} id={prompt._id} />
              ))}
              <button
                onClick={handleAddClick}
                className="bg-black text-white px-4 py-2 rounded-lg"
              >
                Add Prompt
              </button>

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
