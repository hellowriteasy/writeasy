'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/admin/Navbar";
import Sidebar from "../../components/admin/Sidebar";
import Card from "../../components/admin/stories/StoryTitleCard";
import PracticeModal from "../../components/admin/stories/PracticeModal";
import StoryNav from "@/app/components/admin/stories/StoryNav";
import ProtectedRoute from "@/app/utils/ProtectedRoute";
// Define the Story interface
interface Story {
  _id: string;
  user: string;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get<Story[]>("http://localhost:5000/api/stories");
        setStories(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const handleAddClick = () => {          
    setIsModalOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ProtectedRoute>
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col p-6 space-y-6">
          <StoryNav />

          <div className="flex justify-between items-center w-5/6 bg-white shadow-sm p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-semibold text-gray-700">All Stories</div>
         
          </div>

          <div className="bg-white shadow-sm p-4 rounded-lg border border-gray-200 space-y-4">
            {stories.map((story) => (
              <Card
                key={story._id}
                {...story} // Spread the story props to the Card component
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