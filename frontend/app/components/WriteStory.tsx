"use client";
import React, { useCallback, useState, useEffect } from "react";
import classNames from "classnames";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import History from "@tiptap/extension-history";
import * as Icons from "./Icons";
import { diffChars, Change } from "diff";
import usePdfStore from "@/app/store/usePDFStore";
import { usePDF } from "react-to-pdf";
import PDF from "./PDF";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthStore from "../store/useAuthStore";
import { axiosInstance } from "../utils/config/axios";
import { TTaskType } from "../utils/types";

// const Page = ({
//   inputText,
//   corrected,
// }: {
//   inputText: string;
//   corrected: string;
// }) => {
//   const [improved, setImproved] = useState<React.ReactNode[]>([]);

//   const compareSentences = (
//     original: string,
//     corrected: string
//   ): React.ReactNode[] => {
//     original = original.replace(/<\/?p>/g, "");
//     corrected = corrected.replace(/<\/?p>/g, "");

//     const diff: Change[] = diffChars(original, corrected);
//     const result: React.ReactNode[] = [];

//     diff.forEach((part: Change, index: number) => {
//       let style: React.CSSProperties = {};
//       if (part.added) {
//         style = {
//           color: "green",
//           backgroundColor: "lightgreen",
//           textDecoration: "none",
//         };
//       } else if (part.removed) {
//         style = {
//           color: "red",
//           backgroundColor: "lightcoral",
//           textDecoration: "line-through",
//         };
//       } else {
//         style = {
//           color: "black",
//           backgroundColor: "transparent",
//           textDecoration: "none",
//         };
//       }

//       const span: React.ReactElement = (
//         <div key={index} style={style}>
//           {part.value}
//         </div>
//       );
//       result.push(span);
//     });

//     return result;
//   };

//   useEffect(() => {
//     setImproved(compareSentences(inputText, corrected));
//   }, [inputText, corrected]);

//   return <div className="mt-4">{improved}</div>;
// };

// type TWriteEasyFeature = "improve" | "grammer" | "rewrite";

// const AiFeatureTextMapping = {
//   improve: "Proofread this improving clarity and flow",
//   grammer: "Proofread this but only fix grammar",
//   rewrite: "Rewrite this improving clarity and flow",
// } as Record<TWriteEasyFeature, string>;

interface SimpleEditorProps {
  triggerGrammarCheck: any;
  taskType: TTaskType | string;
  title: string;
  handleRemoveActiveTaskType: () => void;
  Userid: string;
  _id: string;
  type: string;
  wordcount?: number;
  hasSaved: boolean;
  setHasSaved: React.Dispatch<React.SetStateAction<boolean>>;
  setTriggerGrammarCheck: React.Dispatch<React.SetStateAction<boolean>>;
}
type THandleClickFeature = (
  type: TTaskType|string,
  event: React.MouseEvent<HTMLButtonElement> | MouseEvent
) => void;

