"use client";
import { useState, useEffect } from "react";
import Card from "../../../../components/admin/stories/contests/StoryCard";
import StoryNav from "@/app/components/admin/stories/StoryNav";
import ProtectedRoute from "@/app/utils/ProtectedRoute";
import { TStory } from "@/app/utils/types";
import { axiosInstance } from "@/app/utils/config/axios";

const Page = ({ params }: { params: { id: string } }) => {
  const [stories, setStories] = useState<TStory[]>([]);
  const contest_id = params.id;
  const AxiosIns = axiosInstance("");
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await AxiosIns.get(
          `/stories/contest/prompt?contest_id=${params.id}&sortKey=score`
        );
        setStories(response.data);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchStories();
  }, []);

  // Filter stories based on contest ID
  const filteredStories = stories.filter(
    (story) => story.contest?._id === contest_id
  );

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-screen">
        <div className="flex h-screen">
          <div className="flex-1 flex flex-col p-6 space-y-6">
            <StoryNav />
            <div className="bg-white shadow-sm p-4 rounded-lg border w-5/6 border-gray-200 space-y-4">
              {filteredStories.map((story) => (
                <Card key={story._id} contest={story} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Page;
