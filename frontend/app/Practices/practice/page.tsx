
import TopWriting from "../../components/Others/TopWriting";
import WeeklyTest from "../../components/Others/WeeklyTest";
import Categories from "@/app/components/Categories";
import Bee from "@/public/Game/cloud3.svg"
import Cloud from "@/public/Game/cloud.svg"
import Image from "next/image";
import Prompt from "@/app/components/Practice/Prompt";
import { SimpleEditor } from "@/app/components/WriteStory";
import Pagination from "@/app/components/Pagination";
const page = () => {
  return (
    <div className="w-full h-[1900px]   mt-6 z-0 relative  flex justify-center">
       
      <div className="w-10/12 h-screen  ms-12 ">
       <div className="w-full h-32  relative pt-4  " >

        <h1 className="text-5xl pt-4 ps-16 font-bold font-comic " >Selected prompt Title</h1>
        
     
     
       </div>
       <div className="flex w-[100%]   relative mt-0  " >
        <div className="absolute  -top-40 mt-3  -left-48">
            <Image src={Bee} alt="bee"></Image>
        </div>
        <div className=" gap-8 border-game relative w-4/5 flex flex-col" >
        <form action="" className=" height-[800px]  ">
        <div className="flex flex-col w-full items-center   gap-8 h-96 ">
          <div className="flex gap-5">
        <input  className="border border-gray-500 z-10 text-xl rounded-3xl indent-7 w-[38vw] h-12 focus:outline-none focus:border-yellow-600"  placeholder='Email or Username comma separated' />
        <button type="submit" className='text-white hover:opacity-80 bg-black border text-2xl font-bold font-comic rounded-full w-40 h-12'>Invite</button>
          </div>
          <div>
        <input  className="border border-gray-500 z-10 text-xl rounded-3xl indent-7 w-[50vw] h-12 focus:outline-none focus:border-yellow-600"  placeholder='Untitled Story' />
        
          </div>
          <div>
            <Categories></Categories>
          </div>
          <div className="h-[800px] rounded-full ">
            <SimpleEditor ></SimpleEditor>
          </div>
          <div className=" h-28 ">
          <button  className='text-white bg-black border text-2xl font-bold font-comic rounded-full w-[50vw] h-14'>Submit Story</button>
          </div>
       </div>
        </form>
          {/* <div className="absolute top-1/2 left-1">
            <Image src={Cloud} alt="cloud"></Image>
          </div> */}
        </div>
        <div className=" flex flex-col gap-8">
            <div className="flex flex-wrap w-96 gap-4 font-comic ">
             <div >
                <button className="w-40 h-14 bg-black text-white hover:opacity-80 font-bold text-2xl rounded-full ">Grammer</button>
             </div>
             <div>
                <button className="w-40 h-14 bg-black text-white hover:opacity-80 font-bold text-2xl rounded-full ">Rewrite</button>
             </div>
             <div>
                <button className="w-40 h-14 bg-black text-white hover:opacity-80 font-bold text-2xl rounded-full ">Improve</button>
             </div>
             <div>
                <button className="w-40 h-14 bg-black text-white hover:opacity-80 font-bold text-2xl rounded-full ">PDF</button>
             </div>
            </div>
         <WeeklyTest></WeeklyTest>
         <TopWriting></TopWriting>
        </div>
       </div>
       <div className="mt-10 flex flex-col gap-10 ms-10 w-[60vw]">
        <Prompt></Prompt>
        
       </div>
        <div className="w-full ms-28 mt-10">
          <Pagination></Pagination>
        </div>
      </div>

    </div>
  )
}

export default page