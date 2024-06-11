'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import cloud2 from '@/public/Game/cloud2.svg';
import shootingstar from '@/public/Game/shotting_star.svg';
import Storytitle from '@/app/components/Others/Storytitle';
import Pagination from '@/app/components/Pagination';
import axios from "axios";
import StoryEditor from '../[_id]/play/page';
import { TStory } from '@/app/utils/types';


interface PageProps {
  params: {
    _id: string;
  };
}

const Page: React.FC<PageProps> = ({ params }) => {
  const [stories, setStories] = useState<TStory[]>([]);
  const [filteredStories, setFilteredStories] = useState<TStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState<TStory | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/stories");
        const fetchedStories: TStory[] = response.data;
        setStories(fetchedStories);
        setLoading(false);
        
      } catch (error) {
        console.error("Error fetching stories:", error);
        setLoading(false);
      }
    };

    fetchStories();
  }, []);
  console.log("stories",stories)
  
  useEffect(() => {
    if (!loading) {
      const filtered = stories.filter(story => story.storyType === 'game' && story.prompt === params._id);
      setFilteredStories(filtered);
    }
  }, [loading, stories, params._id]);

  const handleReadMore = (story: TStory) => {
    setSelectedStory(story);
    setIsCreating(false);
  };

  const handleCreateStory = () => {
    setSelectedStory(null);
    setIsCreating(true);
  };

  if (loading) return <p>Loading...</p>;

  if (selectedStory || isCreating) {
    return <StoryEditor id={params._id}  />;
  }

  console.log("prompt",filteredStories)
  return (
    <div className="w-screen font-comic h-[1750px] flex flex-col">
      <div className="h-80 border-game relative w-full flex items-center flex-col">
        <div className="absolute left-0">
          <Image className="w-[9vw]" src={shootingstar} alt="shootingstar" />
        </div>
        <div className="w-4/5 font-comic flex flex-col gap-10 mt-20">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-comic">
            Setting text of this story
          </h1>
          <button
            onClick={handleCreateStory}
            className="w-full bg-black hover:opacity-80 text-center text-white rounded-3xl border h-20 text-xl md:text-2xl lg:text-3xl xl:text-4xl"
          >
            Create your Story
          </button>
        </div>
        <div className="absolute right-5 sm-hide top-60">
          <Image className="w-[12vw]" src={cloud2} alt="cloud2" />
        </div>
      </div>
      <div className="w-screen flex flex-col items-center">
        <div className="w-4/5">
          <h1 className="font-bold text-7xl pt-5 font-comic">Stories</h1>
          <div className="mt-4 flex flex-col gap-8">
            {filteredStories.map((story: TStory, index) => (
              <Storytitle
                key={index}
                story={story}
                onReadMore={() => handleReadMore(story)}
              />
            ))}
          </div>
          <div className="w-full ms-28 mt-10">
            <Pagination />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
