"use client";
import { axiosInstance } from "@/app/utils/config/axios";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid"; // Import UUID library

type Tstory = {
  _id: string;
  title: string;
  content: string;
};

const TopWritings = () => {
  const [stories, setStories] = useState<Tstory[]>([]);
  const [topStories, setTopStories] = useState<Record<string,string>>({});
  const [storyTitle, setStoryTitle] = useState("");

  const axiosIns = axiosInstance("");

  const handleAddStory = () => {
    setStories((prev) => [
      ...prev,
      {
        _id: uuidv4().split("-").join(""), // Assign a unique ID to each story
        title: `Story ${prev.length + 1}`,
        content: "",
      },
    ]);
  };

  const handleRemoveStory = (index: number) => {
    setStories((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setStories([]);
    setTopStories({});
    setStoryTitle("");
  };

  const handleChangeInput = (name: string, value: string, index: number) => {
    if (name === "title") {
      const isDuplicate = stories.some(
        (story, i) => story.title === value && i !== index
      );

      if (isDuplicate) {
        alert("This title already exists. Please choose a different title.");
        return; // Prevent the state from being updated
      }
    }

    const updatedStories = stories.map((story, i) =>
      i === index ? { ...story, [name]: value } : story
    );
    setStories(updatedStories);
  };

  const handleGetStories = async () => {
    if (!storyTitle) {
      alert("Please enter a title.");
      return;
    }
    if (stories.length < 2) {
      alert("Stories must be at least 2");
      return;
    }

    const cleanStories = stories.filter((story) => story.content);

    try {
      const { data } = await axiosIns.post("/stories/calculate-top-writings", {
        title: storyTitle,
        stories: cleanStories,
      });
      if (data) {
        setTopStories(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

 const filteredTopStories = stories.filter((story) =>
   topStories.hasOwnProperty(story._id.split("-").join(""))
 );

  return (
    <div className="p-5 flex flex-col gap-y-3 items-start">
      <div className="flex flex-col items-center content-center">
        <h1 className="font-poppins text-3xl font-bold">
          Get Top Writings From Your Stories
        </h1>
      </div>

      {/* Display Top Stories */}
      {filteredTopStories.length > 0 && (
        <div className="w-full mb-4">
          <h2 className="font-poppins text-2xl font-bold">Top Stories</h2>
          <ul className="list-disc ml-5">
            {filteredTopStories.map((story) => (
              <li key={story._id} className="font-poppins text-xl">
                {story.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="w-full">
        <input
          type="text"
          placeholder="Title of story"
          value={storyTitle}
          onChange={(e) => setStoryTitle(e.target.value)}
        />
        <div className="w-full flex flex-col gap-y-3">
          {stories.map((story, index) => (
            <div
              key={story._id}
              className="shadow-md p-2 rounded-md bg-white flex flex-col gap-y-3"
            >
              <div className="flex justify-between items-center">
                <input
                  className="font-poppins text-xl font-bold"
                  value={story.title}
                  onChange={(e) =>
                    handleChangeInput("title", e.target.value, index)
                  }
                />
                <button
                  className="text-red-500"
                  onClick={() => handleRemoveStory(index)}
                >
                  Remove
                </button>
              </div>

              <textarea
                className="w-[100%]"
                placeholder="Write Here"
                value={story.content}
                onChange={(e) =>
                  handleChangeInput("content", e.target.value, index)
                }
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-x-3">
        <button
          className="bg-black text-white rounded-full p-3"
          onClick={handleAddStory}
        >
          Add new story
        </button>
        <button
          className="bg-black text-white rounded-full p-3"
          onClick={handleGetStories}
        >
          Get top 20% writings
        </button>
        <button
          className="bg-gray-500 text-white rounded-full p-3"
          onClick={handleClearAll}
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default TopWritings;
