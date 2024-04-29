import Image from "next/image"
import Group14 from "../../public/Landingpage-images/Group (14).png"
import Group15 from "../../public/Landingpage-images/Group (15).png"
import Group16 from "../../public/Landingpage-images/Group (16).png"
const Pricing = () => {
  return (
    < div className=" bg-custom-yellow  w-full h-[756px] -mt-40 " >
      <h1 className="text-center text-4xl pt-10 font-bold " >Pricing</h1>
    <div className="flex justify-center items-center h-full w-full  relative  " >
      <div className="absolute -top-20 right-0  " >
        <Image src={Group14} alt="" />
      </div>
      <div className="absolute  top-16 left-32 " >
        <div className=" w-full h-full relative" >

        
        <div className="flex absolute top-28 right-44 " >
      <h2 className="text-3xl font-bold " >Free </h2>
        </div>
        <div className="absolute bottom-20 right-32" >
          <button className="border-2 hover:bg-slate-200 border-slate-700 bg-white rounded-3xl text-black w-40 h-10" >Sign up</button>
        </div>
        <Image src={Group16} alt="" />
        </div>
      </div>
      <div className="absolute  top-14 right-32 " >
        <div className=" w-full h-full relative" >

        
        <div className="flex absolute top-28 right-44 " >
      <h2 className="text-3xl font-bold" >20 </h2><span className="pt-2" >/month</span> 
        </div>
        <div className="absolute bottom-20 right-32" >
          <button className="border hover:bg-slate-800 border-slate-400 bg-black rounded-3xl text-white w-40 h-10" >Sign up</button>
        </div>
        <Image src={Group15} alt=""  />
        </div>
      </div>
    </div>
    </div>
  )
}

export default Pricing