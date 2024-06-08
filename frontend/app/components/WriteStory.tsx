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
import * as Icons from "./Icons";
import { diffChars, Change } from "diff";
import usePdfStore from "@/app/store/usePDFStore";
import { usePDF } from "react-to-pdf";
import PDF from "./PDF";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuthStore from "../store/useAuthStore";

const Page = ({ inputText, corrected }: { inputText: string; corrected: string; }) => {
  const [improved, setImproved] = useState<React.ReactNode[]>([]);

  const compareSentences = (original: string, corrected: string): React.ReactNode[] => {
    original = original.replace(/<\/?p>/g, "");
    corrected = corrected.replace(/<\/?p>/g, "");
   
    const diff: Change[] = diffChars(original, corrected);
    const result: React.ReactNode[] = [];

    diff.forEach((part: Change, index: number) => {
      let style: React.CSSProperties = {};
      if (part.added) {
        style = {
          color: "green",
          backgroundColor: "lightgreen",
          textDecoration: "none",
        };
      } else if (part.removed) {
        style = {
          color: "red",
          backgroundColor: "lightcoral",
          textDecoration: "line-through",
        };
      } else {
        style = {
          color: "black",
          backgroundColor: "transparent",
          textDecoration: "none",
        };
      }

      const span: React.ReactElement = (
        <div key={index} style={style}>
          {part.value}
        </div>
      );
      result.push(span);
    });

    return result;
  };

  useEffect(() => {
    setImproved(compareSentences(inputText, corrected));
  }, [inputText, corrected]);

  return <div className="mt-4">{improved}</div>;
};

type TWriteEasyFeature = "improve" | "grammer" | "rewrite";

const AiFeatureTextMapping = {
  improve: "Proofread this improving clarity and flow",
  grammer: "Proofread this but only fix grammar",
  rewrite: "Rewrite this improving clarity and flow",
} as Record<TWriteEasyFeature, string>;

const getAiPrompt = (type: TWriteEasyFeature, userInput: string) => {
  let task = AiFeatureTextMapping[type];

  const messages = [
    {
      role: "system",
      content:
        "You are a master proofreader. Only proofread the given text, don't add new text to the document. The instructions are often in English, but keep prompt in the same language as the language being asked to proofread.",
    },
    {
      role: "user",
      content: `${task} : ${userInput}`,
    },
  ];
  return messages;
};

interface SimpleEditorProps {
  triggerGrammarCheck: boolean;
  taskType: string;
  title: string;
  Userid: string;
  _id: string;
  type: string;
  wordcount:number;
}

export function SimpleEditor({ triggerGrammarCheck, taskType, title, Userid, _id, type }: SimpleEditorProps) {
  const [inputText, setInputText] = useState(""); // State to hold input text
  const [correctedText, setCorrectedText] = useState("");
  const [copied, setCopied] = useState(false); // State to track if text is copied
  const [improved, setImproved] = useState<React.ReactNode[]>([]);
  const [final, setFinal] = useState("");
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const setStoredFunction = usePdfStore((state) => state.setPdfExportFunction);
  const [isCheckingGrammer, setIsCheckingGrammer] = useState(false);
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

  const compareSentences = (original: string, corrected: string): React.ReactNode[] => {
    const diff: Change[] = diffChars(original, corrected);
    const result: React.ReactNode[] = [];

    diff.forEach((part: Change, index: number) => {
      let style: React.CSSProperties = {};

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
  
  useEffect(() => {
    handleUpdate();
  }, [correctedText]);

  useEffect(() => {
    setImproved(compareSentences(inputText, correctedText));
  }, [inputText, correctedText]);

  const [wordCount, setWordCount] = useState(0);
  const [wordLimitExceeded, setWordLimitExceeded] = useState(false);
  
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
        class: 'prose dark:prose-invert prose-sm sm:prose-base w-full inline-block lg:prose-lg xl:prose-2xl outline-none h-full',
      },
    }, 
    onUpdate: ({ editor }) => {
      const textContent = editor.getText();
      const words = textContent.split(/\s+/).filter(Boolean).length;
      setWordCount(words);
      setWordLimitExceeded(words > 1000);
    }
  }) as Editor;

  const handleExport = () => {
    toPDF();
  };

  useEffect(() => {
    if (triggerGrammarCheck) {
      handleClickFeature("grammer", new MouseEvent("click"));
    }
  }, [triggerGrammarCheck]);

  type THandleClickFeature = (type: "improve" | "grammer" | "rewrite", event: React.MouseEvent<HTMLButtonElement> | MouseEvent) => void;
  const userId = useAuthStore((state) => state.userId);

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
        taskType: taskType,
        storyType: "practice",
        prompt: _id
      };
      
      const { data, status } = await axios.post(
        "http://localhost:5000/api/stories/score",
        payload
      );
      toast.success("Story saved succesfully");
      
      setInputText(currentContent);
      setCorrectedText(data.corrections);
      setCopied(false);
      setIsCheckingGrammer(true);
    
    } catch (error) {
      toast.error("An error occurred while checking grammar.");
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
              <button
                className="bg-slate-100 border border-slate-500 p-1 text-sm rounded-md"
                type="button"
                onClick={(e) => { e.preventDefault(); handleAcceptAll(); }}
              >
                Accept All
              </button>
              <button
                className="bg-slate-100 border border-slate-500 p-1 text-sm rounded-md"
                type="button"
                onClick={(e) => { e.preventDefault(); handleReject(); }}
              >
                Reject All
              </button>
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
              <div className="w-60 h-7 bg-white flex flex-col justify-center rounded-2xl shadow-sm ">

                <p className="text-center font-comic">Word count: {wordCount} / 1000</p>
                {wordLimitExceeded && (
               <p className="text-red-500">Word limit exceeded. Please reduce the number of words.</p>
                  )}
             </div>
            </>
          </div>
        </div>
        <div className=" w-[70vw]  rounded-3xl">
          <EditorContent className=" scroll-m-2 w-[100%] h-[30vw] mt-10 " editor={editor} />
        </div>
      </div>
      <div className="absolute -left-2/3">
        <PDF corrected={correctedText} originals={inputText} />
      </div>
      <ToastContainer />
    </>
  );
}
