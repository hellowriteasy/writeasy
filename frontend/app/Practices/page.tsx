"use client"
import Navbar from "../components/Navbar";
import Prompt from "../components/Practice/Prompt";
import TopWriting from "../components/Others/TopWriting";
import WeeklyTest from "../components/Others/WeeklyTest";
import moon from "@/public/Game/moon.svg"
import book from "@/public/Game/book.svg"
import pencilman from "@/public/Game/pensilman.svg"
import Pagination from "@/app/components/Pagination";
import Bee from "@/public/Game/Bee.svg"
import Cloud from "@/public/Game/cloud.svg"
import Image from "next/image";
import SelectMenu from "@/app/components/Others/TypesButton";

const page = () => {
  return (
    <div className="w-full h-[1000px]   mt-6 z-0 relative  flex justify-center">
        <div className="absolute   -top-10 right-0">
          <Image src={moon} alt="moon" ></Image>  
        </div>
      <div className="w-10/12 h-screen ms-12 ">
       <div className="w-full h-60  relative pt-4  " >

        <h1 className="text-6xl font-bold font-comic " >Practice Your Craft</h1>
        <div className="absolute top-10 right-48">
            <Image src={book} alt="group" ></Image>
        </div>
        <div className="absolute -top-6 right-96">
            <Image src={pencilman} alt="group" ></Image>
        </div>
        <p className="text-2xl font-comic pt-4 ">Refine your skills with our AI-powered editor.</p>
       </div>
       <div className="flex w-full h-auto relative -mt-10 items-center justify-around" >
        <div className="absolute  -top-28  -left-32">
            <Image src={Bee} alt="bee"></Image>
        </div>
        <div className=" gap-8 relative  flex flex-col" >
          <div className="w-[50vw] flex justify-between items-center h-20">
           <h1 className="text-5xl ps-2 font-comic font-bold">All Prompts</h1>
            <SelectMenu></SelectMenu>
          </div>
          <Prompt></Prompt>
          <div className="absolute bottom-32 -left-40">
            <Image src={Cloud} alt="Cloud" ></Image>
          </div>
          <Prompt></Prompt>
          <Prompt></Prompt>
          
        </div>
        <div className=" flex mt-10  flex-col ">
         <TopWriting></TopWriting>
        </div>
       </div>
       <div className="w-full mt-10 ms-28">

         <Pagination></Pagination>
       </div>
      </div>

    </div>
  )
}

export default page