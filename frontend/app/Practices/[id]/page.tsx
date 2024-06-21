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
  const [taskType, setTaskType] = useState<TTaskType|string>("");
  const [input, setInput] = useState("");
  const { role, isSubcriptionActive } = useAuthStore();
  const AxiosIns = axiosInstance("");

  useEffect(() => {
    const handleBeforeUnload = (event:any) => {
      event.preventDefault();
      event.returnValue = "Refreshing the page may erase your changes. Are you sure you want to continue?";
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



  const handleRemoveActiveTaskType = () =>  setTaskType("")

  if (!prompt) return <div>Loading...</div>;

  return (
    <div className="w-full h-[1900px] mt-6 z-0 relative flex justify-center">
      <div className="w-10/12 h-screen ms-12 flex flex-col items-center gap-y-5 ">
        <div className="w-4/5 mx-auto h-32 relative pt-4 ">
          <h1 className="text-5xl  text-center font-bold font-comic">
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
              <div className="flex flex-col w-full items-center gap-8 h-auto  mx-auto">
                <div>
                  <input
                    className="border border-gray-500 z-10 text-xl rounded-3xl indent-7 w-[50vw] h-12 focus:outline-none focus:border-yellow-600"
                    placeholder="Untitled Story"
                    onChange={handleTitleChange}
                  />
                </div>
                <div className="flex w-full  flex-col gap-8">
                  <div className="flex flex-wrap justify-center gap-4 font-comic">
                    {["grammar", "rewrite", "improve", "pdf"].map((type) => (
                      <div key={type}>
                        <button
                          className={`w-[10vw] h-[4vw] bg-black text-white ${
                            taskType === type
                              ? "bg-custom-yellow text-black"
                              : ""
                          } hover:opacity-80 font-bold text-[1.6vw] rounded-full`}
                          value={type}
                          type="button"
                          onClick={
                            type !== "pdf"
                              ? (e) => {
                                  handleTaskTypeClick(e);
                                }
                              : undefined
                          }
                          // disabled={type !== "pdf" && triggerGrammarCheck}
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
        <div className="">
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
        {/* <div className="flex justify-center font-comic items-center my-4">
          <button
            className="text-white bg-black text-2xl font-bold w-96 h-12 rounded-3xl"
            onClick={handleSaveToProfile}
          >
            Save to Profile
          </button>
        </div> */}
      </div>

      {!isSubcriptionActive && role != "admin" ? <Subscription /> : null}
    </div>
  );
};

export default PromptPage;
