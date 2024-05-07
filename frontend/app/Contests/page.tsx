import Navbar from "../components/Navbar";
import Prompt from "../components/contest/Prompt";
import TopWriting from "../components/Others/TopWriting";
import WeeklyTest from "../components/Others/WeeklyTest";
import Cloud from "@/public/Game/cloud.svg"
import Cloud2 from "@/public/Game/cloud3.svg"
import Image from "next/image";
import Pagination from "@/app/components/Pagination";
const page = () => {

  return (
    <div className="w-full h-[1300px]   mt-6 z-0 relative  flex justify-center">
        
      <div className="w-10/12 h-screen ms-12 ">
       <div className="w-full h-10 text-center text-2xl font-comic relative pt-4  " >

       until 20:00 - Apr 19, 2024 GMT
       </div>
       <div className="flex w-full h-auto relative mt-0 items-center justify-around" >
        <div className="absolute  top-0  -left-40">
            <Image src={Cloud2} alt="cloud"></Image>
        </div>
        <div className=" gap-8 relative  flex flex-col" >
          <div className="w-[53vw]" >
            <h1 className="text-6xl font-comic font-bold p-10">#8: Contest Title</h1>
            <p className="text-xl" >Lörem ipsum son last epipreligt om pal avis, vire firen postnomi beslutsblindhet, ödleplåster ösm nyck. Disk pladat, inte FAR oaktat teradunas or ultrar artdöden och pimpa tehet pokål, fast nyprevis fengen. Icke-binär homomålig mura samt spehet pälogi stupstockspolitik de es, mobilblottare då larat sodigor teraprengar. 
             Antitön dinade: cirkulent att nörat boserade sohössade. Ben kvasipära trafficking askbränd previs ninar kåtir det nere innan dade och egot. Tren paska. Du kan vara drabbad. 
            </p>
          </div>
          <Prompt  ></Prompt>
          <Prompt></Prompt>
          <div className="absolute bottom-80 -left-32">
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

export default page