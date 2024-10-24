'use client';
import React, { useCallback, useState, useEffect } from "react";
import classNames from "classnames";
import axios from "axios";
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
import * as Icons from "../Icons";
import { diffChars, Change } from "diff";
import usePdfStore from "@/app/store/usePDFStore";
import { usePDF } from "react-to-pdf";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuthStore from "@/app/store/useAuthStore";
import { axiosInstance } from "@/app/utils/config/axios";

// const Page = ({ inputText, corrected }) => {
//   const [improved, setImproved] = useState([]);

//   const compareSentences = (original, corrected) => {
//     original = original.replace(/<\/?p>/g, "");
//     corrected = corrected.replace(/<\/?p>/g, "");
   

//     const diff = diffChars(original, corrected);
//     const result = [];

//     diff.forEach((part, index) => {
//       let style = {};
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

//       const span = (
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

// const getAiPrompt = (type, userInput) => {
//   const AiFeatureTextMapping = {
//     improve: "Proofread this improving clarity and flow",
//     grammer: "Proofread this but only fix grammar",
//     rewrite: "Rewrite this improving clarity and flow",
//   };

//   let task = AiFeatureTextMapping[type];

//   const messages = [
//     {
//       role: "system",
//       content:
//         "You are a master proofreader. Only proofread the given text, don't add new text to the document. The instructions are often in English, but keep prompt in the same language as the language being asked to proofread.",
//     },
//     {
//       role: "user",
//       content: `${task} : ${userInput}`,
//     },
//   ];
//   return messages;
// };

