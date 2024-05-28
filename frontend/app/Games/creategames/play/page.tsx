
import TopWriting from "../../../components/Others/TopWriting";
import WeeklyTest from "../../../components/Others/WeeklyTest";
import Categories from "@/app/components/Categories";
import Bee from "@/public/Game/cloud3.svg"
import Cloud from "@/public/Game/cloud.svg"
import Image from "next/image";
import { SimpleEditor } from "@/app/components/WriteStory";
import Pagination from "@/app/components/Pagination";
const page = () => {
  return (
    <div className="w-full h-[1300px]   mt-6 z-0 relative  flex justify-center">
       
      <div className="w-10/12 h-screen ms-12 ">
       <div className="w-full h-60  relative pt-4  " >

        <h1 className="text-6xl pt-4 font-bold font-comic " >Setting text of this story </h1>
        <div className='w-full relative pt-6 flex h-20'>
        <div className='w-10 absolute h-10 left-3 bg-slate-500 rounded-full border'>
        <Image src="" alt=''></Image>
        </div>
        <div className='w-10 h-10 absolute left-8 bg-slate-500 rounded-full border'>
        <Image src="" alt=''></Image>
        </div>
        <h5 className='absolute left-20 pt-2' >Story by<span className='font-bold'>Alice, Bob</span> and  <span className='font-bold'>2 others</span></h5>
      </div>
     
     
       </div>
       <div className="flex w-[100%]  relative mt-0  " >
        <div className="absolute  -top-40 mt-3  -left-48">
            <Image src={Bee} alt="bee"></Image>
        </div>
        <div className=" gap-8 relative w-4/5 flex flex-col" >
        <form action="" className=" height-[800px]  ">
        <div className="flex flex-col w-full items-center   gap-4 h-96 ">
          <div>
        <input  className="border border-gray-500 z-10 text-xl rounded-3xl indent-7 w-[40vw] h-12 focus:outline-none focus:border-yellow-600"  placeholder='Email or Username comma separated' />
        <button type="submit" className='text-white bg-black border text-2xl font-bold font-comic rounded-full w-40 h-14'>Invite</button>
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
          <div className=" ">
          <button  className='text-white bg-black border text-2xl font-bold font-comic rounded-full w-[50vw] h-14'>Submit Story</button>
          </div>
       </div>
        </form>
          {/* <div className="absolute top-1/2 left-1">
            <Image src={Cloud} alt="cloud"></Image>
          </div> */}
        </div>
        <div className=" flex flex-col gap-8">
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