export function SimpleEditor({
  triggerGrammarCheck,
  taskType,
  title,
  _id,
  handleRemoveActiveTaskType,
  setTriggerGrammarCheck,
  hasSaved,
  setHasSaved,
}: SimpleEditorProps) {
  const [inputText, setInputText] = useState(""); // State to hold input text
  const [correctedText, setCorrectedText] = useState("");
  const [copied, setCopied] = useState(false); // State to track if text is copied
  const [isLoading, setIsLoading] = useState(false);
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const setStoredFunction = usePdfStore((state) => state.setPdfExportFunction);
  const pdfExportFunction = usePdfStore((state) => state.pdfExportFunction);

  useEffect(() => {
    setStoredFunction(toPDF);
  }, [toPDF, setStoredFunction]);

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

  // const compareSentences = (
  //   original: string,
  //   corrected: string
  // ): React.ReactNode[] => {
  //   console.log("debug  2 comparing");
  //   const diff: Change[] = diffChars(original, corrected);
  //   const result: React.ReactNode[] = [];

  //   diff.forEach((part: Change, index: number) => {
  //     let style: React.CSSProperties = {};

  //     if (part.added) {
  //       style = {
  //         color: "green",
  //         backgroundColor: "lightgreen",
  //         textDecoration: "underline",
  //         height: "40px",
  //       };
  //     } else if (part.removed) {
  //       style = {
  //         color: "red",
  //         backgroundColor: "lightcoral",
  //         height: "40px",
  //       };
  //     } else {
  //       style = {
  //         color: "black",
  //         backgroundColor: "transparent",
  //         textDecoration: "none",
  //         height: "40px",
  //       };
  //     }

  //     result.push(
  //       <div key={index} style={style}>
  //         {part.value}
  //       </div>
  //     );
  //   });

  //   return result;
  // };

  useEffect(() => {
    handleUpdate();
  }, [correctedText]);

  const [wordCount, setWordCount] = useState(0);
  const [wordLimitExceeded, setWordLimitExceeded] = useState(false);
  const { token } = useAuthStore();
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
          "prose dark:prose-invert prose-sm sm:prose-base w-full inline-block  lg:prose-lg xl:prose-2xl outline-none  min-h-[30vw]",
      },
    },
    onUpdate: ({ editor }) => {
      const textContent = editor.getText();
      const words = textContent.split(/\s+/).filter(Boolean).length;
      setWordCount(words);
      setWordLimitExceeded(words > 1000);
      

    },
  }) as Editor;

  const handleExport = () => {
    toPDF();
  };
  console.log("debug 1", triggerGrammarCheck, hasSaved);
  useEffect(() => {
    if (!triggerGrammarCheck && !hasSaved) return;
    handleClickFeature(taskType, new MouseEvent("click"));
  }, [triggerGrammarCheck, hasSaved]);

  const userId = useAuthStore((state) => state.userId);
  const AxiosIns = axiosInstance(token || "");

  const handleClickFeature: THandleClickFeature = async (type, event) => {
    event.preventDefault();
    try {
      const currentContent = editor.getText();

      if (!title || !currentContent) {
        toast.warn("Please enter both title and content before submitting.");
        return;
      }
      if (wordLimitExceeded) {
        toast.error("Word limit exceeded. Please reduce the number of words.");
        return;
      }
      const payload = {
        userId: userId,
        title: title,
        content: currentContent,
        taskType: type,
        storyType: "practice",
        prompt: _id,
        hasSaved,
      };
      setIsLoading(true);
      const { data, status } = await AxiosIns.post("stories/score", payload);
      setIsLoading(false);
      toast.success("Story saved succesfully");
      
      setInputText(currentContent);
      console.log("debug 01", data.corrections);
      setCorrectedText(data.corrections);
      setCopied(false);
      setHasSaved(false);
      setTriggerGrammarCheck(false);
    } catch (error) {
      setIsLoading(false); 
      setTriggerGrammarCheck(false);
      setHasSaved(false);
      toast.error("An error occurred while checking grammar.");
    }
  };

  const handleAcceptAll = () => {
    if (editor) {
      editor.commands.setContent(`${correctedText}`);
    }
  };

  const handleReject = () => {
    if (editor) {
      editor.commands.setContent(`${inputText}`);
    }
  };

  const handleUpdate = () => {
    console.log("debug 4 updating editor ", correctedText);
    if (editor) {
      editor.commands.setContent(
        `${getCorrectedContent(inputText, correctedText)}`
      );
    }
  };

  const toggleBold = useCallback(() => {
    editor.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor.chain().focus().toggleUnderline().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor.chain().focus().toggleStrike().run();
  }, [editor]);

  const toggleCode = useCallback(() => {
    editor.chain().focus().toggleCode().run();
  }, [editor]);

  const handleCopy = () => {
    navigator.clipboard.writeText(correctedText);
    setCopied(true);
  };

  if (!editor) {
    return null;
  }

  return (
    <>
   
      <div className="editor bg-white p-4 h-auto rounded-3xl relative shadow-md w-full">
        <div className="menu flex gap-5 w-[100%]  left-0 top-0 flex-col border border-slate-300 bg-slate-100 rounded-t-3xl absolute">
          <div className="flex gap-3 w-full h-12  overflow-hidden p-3 ps-6">
          {isLoading && (
        <div className="loader mr-10 "></div>

      )}
            <button
              className="menu-button mr-2"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().undo().run();
              }}
              disabled={!editor.can().undo()}
            >
              <Icons.RotateLeft />
            </button>
            <button
              className="menu-button mr-2"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().redo().run();
              }}
              disabled={!editor.can().redo()}
            >
              <Icons.RotateRight />
            </button>
            <button
              className={classNames("menu-button mr-2", {
                "is-active": editor.isActive("bold"),
              })}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleBold();
              }}
            >
              <Icons.Bold />
            </button>
            <button
              className={classNames("menu-button mr-2", {
                "is-active": editor.isActive("underline"),
              })}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleUnderline();
              }}
            >
              <Icons.Underline />
            </button>
            <button
              className={classNames("menu-button mr-2", {
                "is-active": editor.isActive("italic"),
              })}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleItalic();
              }}
            >
              <Icons.Italic />
            </button>
            <button
              className={classNames("menu-button mr-2", {
                "is-active": editor.isActive("strike"),
              })}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleStrike();
              }}
            >
              <Icons.Strikethrough />
            </button>
            <button
              className={classNames("menu-button mr-2", {
                "is-active": editor.isActive("code"),
              })}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleCode();
              }}
            >
              <Icons.Code />
            </button>
            <>
              <button
                className="bg-slate-100 border  overflow-y-hidden border-slate-500 p-1 text-sm rounded-md"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleAcceptAll();
                  handleRemoveActiveTaskType()
                }}
              >
                Accept All
              </button>
              <button
                className="bg-slate-100 border  overflow-y-hidden border-slate-500 p-1 text-sm rounded-md"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleReject();
                  handleRemoveActiveTaskType()
                }}
              >
                Reject All
              </button>
              <button
                className="bg-slate-100 border  border-slate-500 p-1 text-sm rounded-md"
                onClick={(e) => {
                  e.preventDefault();
                  handleCopy();
                }}
              >
                {copied ? "Copied" : "Copy"}
              </button>

              <button
                className="bg-slate-100 border overflow-y-hidden border-slate-500 p-1 text-sm rounded-md"
                onClick={(e) => {
                  e.preventDefault();
                  pdfExportFunction && pdfExportFunction();
                }}
              >
                Export pdf
              </button>
              <div className="w-60 h-7 sm-hide bg-white flex flex-col justify-center rounded-2xl shadow-sm ">
                <p className="text-center font-comic">
                  Word count: {wordCount} / 1000
                </p>
               
              </div>
            </>
          </div>
        </div>
        <div className=" w-[70vw] mt-10 rounded-3xl">

          <EditorContent
            className={` scroll-m-2 w-[100%] min-h-[30vw] mt-[4vw] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} `}
            editor={editor}
          />
        </div>
      </div>
      <div className="absolute -left-2/3">
        <PDF corrected={correctedText} originals={inputText} />
      </div>
    \
    </>
  );
}
