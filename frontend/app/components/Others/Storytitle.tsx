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
      <div className="flex items-center justify-between md:px-4 py-4">
        <div className="flex items-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">
            {story.title}
          </h2>
        </div>
      </div>
      <div className="w-full relative flex flex-wrap">
        {contributors.map((contributor, index) => (
          <div key={contributor._id}>
            <div
              className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 ml-${index * 2 + 2} bg-white flex items-center justify-center rounded-full border overflow-hidden`}
            >
              {contributor.profile_picture &&
              contributor.profile_picture.startsWith("https") ? (
                <img
                  className="w-full h-full object-cover"
                  src={contributor.profile_picture}
                  alt=""
                />
              ) : (
                <Image src={Logo} alt="contributor's image" />
              )}
            </div>
          </div>
        ))}
       <div>
        <h5 className=" md:left-24 pt-1 text-xs md:text-sm lg:text-base">
          Story by <span className="font-bold">{story.user?.username}</span>
        </h5>
       </div>
      </div>
      {/* Paragraph */}
      <div className="text-xs md:text-sm lg:text-base text-gray-900 ">
        {isExpanded ? story.content : previewContent}
      </div>
      {/* Read more button */}
      <div className="md:px-4 py-4 flex justify-end">
        <button
          onClick={toggleExpand}
          className="bg-black text-white py-2 md:py-3 lg:py-4 w-20 md:w-28 lg:w-36 px-3 md:px-4 lg:px-5 rounded-3xl"
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      </div>
    </div>
  );
};

export default Storytitle;
