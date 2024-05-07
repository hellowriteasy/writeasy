import Image from "next/image"
import mic from "@/public/Game/Clip path group.svg"
const WeeklyTest = () => {
  return (
          <div className="w-[360px] h-[200px] flex justify-center items-center relative yellow border-4 border-yellow-500 rounded-3xl" >
          <div className="absolute -top-12 -right-12" >
          <Image src={mic}  alt="mic"  />
          </div>
            
          <div className="text-center font-comic w-11/12  text-3xl font-bold" >
    
          <h2>Enter Our Weekly Contests!</h2>
          <p className="text-sm pt-4" ><span className="font-bold">CLoses</span> at 20:00 - Apr 19, 2024 GMT</p>
          </div>
        </div>
  )
}

export default WeeklyTest