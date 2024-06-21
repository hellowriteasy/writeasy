"use client";
import React, { useState } from "react";
import { usePDF } from "react-to-pdf";
import { diffChars } from "diff";
import StoryEditor from "./Editor"; // Adjust the import path as necessary
import { TUser } from "@/app/utils/types";
import { axiosInstance } from "@/app/utils/config/axios";
import { useRouter } from "next/navigation";

interface CardProps {
  id: string;
  title: string;
  description?: string;
  corrections: string;
  type: string;
  promptTitle: string;
  contestTitle: string;
  contributors: TUser[];
  prompt_id?: string;
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  corrections,
  description = "",
  type,
  contestTitle,
  promptTitle,
  prompt_id,
  contributors,
}) => {
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const toggleDescription = () => setShowFullDescription(!showFullDescription);
  const AxiosIns = axiosInstance("");
  const previewWords = 50;
  const descriptionText = description || "";
  const descriptionWords = descriptionText.split(" ");
  const truncatedDescription =
    descriptionWords.length > previewWords
      ? descriptionWords.slice(0, previewWords).join(" ") + "..."
      : descriptionText;
  const router = useRouter();
  const deleteClick = () => {
    AxiosIns.delete(`/stories/${id}`)
      .then(() => {
        console.log("Item deleted successfully!");
        // Optionally perform any other UI updates upon successful deletion
      })
      .catch((error) => {
        console.error("Failed to delete item.", error);
        // Optionally handle and log errors
      });
  };

  const compareSentences = (description = "", corrections = "") => {
    if (!description) {
      return (
        <span style={{ color: "red", backgroundColor: "lightcoral" }}>
          No original description provided.
        </span>
      );
    }

    if (!corrections) {
      return (
        <span style={{ color: "green", backgroundColor: "lightgreen" }}>
          No corrections provided.
        </span>
      );
    }

    const diff = diffChars(description, corrections);
    return diff.map((part, index) => {
      const style = {
        backgroundColor: part.added
          ? "lightgreen"
          : part.removed
          ? "lightcoral"
          : "transparent",
        textDecoration: part.removed ? "line-through" : "none",
        color: part.added ? "green" : part.removed ? "red" : "black",
      };
      return (
        <span key={index} style={style}>
          {part.value}
        </span>
      );
    });
  };

  if (showEditor) {
    return (
      <StoryEditor
        id={id}
        Content={descriptionText}
        Title={title}
        contributors={contributors}
      />
    );
  }

  return (
    <div className="bg-white w-full sm:w-3/4 border-2 border-slate-300 shadow-sm rounded-3xl p-6 transition-all duration-300">
      <div ref={targetRef} className="flex flex-col mb-4">
        <h1 className="text-2xl font-bold mb-4">
          {contestTitle ? `${contestTitle} > ` : ""} {promptTitle}
        </h1>
        <div>
          <h2 className=" py-2 font-bold ">{title}</h2>
          <p
            className={`text-gray-700   transition-all duration-300 ${
              showFullDescription ? "max-h-full" : "max-h-20 overflow-hidden"
            }`}
          >
            {showFullDescription ? descriptionText : truncatedDescription}
          </p>
          {showDiff && (
            <div className="mt-4">
              <h3 className="px-5 text-lg font-semibold">Corrections:</h3>
              <p className="py-4 px-5">
                {compareSentences(description, corrections)}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 mt-4">
        <button
          onClick={() => {
            setShowFullDescription(true);
            toPDF();
          }}
          className="bg-white border-2 rounded-2xl border-slate-700 text-black px-4 py-2"
        >
          PDF
        </button>
        {type === "game" && (
          <button
            onClick={() => router.push(`/Games/${prompt_id}/play`)}
            className="bg-white border-2 rounded-2xl border-slate-700 text-black px-4 py-2"
          >
            Contribute
          </button>
        )}
        <button
          onClick={() => setShowDiff(!showDiff)}
          className="bg-white border-2 rounded-2xl border-slate-700 text-black px-4 py-2"
        >
          {showDiff ? "Original" : "Marked"}
        </button>
        <button
          onClick={deleteClick}
          className="bg-white border-2 rounded-2xl border-slate-700 text-black px-4 py-2"
        >
          Delete
        </button>
        <button
          onClick={toggleDescription}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {showFullDescription ? "Show Less" : "Read More"}
        </button>
      </div>
    </div>
  );
};

export default Card;
