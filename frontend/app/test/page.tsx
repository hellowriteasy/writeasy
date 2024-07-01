"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import History from "@tiptap/extension-history";
import React, { useEffect, useState } from "react";
import Paragraph from "@tiptap/extension-paragraph";
import Underline from "@tiptap/extension-underline";
import { Change, diffChars } from "diff";
function ProofreadComponent() {
  const [storyText, setStoryText] = useState("");
  const [taskType, setTaskType] = useState("grammar");
  const [responseText, setResponseText] = useState("");
  const [inputText, setInputText] = useState("");
  const getCorrectedContent = (original: string, corrected: string) => {
    original = original.replace(/<\/?p>/g, "");
    const diff: Change[] = diffChars(original, corrected);
    let text = "";
    diff.forEach((node) => {
      if (node.added) {
        text += `<u>${node.value}</u>`;
      } else if (node.removed) {
        text += `<del>${node.value}</del>`;
      } else {
        text += node.value;
      }
    });

    let stringWithoutPTags = text.replace(/<p><\/p>/g, "");
    return stringWithoutPTags;
  };
  useEffect(() => {
    handleUpdate();
  }, [responseText]);

  const handleSubmit = async () => {
    const currentContent = editor.getText();
    if (!currentContent) return;
    setInputText(currentContent);
    const response = await fetch("http://localhost:8000/api/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ storyText: currentContent, taskType: "grammer" }),
    });

    if (response.ok) {
      if (response.body === null) {
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      setResponseText(""); // Reset the response text

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setResponseText((prev) => prev + chunk);
      }
    } else {
      console.error("Failed to fetch data from the server");
    }
  };
  const editor = useEditor({
    extensions: [
      Document,
      History,
      Paragraph,
      Text,
      Bold,
      Underline,
      Italic,
      Strike,
      Code,
    ],
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose-base w-full inline-block lg:prose-lg xl:prose-2xl outline-none min-h-96",
      },
    },
    content: "hello",
    onUpdate: ({ editor }) => {
      // const textContent = editor.getText();
      // const words = textContent.split(/\s+/).filter(Boolean).length;
      // handleStoryDetailsInputChange("wordCount", words);
      // handleStoryDetailsInputChange("wordLimitExceeded", words > 1000);
    },
  }) as Editor;

  const handleUpdate = () => {
    if (editor) {
      editor.commands.setContent(
        `${getCorrectedContent(inputText, responseText)}`
      );
    }
  };
  if (!editor) {
    return <>hello</>;
  }
  return (
    <div>
      <div className=" bg-black rounded-full w-full ">
        <div className="editor bg-white p-4 rounded-3xl relative shadow-md w-full">
          <div className="menu flex gap-5 w-[100%] h-12 left-0 top-0 flex-col border border-slate-300 bg-slate-100 rounded-t-3xl absolute"></div>
          <div className={`w-[50vw] rounded-3xl  `}>
            <EditorContent
              editor={editor}
              className={`scroll-m-2 w-[100%] min-h-96 mt-10 `}
            />
          </div>
        </div>
      </div>
      <button onClick={handleSubmit}>handleSubmit</button>
    </div>
  );
}

export default ProofreadComponent;
