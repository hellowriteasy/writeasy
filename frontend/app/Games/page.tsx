import Navbar from "../components/Navbar";
import Prompt from "../components/Others/Prompt";
import TopWriting from "../components/Others/TopWriting";
import WeeklyTest from "../components/Others/WeeklyTest";
import halfmoon from "@/public/Game/half_moon.svg"
import group from "@/public/Game/Group.svg"
import Bee from "@/public/Game/Bee.svg"
import Cloud from "@/public/Game/cloud.svg"
import Image from "next/image";
import Pagination from "@/app/components/Pagination";
const Games = () => {
  return (
    <div className="w-full h-[1300px]   mt-6 z-0 relative  flex justify-center">
        <div className="absolute   -top-14 right-0">
          <Image src={halfmoon} alt="halfmoon" ></Image>  
        </div>
      <div className="w-10/12 h-screen ms-12 ">
       <div className="w-full h-60  relative pt-4  " >

        <h1 className="text-6xl font-bold font-comic " >Embark on a Collaborative Adventure</h1>
        <div className="absolute top-2 -right-14">
            <Image src={group} alt="group" ></Image>
        </div>
        <p className="text-2xl font-comic pt-4 ">Team up with friends to create captivating stories together.</p>
       </div>
       <div className="flex w-full h-auto relative mt-0 items-center justify-around" >
        <div className="absolute  -top-40 mt-3  -left-32">
            <Image src={Bee} alt="bee"></Image>
        </div>
        <div className=" gap-8 relative  flex flex-col" >
          <Prompt></Prompt>
          <Prompt></Prompt>
          <Prompt></Prompt>
          <div className="absolute bottom-1/3 -left-32">
            <Image src={Cloud} alt="Cloud" ></Image>
          </div>
          <Prompt></Prompt>
          <Prompt></Prompt>
          
        </div>
        <div className=" flex -mt-28  flex-col gap-8">
         <WeeklyTest></WeeklyTest>
         <TopWriting></TopWriting>
        </div>
       </div>
        <div className="w-full ms-28 mt-10">
          <Pagination></Pagination>
        </div>
      </div>

    </div>
  )
}

export default Games