import Navbar from "../components/Navbar";
import Prompt from "../components/Others/Prompt";
import TopWriting from "../components/Others/TopWriting";
import WeeklyTest from "../components/Others/WeeklyTest";
import earth from "@/public/Game/earth.svg"
import A from "@/public/Game/A.svg"
import Dumbelman from "@/public/Game/dumbelman.svg"

import Bee from "@/public/Game/Bee.svg"
import Cloud from "@/public/Game/cloud.svg"
import Image from "next/image";
import Join from "../components/contest/Join"
import Contestitle from "../components/contest/Contestitle"
import Pagination from "@/app/components/Pagination";
const page = () => {
  return (
    <div className="w-full h-[1300px]   mt-6 z-0 relative  flex justify-center">
        <div className="absolute   -top-14 right-0">
          <Image src={earth} alt="earth" ></Image>  
        </div>
      <div className="w-10/12 h-screen ms-12 ">
       <div className="w-full h-60  relative pt-4  " >

        <h1 className="text-6xl font-bold font-comic " >Enter the Contest Arena</h1>
        <div className="absolute top-6 right-20
        ">
            <Image src={A} alt="group" ></Image>
        </div>
        <div className="absolute top-10 right-48">
            <Image src={Dumbelman} alt="group" ></Image>
        </div>
        <p className="text-xl font-comic pt-4 ">Compete with young writers worldwide and unleash your creativity.</p>
       </div>
       <div className="flex w-full h-auto relative mt-0 items-center justify-around" >
        <div className="absolute  -top-40  -left-32">
            <Image src={Bee} alt="bee"></Image>
        </div>
        <div className=" gap-8 relative  flex flex-col" >
           <Join></Join>
          <Contestitle></Contestitle>
          <div className="absolute bottom-32 -left-40">
            <Image src={Cloud} alt="Cloud" ></Image>
          </div>
          <Contestitle></Contestitle>
          <Contestitle></Contestitle>
          
        </div>
        <div className=" flex -mt-16  flex-col gap-8">
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

export default page