export function SimpleEditor({ triggerGrammarCheck, taskType, title, Userid, _id, contestId, promptId }: { triggerGrammarCheck: string, taskType: string; title: string; Userid: string; _id: string; contestId: string; promptId:string}) {
  const [inputText, setInputText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [copied, setCopied] = useState(false);
  const [improved, setImproved] = useState<React.ReactNode[]>([]);
  const [isCheckingGrammer, setIsCheckingGrammer] = useState(false);
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const setStoredFunction = usePdfStore((state) => state.setPdfExportFunction);
  const pdfExportFunction = usePdfStore((state) => state.pdfExportFunction);
 const AxiosIns=axiosInstance("")
  useEffect(() => {
    setStoredFunction(toPDF);
  }, [toPDF, setStoredFunction]);

  useEffect(() => {
    handleUpdate();
  }, [correctedText]);

  useEffect(() => {
    setImproved(compareSentences(inputText, correctedText));
  }, [inputText, correctedText]);

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
        class: 'prose dark:prose-invert prose-sm sm:prose-base inline-block  lg:prose-lg xl:prose-2xl m-5 h-full focus:outline-none',
      },
    },
  }) as Editor;

  const handleExport = () => {
    toPDF();
  };

  useEffect(() => {
    if (triggerGrammarCheck) {
      handleClickFeature("grammer", new MouseEvent("click"));
    }
  }, [triggerGrammarCheck]);
  const {userId}=useAuthStore();
  const handleClickFeature = async (type:string, event:any) => {
    event.preventDefault();

    try {
      const currentContent = editor.getText();
      if (!title || !currentContent) {
        toast.warn("Please enter both title and content before submitting.");
        return;
      }

      const payload = {
        user:userId,
        title: title,
        content: currentContent,
        taskType: taskType,
        storyType:"contest",
        prompt:promptId,
        contest:contestId 
      };

      const { data, status } = await AxiosIns.post(
        `/stories`,
        payload
      );
      toast.warn("Story saved succesfully");
  
      setInputText(currentContent);
      setCorrectedText(data.corrections);
      setCopied(false);
      setIsCheckingGrammer(true);

    } catch (error) {
   
    }
  };

  const handleAcceptAll = () => {
    if (editor) {
      editor.commands.setContent(`${correctedText}`);
    }
    setIsCheckingGrammer(false);
  };

  const handleReject = () => {
    if (editor) {
      editor.commands.setContent(`${inputText}`);
    }
    setIsCheckingGrammer(false);
  };

  const handleUpdate = () => {
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

  const getCorrectedContent = (original:string, corrected:string) => {
    original = original.replace(/<\/?p>/g, "");
    const diff = diffChars(original, corrected);
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

  const compareSentences = (original:string, corrected:string) => {
    const diff = diffChars(original, corrected);
    const result:React.ReactNode[] = [];

    diff.forEach((part, index) => {
      let style = {};

      if (part.added) {
        style = {
          color: "green",
          backgroundColor: "lightgreen",
          textDecoration: "underline",
          height: "40px",
        };
      } else if (part.removed) {
        style = {
          color: "red",
          backgroundColor: "lightcoral",
          height: "40px",
        };
      } else {
        style = {
          color: "black",
          backgroundColor: "transparent",
          textDecoration: "none",
          height: "40px",
        };
      }

      result.push(
        <div key={index} style={style}>
          {part.value}
        </div>
      );
    });

    return result;
  };

  if (!editor) {
    return null;
  }

  return (
    <>
      <div className="editor bg-white p-4 rounded-3xl relative shadow-md w-full">
        <div className="menu flex gap-5 w-[100%] h-12 left-0 top-0 flex-col border border-slate-300 bg-slate-100 rounded-t-3xl absolute">
          <div className="flex gap-3 p-3 ps-6">
            <button
              className="menu-button mr-2"
              type="button"
              onClick={(e) => { e.preventDefault(); editor.chain().focus().undo().run(); }}
              disabled={!editor.can().undo()}
            >
              <Icons.RotateLeft />
            </button>
            <button
              className="menu-button mr-2"
              type="button"
              onClick={(e) => { e.preventDefault(); editor.chain().focus().redo().run(); }}
              disabled={!editor.can().redo()}
            >
              <Icons.RotateRight />
            </button>
            <button
              className={classNames("menu-button mr-2", {
                "is-active": editor.isActive("bold"),
              })}
              type="button"
              onClick={(e) => { e.preventDefault(); toggleBold(); }}
            >
              <Icons.Bold />
            </button>
            <button
              className={classNames("menu-button mr-2", {
                "is-active": editor.isActive("underline"),
              })}
              type="button"
              onClick={(e) => { e.preventDefault(); toggleUnderline(); }}
            >
              <Icons.Underline />
            </button>
            <button
              className={classNames("menu-button mr-2", {
                "is-active": editor.isActive("italic"),
              })}
              type="button"
              onClick={(e) => { e.preventDefault(); toggleItalic(); }}
            >
              <Icons.Italic />
            </button>
            <button
              className={classNames("menu-button mr-2", {
                "is-active": editor.isActive("strike"),
              })}
              type="button"
              onClick={(e) => { e.preventDefault(); toggleStrike(); }}
            >
              <Icons.Strikethrough />
            </button>
            <button
              className={classNames("menu-button mr-2", {
                "is-active": editor.isActive("code"),
              })}
              type="button"
              onClick={(e) => { e.preventDefault(); toggleCode(); }}
            >
              <Icons.Code />
            </button>
            <>
              {/* <button
                className="bg-slate-100 border border-slate-500 p-1 text-sm rounded-md"
                type="button"
                onClick={(e) => { e.preventDefault(); handleAcceptAll(); }}
              >
                Accept All
              </button> */}
              {/* <button
                className="bg-slate-100 border border-slate-500 p-1 text-sm rounded-md"
                type="button"
                onClick={(e) => { e.preventDefault(); handleReject(); }}
              >
                Reject All
              </button> */}
              <button
                className="bg-slate-100 border border-slate-500 p-1 text-sm rounded-md"
                onClick={(e) => {e.preventDefault(); handleCopy()}}
              >
                {copied ? "Copied" : "Copy"}
              </button>
              
              <button
              
                className="bg-slate-100 border border-slate-500 p-1 text-sm rounded-md"
                onClick={(e) => {e.preventDefault();
                  pdfExportFunction && pdfExportFunction();
                }}
              >
                Export pdf
              </button>
            </>
          </div>
        </div>
        <div className=" w-[50vw]  rounded-full">
          <EditorContent className=" scroll-m-2 min-h-96 mt-10" editor={editor} />
        </div>
      </div>
    </>
  );
}
