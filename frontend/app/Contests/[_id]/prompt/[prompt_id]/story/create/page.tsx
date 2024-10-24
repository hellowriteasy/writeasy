"use client";
import React, { SyntheticEvent, useCallback, useEffect, useState } from "react";
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
import Bee from "@/public/Game/cloud3.svg";
import Image from "next/image";
import useAuthStore from "@/app/store/useAuthStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePathname, useRouter } from "next/navigation";
import { axiosInstance } from "@/app/utils/config/axios";
import { TPrompt } from "@/app/utils/types";
import { divideNewlinesByTwo } from "@/app/utils/methods";
import WarningModal from "@/app/components/WarningModal";

const CreateContest = () => {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const router = useRouter();
  const { role, isSubcriptionActive, userId, status } = useAuthStore();
  const [contestId, setContestId] = useState("");
  const [promptId, setPromptId] = useState("");
  const pathname = usePathname();
  const { token } = useAuthStore();
  const [promptDetails, setPromptDetails] = useState<TPrompt | null>(null);
  const axiosIns = axiosInstance(token as string);

  useEffect(() => {
    const pathSegments = pathname.split("/");
    const contestIdFromUrl = pathSegments[2];
    const promptIdFromUrl = pathSegments[4];

    setContestId(contestIdFromUrl);
    setPromptId(promptIdFromUrl);
  }, [pathname]);

  useEffect(() => {
    if (promptId) {
      getPromptById();
    }
  }, [promptId]);

  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      event.preventDefault();
      event.returnValue =
        "Refreshing the page may erase your changes. Are you sure you want to continue?";
      return "Refreshing the page may erase your changes. Are you sure you want to continue?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const getPromptById = async () => {
    try {
      const { data } = await axiosIns.get(`/prompts/${promptId}`);
      setPromptDetails(data);
    } catch (error) {
      console.log(error);
    }
  };

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault(); // Prevent default form submission behavior
    setIsLoading(true);
    try {
      const currentContent = divideNewlinesByTwo(editor.getText());
      if (!currentContent) {
        setIsLoading(false);
        toast.warn("Please enter both  content before submitting.");
        return;
      }
      if (wordCount > 1000) {
        toast.warn(
          "Word limit exceeded. Please reduce the content to 1000 words or less."
        );
        setIsLoading(false);
        return;
      }
      const payload = {
        user: userId,
        title: title,
        content: currentContent,
        storyType: "contest",
        prompt: promptId,
        contest: contestId,
      };
      const { status } = await axiosIns.post("/stories", payload);
      setIsLoading(false);
      if (status === 201) {
        toast.success("Story saved successfully");
        router.push(`/profile/contest?search=${promptId}`);
      }
    } catch (error:any) {
      setIsLoading(false);
      toast.error(error?.response?.data?.message || "Story failed to save.");
    }
  }

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
          "prose dark:prose-invert prose-sm sm:prose-base px-4 w-full inline-block h-full lg:prose-lg xl:prose-2xl outline-none scroll",
      },
    },
    onUpdate: ({ editor }) => {
      const text = divideNewlinesByTwo(editor.getText());
      const wordCount = text
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
      setWordCount(wordCount);
      if (wordCount > 1000) {
        toast.warn(
          "Word limit exceeded. Please reduce the content to 1000 words or less."
        );
      }
    },
  }) as Editor;

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full h-auto z-0 relative flex justify-center px-2  ">
      <div className="w-10/12 sm:w-full ">
        <div className="w-full h-14 relative pt-4">
          <h1 className="text-6xl font-unkempt font-bold py-4"></h1>
        </div>
        <div className="flex w-[100%] relative mt-0">
          <div className="absolute -top-20 mt-3 -left-60">
            <Image src={Bee} alt="bee" />
          </div>
          <div className="gap-8 relative w-full flex flex-col">
            <form action="">
              <div className="flex flex-col w-full  items-center gap-4">
                <h2 className="text-3xl uppercase"> {promptDetails?.title}</h2>
                <div className="">
                  <input
                    className="border border-gray-500 z-10 text-xl rounded-full indent-7 w-[70vw] h-12 focus:outline-none focus:border-yellow-600"
                    placeholder="Untitled Story"
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </div>
              </div>
              {promptDetails?.contestId?.image ? (
                <img
                  src={promptDetails?.contestId?.image || ""}
                  alt="image"
                  className="w-[40%] sm:w-full  object-fill mx-auto mb-5 rounded-md"
                />
              ) : null}
              <div className="h-auto w-full rounded-full">
                <div className="editor bg-white p-4 rounded-3xl relative shadow-md w-full">
                  <div className="menu flex gap-5 w-[100%] h-12 left-0 top-0 flex-col border border-slate-300 bg-slate-100 rounded-t-3xl absolute">
                    <div className="flex gap-3 p-3 ps-6">
                      {isLoading && <div className="loader mr-10 "></div>}

                      <div className="w-60 h-7 bg-white flex flex-col justify-center rounded-2xl shadow-sm ">
                        <p className="text-center font-unkempt">
                          Word count: {wordCount} / 1000
                        </p>
                      </div>
                    </div>
                  </div>

                  <EditorContent
                    className={`scroll font-comic h-[600px] mt-10 overflow-y-auto hide-scrollbar ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    editor={editor}
                  />
                </div>
              </div>
              <div className="flex justify-center mt-5">
                <button
                  disabled={!!isLoading}
                  onClick={handleSubmit}
                  className="text-white bg-black border text-2xl font-bold font-unkempt rounded-full w-[50vw] h-14"
                >
                 {isLoading ? "Submitting..." :" Submit Story"}
                </button>
              </div>
            </form>
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </div>
        </div>
      </div>

      <WarningModal
        isAccountSuspended={status==="suspended"}
        isSubcriptionActive={isSubcriptionActive}
        role={role||""}
        status={status||""}
      />

    </div>
  );
};

export default CreateContest;
