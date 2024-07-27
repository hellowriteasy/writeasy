"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Bee from "@/public/Game/cloud3.svg";
import { SimpleEditor } from "@/app/components/WriteStory";
import useAuthStore from "@/app/store/useAuthStore";
import Subscription from "@/app/components/Subscription";
import { axiosInstance } from "@/app/utils/config/axios";
import { TTaskType } from "@/app/utils/types";

interface Prompt {
  _id: string;
  title: string;
  promptType: string;
  Userid: string;
  type: string;
}

interface PromptPageProps {
  params: {
    id: string;
    promptType: string;
  };
}

const PromptPage: React.FC<PromptPageProps> = ({ params }) => {
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [triggerGrammarCheck, setTriggerGrammarCheck] = useState(false);
  const [taskType, setTaskType] = useState<TTaskType | string>("");
  const [input, setInput] = useState("");
  const { role, isSubcriptionActive } = useAuthStore();
  const AxiosIns = axiosInstance("");

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

  useEffect(() => {
    if (params.id) {
      AxiosIns.get(`prompts/${params.id}`)
        .then((response) => {
          setPrompt(response.data);
        })
        .catch((error) => {
          console.error("Error fetching prompt:", error);
        });
    }
  }, [params.id]);

  const handleGrammarClick = () => {
    setTriggerGrammarCheck(true);
  };

  const handleTaskTypeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    setTaskType(value as TTaskType);
    setTriggerGrammarCheck(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInput(value);
  };

  const handleRemoveActiveTaskType = () => setTaskType("");

  if (!prompt) return <div>Loading...</div>;

  return (
    <div className="w-full min-h-screen h-[1200px] mt-6 z-0 relative flex justify-center">
      <div className="w-10/12 min-h-screen ms-12 flex flex-col items-center gap-y-4 ">
        <div className="w-4/5 mx-auto  relative pt-2 ">
          <h1 className="text-xl text-center font-bold font-comic">
            {prompt.title}
          </h1>
        </div>
        <div className="flex w-[100%] relative mt-0 ">
          <div className="absolute vsm-hide -top-40 mt-3 -left-48">
            <Image src={Bee} alt="bee" />
          </div>
          <div className="gap-8 relative w-full flex flex-col items-center ">
            <form
              action=""
              className="flex flex-col items-center w-full mx-auto"
            >
              <div className="flex flex-col w-full items-center gap-8 h-auto mx-auto">
                <div>
                  <input
                    className="border border-gray-500 z-10 text-xl rounded-3xl indent-7 w-[50vw] h-12 focus:outline-none focus:border-yellow-600"
                    placeholder="Untitled Story"
                    onChange={handleTitleChange}
                  />
                </div>
                <div className="flex w-full flex-col gap-8">
                  <div className="flex flex-wrap justify-center gap-4 sm:gap-1 font-comic">
                    {["grammar", "rewrite", "improve"].map((type) => (
                      <div key={type} className="flex">
                        <button
                          className={` sm:h-10 sm:w-20  md:h-[7vh] w-32 h-12 text-md bg-black text-white ${
                            taskType === type
                              ? "bg-custom-yellow text-black"
                              : ""
                          } hover:opacity-80 font-bold text-md sm:text-[2.5vw] rounded-3xl`}
                          value={type}
                          type="button"
                          onClick={
                            type !== "pdf"
                              ? (e) => {
                                  handleTaskTypeClick(e);
                                }
                              : undefined
                          }
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="w-full flex-grow">
          <SimpleEditor
            triggerGrammarCheck={triggerGrammarCheck}
            title={input}
            Userid={params.id}
            type={prompt.promptType}
            _id={prompt._id}
            taskType={taskType}
            key={prompt._id}
            setTriggerGrammarCheck={setTriggerGrammarCheck}
            handleRemoveActiveTaskType={handleRemoveActiveTaskType}
          />
        </div>
      </div>

      {!isSubcriptionActive && role !== "admin" ? <Subscription /> : null}
    </div>
  );
};

export default PromptPage;
