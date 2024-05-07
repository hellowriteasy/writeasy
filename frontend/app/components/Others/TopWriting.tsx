import Image from "next/image"
import Crown from "@/public/Game/Crown.svg"
const TopWriting = () => {
  return (
    <div className="w-[360px] h-[588px] flex justify-center relative yellow border-4 border-yellow-500 rounded-3xl" >
      <div className="absolute -top-9 -right-12" >
      <Image src={Crown}  alt="Crown"  />
      </div>
        
      <div className="text-center w-11/12 pt-4 text-3xl font-bold" >

      <h2 className="font-comic font-bold">Top writings  of previous week</h2>
      </div>
    </div>
  )
}

export default TopWriting