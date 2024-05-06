import Group from "@/public/Landingpage-img/groupqn.svg";
import Path from "@/public/Landingpage-img/path34.svg";
import Image from "next/image";

const FrequentlyAsked = () => {
  return (
    <div className="flex flex-col justify-center items-center w-screen">
      <div className="flex  ms-0 w-screen  justify-around items-center  mt-4  ">
        <div>
          <Image src={Group} alt="group" />
        </div>
        <div className="text-3xl flex-col -ma-20 gap-3  flex justify-center items-center font-bold ">
      <h1 className="text-center font-crayon text-7xl font-bold pt-10 ">Frequently Asked Question</h1>
          <div className="mt-5" >
            <h2>+ What is Writeasy?</h2>
          </div>
          <div className="mt-5" >
            <h2>+ What is Writeasy?</h2>
          </div>
          <div className="mt-5 " >
            <h2>+ What is Writeasy?</h2>
          </div>
          <div className="mt-5 " >
            <h2>+ What is Writeasy?</h2>
          </div>
      <div className="mt-4">
        <button className="mx-auto hover:bg-slate-200 bg-white text-black w-28 text-xl font-bold h-10 border-2 border-black rounded-3xl  ">More</button>
        </div>
      </div>
        <div className="mt-5 " >
          <Image src={Path} alt="path" />
        </div>
      </div>
    </div>
  );
};

export default FrequentlyAsked;
