'use client';
import React, { useCallback, useState } from "react";
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
import Cloud from "@/public/Game/cloud.svg";
import Image from "next/image";
import Subscription from "@/app/components/Subscription";
import useAuthStore from "@/app/store/useAuthStore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from "axios";
interface Prompt {
  _id: string;
  title: string;
  promptType: string;
  Userid: string;
  type: string;
}

interface PromptPageProps {
  
  contestId: string;
  promptId: string;
  Prompttitle:string;
}


const CreateContest: React.FC<PromptPageProps> = ({contestId,promptId,Prompttitle}) => {  
  const [title,setTitle]=useState("")
  const [content,setcontent]=useState("")
  const subscriptionType = useAuthStore((state) => state.subscriptionType);
  const role = useAuthStore((state) => state.role);
  const {userId}=useAuthStore();
  async function handleSubmit(e) {
    e.preventDefault(); // Prevent default form submission behavior
  
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
        storyType:"contest",
        prompt:promptId,
        contest:contestId 
      };

      const { data, status } = await axios.post(
        `http://localhost:5000/api/stories`,
        payload
      );
      toast.warn("Story saved succesfully");
    } catch (error) {
   
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
        class: 'prose dark:prose-invert prose-sm sm:prose-base w-full   inline-block lg:prose-lg xl:prose-2xl outline-none  h-full ',
      },
    },
  }) as Editor;

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
    <div className="w-full  mt-6 z-0 relative flex justify-center">
      <div className="w-10/12 h-screen ms-12">
        <div className="w-full h-32 relative pt-4">
        
          <h1 className="text-6xl font-comic font-bold py-4">Selected Prompt Title</h1>
        </div>
        <div className="flex w-[100%] relative mt-0">
          <div className="absolute -top-40 mt-3 -left-60">
            <Image src={Bee} alt="bee" />
          </div>
          <div className="gap-8 relative w-4/5 flex flex-col">
            <form action="" className="height-[100px]">
              <div className="flex flex-col w-full items-center gap-4 h-96">
                 {/* <h2> prompt {Prompttitle}</h2> */}
                <div>
                  <input
                    className="border border-gray-500 z-10 text-xl rounded-3xl indent-7 w-[70vw] h-12 focus:outline-none focus:border-yellow-600"
                    placeholder="Untitled Story"
                    onChange={(e)=>{setTitle(e.target.value)}}
                  />
                </div>
             
                <div className="h-[800px] rounded-full">
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
                      </div>
                    </div>
                    <div className="w-[70vw]  rounded-3xl">
                      <EditorContent className="scroll-m-2 w-[100%] h-[30vw] mt-10 " editor={editor} />
                    </div>
                  </div>
                </div>
                <div>
                  <button
                onClick={handleSubmit}  
                  className="text-white bg-black border text-2xl font-bold font-comic rounded-full w-[50vw] h-14">
                    Submit Story
                  </button>
                </div>
              </div>
            </form>
          </div>
         
        </div>
      </div>
      {subscriptionType=="free"&&<Subscription/>}
    </div>
  );
}

export default CreateContest;