'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from "next/image";
import TopWriting from "../../components/Others/TopWriting";
import WeeklyTest from "../../components/Others/WeeklyTest";
import Categories from "@/app/components/Categories";
import Bee from "@/public/Game/cloud3.svg";
import Cloud from "@/public/Game/cloud.svg";
import Prompt from "@/app/components/Practice/PracticePrompt";
import { SimpleEditor } from "@/app/components/WriteStory";

interface Prompt {
  _id: string;
  promptText: string;
  promptType: string;
  Userid:string;
  type:string
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
  const [taskType, setTaskType] = useState("");
  const [input, setInput] = useState("");

  useEffect(() => {
    if (params.id) {
      // Fetch the specific prompt data based on promptId
      axios.get(`http://localhost:5000/api/prompts/${params.id}`)
        .then(response => {
          setPrompt(response.data);
        })
        .catch(error => {
          console.error('Error fetching prompt:', error);
        });
    }
  }, [params.id]);

  const handleGrammarClick = () => {
    setTriggerGrammarCheck(true);
  };

  const handleTaskTypeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    setTaskType(value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInput(value);
  };

  if (!prompt) return <div>Loading...</div>;

  return (
    <div className="w-full h-[1900px] mt-6 z-0 relative flex justify-center">
      <div className="w-10/12 h-screen ms-12">
        <div className="w-full h-32 relative pt-4">
          <h1 className="text-5xl pt-4 ps-16 font-bold font-comic">{prompt.promptText}</h1>
        </div>
        <div className="flex w-[100%] relative mt-0">
          <div className="absolute -top-40 mt-3 -left-48">
            <Image src={Bee} alt="bee" />
          </div>
          <div className="gap-8 relative w-4/5 flex flex-col">
            <form action="" className="height-[800px]">
              <div className="flex flex-col w-full items-center gap-8 h-96">
                <div className="flex gap-5">
                  <input
                    className="border border-gray-500 z-10 text-xl rounded-3xl indent-7 w-[38vw] h-12 focus:outline-none focus:border-yellow-600"
                    placeholder="Email or Username comma separated"
                  />
                  <button type="submit" className="text-white hover:opacity-80 bg-black border text-2xl font-bold font-comic rounded-full w-40 h-12">
                    Invite
                  </button>
                </div>
                <div>
                  <input
                    className="border border-gray-500 z-10 text-xl rounded-3xl indent-7 w-[50vw] h-12 focus:outline-none focus:border-yellow-600"
                    placeholder="Untitled Story"
                    onChange={handleTitleChange}
                  />
                </div>
                <div>
                  <Categories />
                </div>
              </div>
            </form>
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap w-96 gap-4 font-comic">
              {['grammar', 'rewrite', 'improve', 'pdf'].map((type) => (
                <div key={type}>
                  <button
                    className="w-40 h-14 bg-black text-white hover:opacity-80 font-bold text-2xl rounded-full"
                    value={type}
                    onClick={type !== 'pdf' ? (e) => {
                      handleTaskTypeClick(e);
                      handleGrammarClick();
                    } : undefined}
                    disabled={type !== 'pdf' && triggerGrammarCheck}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className=" w-full rounded-full">
          <SimpleEditor
            triggerGrammarCheck={triggerGrammarCheck}
            title={input}
            Userid={params.id}
            type={prompt.promptType}
            _id={prompt._id}
            taskType={taskType}
            key={prompt._id}
          />
        </div>
        <div className="h-28 border-game">
          <button className="text-white bg-black border text-2xl font-bold font-comic rounded-full w-[50vw] h-14">
            Submit Story
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptPage;
