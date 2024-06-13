'use client';
import React, { useCallback, useState, useEffect, SyntheticEvent } from "react";
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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { TStory } from "@/app/utils/types";

// interface Story {
//   user: string;
//   title: string;
//   content: string;
//   wordCount: number;
//   submissionDateTime: string;
//   score: number;
//   corrections: string;
//   contest: string;
//   prompt: string;
//   storyType: string;
// }

interface StoryEditorProps {
  story?: TStory;
  id: string;
}

const StoryEditor: React.FC<StoryEditorProps> = ({  id }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [wordLimitExceeded, setWordLimitExceeded] = useState(false);
  const [storyId, setStoryId] = useState(null);
  const isSubcriptionActive = useAuthStore(
    (state) => state.isSubcriptionActive
  );
  const role = useAuthStore((state) => state.role);
  const { userId } = useAuthStore();
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
        class: 'prose dark:prose-invert prose-sm sm:prose-base w-full inline-block lg:prose-lg xl:prose-2xl outline-none h-full',
      },
    },
    content: content,
    onUpdate: ({ editor }) => {
      const textContent = editor.getText();
      const words = textContent.split(/\s+/).filter(Boolean).length;
      setWordCount(words);
      setWordLimitExceeded(words > 1000);
    }
  }) as Editor;

  const handleSubmit = async (e:SyntheticEvent) => {
    e.preventDefault();

    try {
      const currentContent = editor.getText();
      if (!title || !currentContent) {
        toast.error("Please enter both title and content before submitting.");
        return;
      }
      if (wordLimitExceeded) {
        toast.error("Word limit exceeded. Please reduce the number of words.");
        return;
      }

      const payload = {
        user: userId,
        title: title,
        content: currentContent,
        storyType: "game",
        prompt: id
      };
      const { data } = await axios.post(
        `http://localhost:8000/api/stories`,
        payload
      );
      setStoryId(data.story); // Assume the API returns the story ID in the response
        toast.success("Story saved successfully");
        return toast;
      
    } catch (error) {
      toast.error("An error occurred while submitting the story. Please try again later.");
    }
  };

  const handleInvite = async (e:SyntheticEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter an email address.");
      return;
    }

    if (!storyId) {
      toast.error("Please submit the story before inviting a collaborator.");
      return;
    }

    try {
      console.log(token)
      const invitePayload = {
        storyID: storyId,
        email: email,
      };
      const { data, status } = await axios.post(
        `http://localhost:8000/api/collaborative-stories/invite`,
        invitePayload,
        {
          headers: {
            'x-auth-token': token
          }
        }
      );
      console.log(data)
      
      }
     catch (error:any) {
      console.log(error)
      toast.error(error.response?.data?.message || "An error occurred while sending the invitation. Please try again later.");
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

  return (
    <div className="w-full h-[1300px] mt-6 z-0 relative flex justify-center">
      <div className="w-10/12 h-screen ms-12">
        <div className="w-full h-60 relative pt-4">
          <h1 className="text-6xl pt-4 font-bold font-comic">
            Setting text of this story
          </h1>
          <div className="w-full relative pt-6 flex h-20">
            <div className="w-10 absolute h-10 left-3 bg-slate-500 rounded-full border">
              <Image src="" alt="" />
            </div>
            <div className="w-10 h-10 absolute left-8 bg-slate-500 rounded-full border">
              <Image src="" alt="" />
            </div>
          </div>
        </div>
        <div className="flex w-[100%] relative mt-0">
          <div className="absolute -top-40 mt-3 -left-48">
            <Image src={Bee} alt="bee" />
          </div>
          <div className="gap-8 relative w-4/5 flex flex-col">
            <form action="" className="height-[800px]">
              <div className="flex flex-col w-full items-center gap-4 h-96">
                <div>
                  <input
                    className="border border-gray-500 z-10 text-xl rounded-3xl indent-7 w-[40vw] h-12 focus:outline-none focus:border-yellow-600"
                    placeholder="Email to invite"
                    onChange={(e) => {
                      setEmail(e.target.value);
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
                      setTitle(e.target.value);
                    }}
                  />
                </div>
                <div className="h-[800px] rounded-full">
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
                            Word count: {wordCount} / 1000
                          </p>
                          {wordLimitExceeded && (
                            <p className="text-red-500">
                              Word limit exceeded. Please reduce the number of
                              words.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="w-[50vw] rounded-3xl">
                      <EditorContent
                        className="scroll-m-2 w-[100%] h-96 mt-10"
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
      {!isSubcriptionActive && <Subscription />}
      <ToastContainer />
    </div>
  );
};

export default StoryEditor;
