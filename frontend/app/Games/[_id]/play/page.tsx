"use client";
import React, { useCallback, useState, SyntheticEvent, useEffect } from "react";
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
import * as Icons from "../../../components/Icons";
import Bee from "@/public/Game/cloud3.svg";
import Image from "next/image";
import Subscription from "@/app/components/Subscription";
import useAuthStore from "@/app/store/useAuthStore";
import { toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useParams } from "next/navigation";
import { axiosInstance } from "@/app/utils/config/axios";
import { TPrompt, TStory } from "@/app/utils/types";
import Logo from "@/public/Landingpage-img/logo.svg";

interface StoryEditorProps {
  _id: string;
  title:string,
  content:string,
 
}

const StoryEditor: React.FC<StoryEditorProps> = () => {
  const [storyDetails, setStoryDetails] = useState({
    title: "",
    email: "",
    content: "",
    wordCount: 0,
    wordLimitExceeded: false,
    refresh: false,
  });
  const [prompt, setPrompt] = useState<TPrompt | null>(null);
  const [currentStory, setCurrentStory] = useState<TStory | null>(null);
  const isSubcriptionActive = useAuthStore(
    (state) => state.isSubcriptionActive
  );
  const { userId, token, role } = useAuthStore();
  const params = useParams();
  const promptId = params._id;

  const AxiosIns = axiosInstance(token || "");

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
          "prose dark:prose-invert prose-sm sm:prose-base w-full inline-block lg:prose-lg xl:prose-2xl outline-none h-full",
      },
    },
    content: storyDetails.content,
    onUpdate: ({ editor }) => {
      const textContent = editor.getText();
      const words = textContent.split(/\s+/).filter(Boolean).length;
      handleStoryDetailsInputChange("wordCount", words);
      handleStoryDetailsInputChange("wordLimitExceeded", words > 1000);
    },
  }) as Editor;

  const fetchPromptById = async () => {
    try {
      const { data } = await AxiosIns.get(`/prompts/${promptId}`);
      setPrompt(data);
    } catch (error) {
      //
    }
  };

  const fetchStoryOfUserByPromptId = async () => {
    try {
      const { data } = await AxiosIns.get(
        `/stories/user/${promptId}/${userId}`
      );
      if (data) {
        setCurrentStory(data);
      }
    } catch (error) {
      //
    }
  };
  useEffect(() => {
    fetchStoryOfUserByPromptId();
  }, [userId, promptId, storyDetails.refresh]);

  useEffect(() => {
    if (promptId) {
      fetchPromptById();
    }
  }, [promptId]);

  useEffect(() => {
    console.log("inside", currentStory);
    if (currentStory && editor) {
      editor?.commands?.clearContent();
      editor.commands.insertContent(currentStory.content);
      handleStoryDetailsInputChange("title", currentStory.title);
      handleStoryDetailsInputChange("content", currentStory.content);
    }
  }, [currentStory, editor]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const storyId = currentStory?._id;
    try {
      const currentContent = editor.getText();
      // early return
      if (!storyId) return;
      if (!storyDetails.title || !currentContent) {
        toast.error("Please enter both title and content before submitting.");
        return;
      }
      if (storyDetails.wordLimitExceeded) {
        toast.error("Word limit exceeded. Please reduce the number of words.");
        return;
      }

      if (currentStory?._id) {
        const payload = {
          storyID: storyId,
          text: currentContent,
        };
        await AxiosIns.post(`/collaborative-stories/submit`, payload);
      } else {
        const payload = {
          user: userId,
          title: storyDetails.title,
          content: currentContent,
          storyType: "game",
          prompt: promptId,
        };
        await AxiosIns.post(`/stories`, payload);
        setStoryDetails((prev) => ({
          ...prev,
          refresh: !prev.refresh,
        }));
      }

      toast.success("Story saved successfully");
      return toast;
    } catch (error) {
      toast.error(
        "An error occurred while submitting the story. Please try again later."
      );
    }
  };

  const handleInvite = async (e: SyntheticEvent) => {
    e.preventDefault();
    const storyId = currentStory?._id;
    const { email } = storyDetails;
    if (!email) {
      toast.error("Please enter an email address.");
      return;
    }
    try {
      const invitePayload = {
        storyID: storyId,
        email: email.replaceAll(/\s/g, '').split(","),
        promptID:promptId,
        userID: userId,
      };

      const { data } = await axios.post(
        `http://localhost:8000/api/collaborative-stories/invite`,
        invitePayload,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      console.log(data);
      handleStoryDetailsInputChange("refresh",!storyDetails.refresh)
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while sending the invitation. Please try again later."
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

  if (!editor) {
    return null;
  }

  const handleStoryDetailsInputChange = (
    name: string,
    value: string | boolean | number
  ) => {
    setStoryDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="w-full h-[1300px] mt-6 z-0 relative flex justify-center ">
      <div className="w-10/12 h-screen ms-12">
        <div className="w-full h-60 relative pt-4">
          <h1 className="text-6xl pt-4 font-bold font-comic">
            {prompt?.title || ""}
          </h1>

          <div className="w-full relative pt-6 flex h-20">
            {currentStory
              ? Array.from(
                  new Array(...currentStory?.contributors, currentStory?.user)
                ).map((contributor, index) => (
                  <div key={contributor._id}>
                    <div
                      className={`w-10 absolute h-10 left-${
                        index * 3 + 3
                      } bg-white flex items-center content-center rounded-full border`}
                    >
                      <Image src={Logo} alt="" />
                    </div>
                    <p>{contributor.username}</p>
                  </div>
                ))
              : ""}

            {/* <div className="w-10 h-10 absolute left-14 bg-slate-500 rounded-full border">
              <Image src="" alt="" />
            </div>
            <div className="w-10 h-10 absolute left-18 bg-slate-500 rounded-full border">
              <Image src="" alt="" />
            </div> */}
          </div>
        </div>
        <div className="flex w-[100%] relative mt-0 ">
          <div className="absolute -top-40 mt-3 -left-48">
            <Image src={Bee} alt="bee" />
          </div>
          <div className="gap-8 relative  flex flex-col items-center  w-full">
            <form className="height-[800px] w-full">
              <div className="flex flex-col w-full  gap-4 h-96 ">
                <div>
                  <input
                    className="border border-gray-500 z-10 text-xl rounded-3xl indent-7 w-[40vw] h-12 focus:outline-none focus:border-yellow-600"
                    placeholder="Email to invite"
                    value={storyDetails.email}
                    onChange={(e) => {
                      handleStoryDetailsInputChange("email", e.target.value);
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleInvite}
                    className="text-white bg-black border text-2xl font-bold font-comic rounded-full w-40 h-14 ml-4"
                  >
                    Invite
                  </button>
                </div>
                <div>
                  <input
                    className="border border-gray-500 z-10 text-xl rounded-3xl indent-7 w-[50vw] h-12 focus:outline-none focus:border-yellow-600"
                    placeholder="Untitled Story"
                    onChange={(e) => {
                      handleStoryDetailsInputChange("title", e.target.value);
                    }}
                    disabled={!currentStory}
                    value={storyDetails.title}
                  />
                </div>
                {/* should make it shared component in future  */}
                <div className="h-[800px] rounded-full w-full ">
                  <div className="editor bg-white p-4 rounded-3xl relative shadow-md w-full">
                    <div className="menu flex gap-5 w-[100%] h-12 left-0 top-0 flex-col border border-slate-300 bg-slate-100 rounded-t-3xl absolute">
                      <div className="flex gap-3 p-3 ps-6">
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
                        <div className="w-60 h-7 bg-white flex flex-col justify-center rounded-2xl shadow-sm ">
                          <p className="text-center font-comic">
                            Word count: {storyDetails.wordCount} / 1000
                          </p>
                          {storyDetails.wordLimitExceeded && (
                            <p className="text-red-500">
                              Word limit exceeded. Please reduce the number of
                              words.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`w-[50vw] rounded-3xl ${
                        !currentStory && "pointer-events-none opacity-20"
                      }   `}
                    >
                      <EditorContent
                        className="scroll-m-2 w-[100%] min-h-300 mt-10"
                        editor={editor}
                      />
                    </div>
                  </div>
                </div>
                <div className="">
                  <button
                    onClick={handleSubmit}
                    className="text-white bg-black border text-2xl font-bold font-comic rounded-full w-[50vw] h-14"
                  >
                    Submit Story
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {!isSubcriptionActive && role != "admin" ? <Subscription /> : null}

    </div>
  );
};

export default StoryEditor;
