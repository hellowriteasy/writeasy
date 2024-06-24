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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthStore from "../store/useAuthStore";
import { axiosInstance } from "../utils/config/axios";
import { TTaskType } from "../utils/types";
import { useRouter } from "next/navigation";

interface SimpleEditorProps {
  triggerGrammarCheck: any;
  taskType: TTaskType | string;
  title: string;
  handleRemoveActiveTaskType: () => void;
  Userid: string;
  _id: string;
  type: string;
  wordcount?: number;
  setTriggerGrammarCheck: React.Dispatch<React.SetStateAction<boolean>>;
}
type THandleClickFeature = (
  type: TTaskType | string,
  event: React.MouseEvent<HTMLButtonElement> | MouseEvent,
  hasSaved: boolean
) => void;

export function SimpleEditor({
  triggerGrammarCheck,
  taskType,
  title,
  _id,
  handleRemoveActiveTaskType,
  setTriggerGrammarCheck,
}: SimpleEditorProps) {
  const [inputText, setInputText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const setStoredFunction = usePdfStore((state) => state.setPdfExportFunction);
  const pdfExportFunction = usePdfStore((state) => state.pdfExportFunction);
  const router = useRouter();
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

  useEffect(() => {
    handleUpdate();
  }, [correctedText]);

  const [wordCount, setWordCount] = useState(0);
  const [wordLimitExceeded, setWordLimitExceeded] = useState(false);
  const { token } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
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
          "prose dark:prose-invert prose-sm sm:prose-base px-4 w-full h-full inline-block lg:prose-lg xl:prose-2xl outline-none scroll",
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
  useEffect(() => {
    if (!triggerGrammarCheck) return;
    handleClickFeature(taskType, new MouseEvent("click"), false);
  }, [triggerGrammarCheck]);

  const userId = useAuthStore((state) => state.userId);
  const AxiosIns = axiosInstance(token || "");

  const handleClickFeature: THandleClickFeature = async (
    type,
    event,
    hasSaved = false
  ) => {
    event.preventDefault();
    try {
      const currentContent = editor.getText();
      if (!currentContent) {
        toast.warn("Please enter content before submitting.");
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
      const { data } = await AxiosIns.post("/stories/score", payload);
      if (hasSaved) {
        toast.success("Story saved succesfully");
        router.push(`/profile`);
      }
      setInputText(currentContent);
      setCorrectedText(data.corrections);
      setCopied(false);
      setIsLoading(false);
      setIsSaving(false);
      setTriggerGrammarCheck(false);
    } catch (error) {
      setIsLoading(false);
      setTriggerGrammarCheck(false);
      setIsSaving(false);
      toast.error("An error occurred while checking grammar.");
    }
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
          <div className="flex h-16  gap-3 p-3 ps-6">
            {isLoading && <div className="loader mr-10 "></div>}
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
            
          </div>
        </div>
        <div className="mt-10">
          <EditorContent
            className="h-[600px] overflow-y-auto scrollbar-hide"
            editor={editor}
            style={{
              overflowY: "auto",
              scrollbarWidth: "none",
            }}
          />
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>
      </div>
    </>
  );
}
