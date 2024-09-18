"use client";
import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import { DOMParser as ProseMirrorDOMParser } from "prosemirror-model";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import History from "@tiptap/extension-history";
import { diff_match_patch } from "diff-match-patch";
import usePdfStore from "@/app/store/usePDFStore";
import { usePDF } from "react-to-pdf";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthStore from "../store/useAuthStore";
import { axiosInstance } from "../utils/config/axios";
import { TTaskType } from "../utils/types";
import { useRouter } from "next/navigation";
import HardBreak from "@tiptap/extension-hard-break";
import InsertedText from "./tiptap/Inserted";
import DeletedText from "./tiptap/Deleted";
import { divideNewlinesByTwo } from "../utils/methods";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfDocument from "./ReactPdf/ReactPdfDocument";

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
  const [correctedText, setCorrectedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const setStoredFunction = usePdfStore((state) => state.setPdfExportFunction);
  const pdfExportFunction = usePdfStore((state) => state.pdfExportFunction);
  const router = useRouter();
  const [wordLimitExceeded, setWordLimitExceeded] = useState(false);
  const { token } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [initialText, setInitialText] = useState("");
  const [writingMode, setWritingMode] = useState(true);

  const [isEditorDisabled, setIsEditorDisabled] = useState(false);
  useEffect(() => {
    setStoredFunction(toPDF);
  }, [toPDF, setStoredFunction]);

  const axiosIns = axiosInstance(token || "");

  const getDiff = (original: string, corrected: string) => {
    const dmp = new diff_match_patch();
    const diff = dmp.diff_main(original, corrected);
    dmp.diff_cleanupSemantic(diff);

    let text = "";

    let store = "";

    diff.forEach((part) => {
      // Replace \n\n with <br> and single \n with a space (to handle single line breaks)
      const partText = part[1].replace(/\n/g, "<br>").replace(/\n/g, " ");
      store += partText;
      if (part[0] === -1) {
        text += `<del>${partText}</del>`;
      } else if (part[0] === 1) {
        text += `<u>${partText}</u>`;
      } else {
        text += partText;
      }
    });

    localStorage.setItem("correction", JSON.stringify({ value: store }));

    return text;
  };

  useEffect(() => {
    handleUpdate();
  }, [correctedText]);

  const editor = useEditor({
    extensions: [
      InsertedText,
      DeletedText,
      Document,
      History,
      Paragraph,
      Text,
      Bold,
      Underline,
      Italic,
      Strike,
      Code,
      HardBreak,
    ],
    editorProps: {
      handlePaste(view, event) {
        const clipboardData = event.clipboardData 
        const text = clipboardData?.getData("text");

        if (text) {
          const paragraphs = text
            .split(/\n{2,}/)
            .map((paragraph) => `<p>${paragraph}</p>`)
            .join("");

          const { schema } = view.state;
          const dom = document.createElement("div");
          dom.innerHTML = paragraphs;

          const node = ProseMirrorDOMParser.fromSchema(schema).parse(dom);

          view.dispatch(view.state.tr.replaceSelectionWith(node));

          return true;
        }

        return false;
      },
      attributes: {
        class:
          "prose dark:prose-invert prose-sm  sm:prose-base px-4 w-full h-full inline-block lg:prose-lg xl:prose-2xl outline-none scroll",
      },
    },

    onUpdate: ({ editor }) => {
      // const textContent = editor.getText();
      // const words = textContent.split(/\s+/).filter(Boolean).length;
      // setWordLimitExceeded(words > 1000);
    },
  }) as Editor;

  useEffect(() => {
    if (!triggerGrammarCheck) return;
    handleClickFeature(taskType, new MouseEvent("click"), false);
  }, [triggerGrammarCheck, taskType]);

  const userId = useAuthStore((state) => state.userId);

  const handleClickFeature: THandleClickFeature = async (
    type,
    event,
    hasSaved = false
  ) => {
    event.preventDefault();
    try {
      let currentContent = divideNewlinesByTwo(editor.getText());
      if (taskType === "refresh") {
        setInitialText("");
        setWritingMode(true);
        editor.commands.setContent("");
        return;
      }
      if (!initialText) {
        currentContent = divideNewlinesByTwo(editor.getText());
        setInitialText(currentContent);
        if (!currentContent) {
          toast.warn("Please enter content before submitting.");
          return;
        }
      } else {
        currentContent = initialText;
      }

      if (wordLimitExceeded) {
        toast.error("Word limit exceeded. Please reduce the number of words.");
        return;
      }
      setIsLoading(true);
      const payload = {
        userId: userId,
        title: title,
        content: currentContent,
        taskType: type || "improve",
        storyType: "practice",
        prompt: _id,
        hasSaved,
      };

      if (hasSaved) {
        await axiosIns.post("/stories/practise/save", payload);
        setIsSaving(false);
        toast.success("Story saved successfully");
        router.push(`/profile`);
      }
      if (!hasSaved) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_ROOT_URL}/api/stories/score`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...payload }),
          }
        );
        if (response.ok) {
          if (response.body === null) {
            return;
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder("utf-8");
          setCorrectedText(""); // Reset the response text

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            setCorrectedText((prev) => prev + chunk);
          }
          setIsLoading(false);
          setTriggerGrammarCheck(false);
          setWritingMode(false);
        }
      }
    } catch (error) {
      setIsLoading(false);
      setTriggerGrammarCheck(false);
      setIsSaving(false);
      toast.error("An error occurred while checking grammar.");
    }
  };

  const handleUpdate = () => {
    if (editor) {
      const result = getDiff(initialText, correctedText);
      editor.commands.setContent(result);
    }
  };

  useEffect(() => {
    if (!editor) return;
    if (!writingMode) {
      editor.setEditable(false);
    } else {
      editor.setEditable(true);
    }
  }, [writingMode, editor]);
  if (!editor) {
    return null;
  }

  return (
    <>
      <div className="w-full flex flex-col justify-center items-center">
        <div className="editor bg-white p-4 rounded-3xl relative shadow-md w-full">
          <div className="menu flex gap-5 w-[100%] h-12 left-0 top-0 flex-col border border-slate-300 bg-slate-100 rounded-t-3xl absolute">
            <div className="flex h-16  gap-3 p-3 ps-6">
              {isLoading && <div className="loader mr-10 "></div>}
              <button
                disabled={isLoading}
                className={classNames(
                  "menu-button bg-black text-sm font-unkempt text-white p-1 rounded-md ml-auto",
                  {
                    "is-active": editor.isActive("code"),
                  },
                  isLoading ? "pointer-events-none" : ""
                )}
                type="button"
              >
                <PDFDownloadLink
                  document={
                    <PdfDocument
                      corrected={correctedText}
                      originals={initialText}
                    />
                  }
                  fileName="example.pdf"
                >
                  {({ blob, url, loading, error }) => "Download PDF"}
                </PDFDownloadLink>
              </button>
            </div>
          </div>
          <div className="mt-10" ref={targetRef}>
            <EditorContent
              className={`scroll-m-2 w-[100%]  mt-10 font-comic ${
                isLoading
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : ""
              } ${
                !writingMode ? "pointer-events-none" : ""
              }  h-[600px] overflow-y-auto scrollbar-hide`}
              editor={editor}
              disabled={true}
              aria-disabled={true}
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
        <button
          className={`text-white font-unkempt bg-black text-2xl  ${
            isSaving ? "text-black bg-custom-yellow" : ""
          } w-96 h-16 sm:w-full sm:h-12 sm:text-sm rounded-full mx-auto mt-10 `}
          onClick={(e) => {
            setIsSaving(true);
            handleClickFeature(taskType, e, true);
          }}
        >
          {isSaving ? "Saving to profile..." : "Save to Profile"}
        </button>
      </div>

      {/* <div ref={targetRef} className="relative  "> */}

      {/* <PDF corrected={correctedText} originals={initialText} /> */}
      {/* </div> */}
    </>
  );
}
