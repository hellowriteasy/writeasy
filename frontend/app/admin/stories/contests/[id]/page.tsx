'use client';
import { useState, useEffect } from "react";
import axios from 'axios';
import Card from "../../../../components/admin/stories/contests/StoryCard";
import StoryNav from "@/app/components/admin/stories/StoryNav";
import ProtectedRoute from "@/app/utils/ProtectedRoute";

interface Story {
  _id: string;
  user: string;
  title: string;
  content: string;
  wordCount: number;
  prompt: string;
  storyType: string;
  contest: string;
  submissionDateTime: string;
}

const Page = ({ params }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/stories/top');
        setStories(response.data); 
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    fetchStories();
  }, []);

  // Filter stories based on contest ID
  const filteredStories = stories.filter(story => story.contest === params.id);

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-screen">
  
        <div className="flex h-screen">
      
          <div className="flex-1 flex flex-col p-6 space-y-6">
            <StoryNav />
            <div className="bg-white shadow-sm p-4 rounded-lg border w-5/6 border-gray-200 space-y-4">
              {filteredStories.map((story) => (
                <Card
                  key={story._id}
                  contest={story}
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
