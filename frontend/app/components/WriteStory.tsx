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
import CharacterCount from "@tiptap/extension-character-count";
import EditorWordCount from "./tiptap/EditorWordCount";
import { set } from "react-hook-form";

interface SimpleEditorProps {
  triggerGrammarCheck: any;
  taskType: TTaskType | string;
  title: string;
  handleRemoveActiveTaskType: () => void;
  Userid: string;
  _id: string;
  type: string;
  wordcount?: number;
  prompt_title: string;
  currentStoryId: string;
  setTriggerGrammarCheck: React.Dispatch<React.SetStateAction<boolean>>;
}
type THandleClickFeature = (
  type: TTaskType | string,
  event: React.MouseEvent<HTMLButtonElement> | MouseEvent,
  hasSaved: boolean,
  savePublic?: boolean
) => void;

export function SimpleEditor({
  triggerGrammarCheck,
  taskType,
  title,
  _id,
  prompt_title,
  handleRemoveActiveTaskType,
  currentStoryId,
  setTriggerGrammarCheck,
}: SimpleEditorProps) {
  const [correctedText, setCorrectedText] = useState("");
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const setStoredFunction = usePdfStore((state) => state.setPdfExportFunction);
  const pdfExportFunction = usePdfStore((state) => state.pdfExportFunction);
  const router = useRouter();
  const [wordLimitExceeded, setWordLimitExceeded] = useState(false);
  const { token } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [initialText, setInitialText] = useState("");
  const [writingMode, setWritingMode] = useState(true);
  const [storyId, setStoryId] = useState("");
  const [isEditorDisabled, setIsEditorDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingPublic, setIsSavingPublic] = useState(false);
  const [wordsLength, setWordsLength] = useState(0);
  const [isSavingPrivate, setIsSavingPrivate] = useState(false);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [practistLimit, setPractiseLimit] = useState({
    totalLimit: null,
    remainingLimit: null,
  });

  const limit = 16000;
  useEffect(() => {
    setStoredFunction(toPDF);
  }, [toPDF, setStoredFunction]);

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
      CharacterCount.configure({
        limit,
      }),
    ],
    editorProps: {
      handlePaste(view, event) {
        const clipboardData = event.clipboardData;
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
      const textContent = editor.getText();
      const words = textContent.split(/\s+/).filter(Boolean).length;
      setWordsLength(words);
      // setWordLimitExceeded(words > 1000);
    },
  }) as Editor;

  useEffect(() => {
    if (currentStoryId) {
      setStoryId(currentStoryId);
      fetchStoryById(currentStoryId);
    }
  }, [currentStoryId, editor]);

  const fetchUsersPractiseLimit = async () => {
    try {
      const res = await axiosIns.get(
        `/auth/users/practiseLimit?userId=${userId}`
      );
      if (res.status === 200) {
        setPractiseLimit({
          remainingLimit: res.data.remainingLimit,
          totalLimit: res.data.limit,
        });
      }
    } catch (error) {}
  };
  useEffect(() => {
    fetchUsersPractiseLimit();
  }, []);

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

  useEffect(() => {
    if (!triggerGrammarCheck) return;
    handleClickFeature(taskType, new MouseEvent("click"), false);
  }, [triggerGrammarCheck, taskType]);

  const userId = useAuthStore((state) => state.userId);

  const handleClickFeature: THandleClickFeature = async (
    type,
    event,
    hasSaved = false,
    savePublic
  ) => {
    event.preventDefault();
    try {
      if (isSaving || isLoading) return;
      
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
      if (hasSaved) {
        console.log("inside has saved", !!savePublic);
        setIsSavingPublic(!!savePublic);
        setIsSavingPrivate(!savePublic);
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
        isPrevious: !!currentStoryId,
      };

      if (hasSaved) {
        await axiosIns.post("/stories/practise/save", {
          ...payload,
          timezone,
          storyId,
          isPublic: !!savePublic,
        });
        setIsSaving(false);
        setIsSavingPrivate(false);
        setIsSavingPublic(false);
        setIsLoading(false);
        toast.success("Story saved successfully");
      }
      if (!hasSaved) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_ROOT_URL}/api/stories/score`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...payload, storyId: storyId }),
          }
        );

        if (response.ok) {
          if (response.body === null) {
            return;
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder("utf-8");
          let correctedText = ""; // Store the accumulated text
          let storyId = null;

          setCorrectedText(""); // Reset the response text

          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              setIsLoading(false);
              break;
            }

            const chunk = decoder.decode(value, { stream: true });
            console.log(chunk);

            // Try to detect the JSON chunk that signals the end of the stream
            try {
              const jsonResponse = JSON.parse(chunk); // Attempt to parse as JSON

              if (jsonResponse.data !== null) {
                // Only append the `data` part if it's not null
                correctedText += jsonResponse.data;
              }
              // Capture storyId if needed
              storyId = jsonResponse.storyId;
              console.log("Parsed final JSON chunk:", jsonResponse);
            } catch (e) {
              // If JSON.parse fails, this is a regular text chunk
              correctedText += chunk;
            }

            // Update state with corrected text (only update with non-JSON data)
            setCorrectedText(correctedText);
          }

          // Handle final states and actions after streaming is complete
          console.log("Final corrected text: ", correctedText);
          console.log("Story ID: ", storyId); // Now you have the storyId
          setTriggerGrammarCheck(false);
          setWritingMode(false);

          // If you want to do something with storyId (e.g., display or log it)
          if (storyId) {
            setStoryId(storyId);
            console.log("Story ID:", storyId);
          }
          await fetchUsersPractiseLimit();
        } else {
          const error = await response.json();
          setTriggerGrammarCheck(false);
          setIsSaving(false);
          toast.error(
            error?.message || "Something went wrong. Please try again ."
          );
          setIsLoading(false);
        }
      }
    } catch (error) {
      setTriggerGrammarCheck(false);
      setIsSaving(false);
      toast.error("Something went wrong. Please try again .");
      setIsLoading(false);
    }
  };

  const handleUpdate = () => {
    if (editor) {
      const result = getDiff(initialText, correctedText);
      editor.commands.setContent(result);
    }
  };

  const handleFocus = () => {
    if (editor) {
      editor.commands.focus();
    }
  };

  const fetchStoryById = async (storyId: string) => {
    try {
      const res = await axiosIns.get(`/stories/${storyId}`);
      if (res.status === 200) {
        const { data } = res;
        console.log(data);
        if (data && editor) {
          console.log(data.content);
          editor.commands.setContent(data.content);
        }
      }
    } catch (error) {
      //
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
              {isLoading && <div className="loader  "></div>}
              <div className="ml-auto">
                <p>
                  {practistLimit.remainingLimit !== null
                    ? `You still have ${practistLimit.remainingLimit}/
                   ${practistLimit.totalLimit}`
                    : ""}
                  markings left
                </p>
              </div>
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
                  fileName={`${prompt_title}.pdf`}
                >
                  {({ blob, url, loading, error }) => "Download PDF"}
                </PDFDownloadLink>
              </button>
            </div>
          </div>

          <div className="mt-10 " ref={targetRef}>
            <EditorContent
              className={`scroll-m-2 w-[100%]  cursor-text mt-10 font-comic ${
                isLoading
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : ""
              } ${
                !writingMode ? "pointer-events-none" : ""
              }    overflow-y-auto scrollbar-hide`}
              editor={editor}
              disabled={true}
              aria-disabled={true}
              style={{
                overflowY: "auto",
                scrollbarWidth: "none",
                height: "fit-content",
                minHeight: "800px",
              }}
              onClick={() => {
                handleFocus();
              }}
            />
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </div>
        </div>

        <EditorWordCount
          characters={editor.storage.characterCount.characters()}
          limit={limit}
          words={editor.storage.characterCount.words()}
        />
        <div className="flex gap-x-2 ">
          <button
            disabled={isLoading}
            className={`text-white font-unkempt bg-black text-2xl  ${
              isSavingPrivate ? "text-black bg-custom-yellow" : ""
            } w-96 h-16 sm:w-full sm:h-12 sm:text-sm rounded-full mx-auto mt-10 `}
            onClick={(e) => {
              handleClickFeature(taskType, e, true);
            }}
          >
            {isSavingPrivate ? "Saving to profile..." : "Save to Profile only"}
          </button>
          <button
            disabled={isLoading}
            className={`text-white font-unkempt bg-black text-2xl  ${
              isSavingPublic ? "text-black bg-custom-yellow" : ""
            } w-96 h-16 sm:w-full sm:h-12 sm:text-sm rounded-full mx-auto mt-10 `}
            onClick={(e) => {
              handleClickFeature(taskType, e, true, true);
            }}
          >
            {isSavingPublic
              ? "Saving to profile and publishing..."
              : "Save to Profile and publish"}
          </button>
        </div>
      </div>
    </>
  );
}
