'use client'
import { useState, useEffect } from "react";
import Card from "../../components/admin/stories/StoryTitleCard";
import StoryNav from "@/app/components/admin/stories/StoryNav";
import ProtectedRoute from "@/app/utils/ProtectedRoute";
import { axiosInstance } from "@/app/utils/config/axios";
import { toast } from "react-toastify";
import { TUser } from "@/app/utils/types";

// Define the Story interface
interface Story {
  _id: string;
  user: TUser;
  title: string;
  content: string;
  wordCount: number;
  submissionDateTime: string;
  prompt: string;
  storyType: string;
  correctionSummary: string;
  corrections: string;
  score: number;
}

const Page: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [error, setError] = useState<string | null>(null);
  const AxiosIns = axiosInstance("");

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await AxiosIns.get<Story[]>("/stories");
        setStories(response.data.reverse());
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchStories();
  }, []);

  const onDeleteSuccess = async () => {
    try {
      const response = await AxiosIns.get<Story[]>("/stories");
      setStories(response.data.reverse());
    } catch (error) {
      console.error('Error fetching stories after deletion:', error);
      toast.error('Failed to refresh stories after deletion.');
    }
  };



  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-screen">
        <div className="flex h-screen">
          <div className="flex-1 flex flex-col p-6 space-y-6">
            <StoryNav />
            <div className="flex justify-between items-center w-5/6 bg-white shadow-sm p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-semibold text-gray-700">All Stories</div>
            </div>
            <div className="bg-white shadow-sm p-4 rounded-lg border border-gray-200 space-y-4">
              {stories.map((story) => (
                <Card
                  key={story._id}
                  _id={story._id}
                  user={story.user}
                  title={story.title}
                  content={story.content}
                  wordCount={story.wordCount}
                  submissionDateTime={story.submissionDateTime}
                  prompt={story.prompt}
                  storyType={story.storyType}
                  correctionSummary={story.correctionSummary}
                  corrections={story.corrections}
                  score={story.score}
                  onDeleteSuccess={onDeleteSuccess} // Pass onDeleteSuccess as prop
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Page;
