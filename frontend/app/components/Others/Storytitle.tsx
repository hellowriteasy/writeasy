import React, { useState } from "react";
import Image from "next/image";
import { TStory } from "@/app/utils/types";
import Logo from "@/public/Landingpage-img/logo.svg";

interface StoryProps {
  story: TStory;
  onReadMore: () => void;
}

const Storytitle: React.FC<StoryProps> = ({ story }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getPreviewContent = (content: string, wordLimit: number) => {
    if (!content) return "";
    const words = content.split(" ");
    if (words.length <= wordLimit) return content;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const previewContent = getPreviewContent(story.content, 50);
  const contributors = story
    ? Array.from(new Array(...story?.contributors, story?.user))
    : [];
  return (
    <div className="w-full mx-auto border-2 border-gray-200 px-5 rounded-3xl overflow-hidden">
      {/* Card title and image */}
      <div className="flex items-center justify-between md:px py-4">
        <div className="flex items-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            {story.title}
          </h2>
        </div>
      </div>
      <div className="w-full relative flex h-12">
        {contributors.map((contributor, index) => (
          <div key={contributor._id}>
            <div
              className={`w-10 h-10 left-${
                index * 3 + 3
              } bg-white flex items-center justify-center rounded-full border overflow-hidden`}
            >
              {contributor.profile_picture &&
              contributor.profile_picture.startsWith("https") ? (
                <img
                  className="w-full h-full"
                  src={contributor.profile_picture}
                  alt=""
                />
              ) : (
                <Image src={Logo} alt="contributor's image" />
              )}
            </div>
          </div>
        ))}

        <h5 className="absolute left-24 pt-2 text-xs md:text-sm lg:text-base">
          Story by <span className="font-bold">{story.user?.username}</span>
        </h5>
      </div>
      {/* Paragraph */}
      <div className="text-xs md:text-sm lg:text-base text-gray-900 ">
        {isExpanded ? story.content : previewContent}
      </div>
      {/* Read more button */}
      <div className="md:px-6 py-4 flex justify-end">
        <button
          onClick={toggleExpand}
          className="bg-black text-white py-2 w-24 md:w-32 lg:w-40 h-10 md:h-12 px-4 rounded-3xl"
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      </div>
    </div>
  );
};

export default Storytitle;
