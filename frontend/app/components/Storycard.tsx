import React, { useState } from "react";
import Image from "next/image";
import mainstar from "@/public/others/main_star.svg";
import Logo from "@/public/Landingpage-img/logo.svg";

interface StorycardProps {
  title: string;
  content: string;
  corrections: string;
  username: string;
  email: string;
  profile_image?: string;
}

const Storycard: React.FC<StorycardProps> = ({
  title,
  content,
  corrections,
  username,
  email,
  profile_image,
}) => {
  const [showFullContent, setShowFullContent] = useState(false);

  const getShortContent = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  const wordLimit = 75;


  return (
    <div className="relative my-6">
      <div className="w-11/12 mx-auto border-2 font-comic border-gray-300 bg-white rounded-2xl h-[fit-content] overflow-hidden">
        <div className="flex items-center my-8 justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center">
            <div className="mr-4 rounded-full border border-gray-400 h-12 w-12 overflow-hidden flex items-center justify-center">
              {profile_image && profile_image.startsWith("https") ? (
                <img className="w-full h-full" src={profile_image} alt="" />
              ) : (
                <Image src={Logo} alt="Image" width={50} height={50} />
              )}
            </div>
            <div>
              <h1 className="text-base sm:text-lg md:text-xl">{username}</h1>
              {/* <p className="text-[2vw] sm:text-sm md:text-lg">{email}</p> */}
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 flex flex-col gap-y-2">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">{title}</h2>
          <p className="text-sm sm:text-md md:text-lg text-gray-900">
            {showFullContent ? content : getShortContent(content, wordLimit)}
          </p>
        </div>
        {showFullContent ?(
          <div className="px-4 sm:px-6 py-4 flex justify-end">
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="bg-black text-white py-2 px-4 rounded-3xl"
            >
              {showFullContent ? "Show less" : "Read more"}
            </button>
          </div>
        ): (<div className="py-4"></div>)}
      </div>
    </div>
  );
};

export default Storycard;
