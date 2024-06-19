import React from "react";
import Pencil from "@/public/Game/Pencil.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface PromptProps {
  promptText: string;
  promptCategory: string[];
  contestId: string;
  promptId: string;
  onSelectPrompt: (contestId: string, promptId: string,title:string) => void;
  isActive: boolean;
}

const ContestPrompt: React.FC<PromptProps> = ({
  promptText,
  promptCategory,
  contestId,
  promptId,
  onSelectPrompt,
  isActive,
}) => {
  const router = useRouter()

  const handleClick = () => {
    if(isActive){
    router.push(`/Contests/${contestId}/prompt/${promptId}/story/create`);
    }else{
      router.push(`/Contests/${contestId}/${promptId}`);
    }
    // onSelectPrompt(contestId, promptId,"");
  };



  // fetch api here and 
  
  



  return (
    <div className="flex justify-center px-4 md:px-0 w-full   bg-white border-2 border-gray-300 rounded-3xl ">
      <div className="w-full  h-auto md:h-40 flex relative overflow-hidden mb-4">
        <div className="px-4 py-4 md:px-6 md:py-4 w-full md:w-10/12">
          <div className="font-bold font-comic text-wrap text-base md:text-xl mb-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
            {promptText}
          </div>
          <p className="text-gray-700 font-bold text-wrap font-comic pt-4 md:pt-8 text-sm md:text-base">
            Category: {promptCategory.join(",")}
          </p>
        </div>

     
        <div
          onClick={handleClick}
          className="absolute right-4 top-4 md:right-10 md:top-10 flex cursor-pointer justify-end"
        >
          <Image
            src={Pencil}
            alt="Pencil"
            width={24}
            height={24}
            className="md:w-auto md:h-auto"
          />
          {/* <h1>hello</h1> */}
        </div>

      </div>
    </div>
  );
};

export default ContestPrompt;
