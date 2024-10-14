import React from "react";

const EditorWordCount = ({
  characters,
  limit,
  words,
}: {
  limit: number;
  words: number;
  characters: number;
}) => {
  return (
    <div
      className={`character-count self-center my-2 flex flex-col items-center ${
        characters === limit ? "character-count--warning" : ""
      }`}
    >
      <p>
        {characters} characters , {words} words{" "}
      </p>
      <br />
    </div>
  );
};

export default EditorWordCount;
