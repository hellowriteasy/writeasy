import React from "react";
import Group from "@/public/Landingpage-img/groupqn.svg";
import Image from "next/image";
const PromptNotPublished = ({ publishDate }: { publishDate: string }) => {
  return (
    <div className="flex flex-col items-center gap-y-4">
      <Image src={Group} alt="user" />
      <p className="text-[18px] w-9/12 text-center">
        Prompt will be published on {publishDate}Till then you can practise with
        us
      </p>
      <button className="border text-xl mx-auto font-unkempt hover:bg-slate-800 border-slate-400 bg-black rounded-full text-white w-60 h-14">
        Practise Now
      </button>
      {/* <button>Practise Now</button> */}
    </div>
  );
};

export default PromptNotPublished;
