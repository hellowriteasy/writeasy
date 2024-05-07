 "use client"

import Earth from "../../public/Landingpage-img/earth.svg";
import Group from "../../public/Loginsignup-img/Group (2).svg"
import Group2 from "../../public/Loginsignup-img/Group.svg"
import Group3 from "../../public/Loginsignup-img/Group (1).svg"
import Vector from "../../public/Loginsignup-img/Vector-yellow.svg"
import Vector1 from "../../public/Loginsignup-img/Vector.svg"
import Rocket from "../../public/Loginsignup-img/rocket.svg"
import Sun from "../../public/Loginsignup-img/sun.svg"
import logo from "@/public/Landingpage-img/logo.svg"
import InputField from "../components/InputFIelds";
import Button from "../components/Button";
import Image from "next/image";
import Link from "next/link";
const Signup = () => {
  const navTitles = ['Practice', 'Contest', 'Game', 'Login'];
function handlechange(){

}
  return (
    <div className="overflow-hidden two-line-bg " >
      <Link href="/">
     <div className="ms-10 mt-10">
      <Image src={logo} alt="logo"></Image>
     </div>
      </Link>
      <div className=" flex flex-col  -mt-20 h-[500px] items-center  overflow-hidden" >
      <h1  className="text-center text-4xl pt-6 font-comic " >  <span className="font-bold" >Hello!</span> Welcome to Writeasy</h1>

      <form action="" className="relative flex flex-col gap-2 font-comic mt-10 z-10 " >
      <InputField type="email" placeholder="Email"   onChange={handlechange} />
      <InputField type="username" placeholder="Username"  onChange={handlechange} />
      <InputField type="password" placeholder="Password"  onChange={handlechange} />
      <InputField type="password" placeholder="Confirm Password"  onChange={handlechange} />
      
      <Button type="signup">signup</Button>
       <h1 className="text-center font-comic pt-6" >Already have an account? <Link href="/login" className="font-bold" >Login</Link></h1>
      <div className="absolute w-32 h-16 -top-4 -right-28 ">
        <Image src={Rocket}  ></Image>
      </div>
      </form>
      <div className="absolute top-60 w-20 h-10 left-10 ">
        <Image src={Group2} ></Image>
      </div>
      <div className="absolute top-20 right-0 ">
        <Image src={Vector}  ></Image>
      </div>
      
      <div className="absolute  left-80  top-28  ">
        <Image src={Sun} ></Image>
      </div>
      </div>
       
      <div className="relative  " >
      <div className="absolute left-80 bottom-24">
        <Image src={Group} height={200} ></Image>
      </div>
      <div className="absolute right-60 bottom-24">
        <Image src={Group3} height={200} ></Image>
      </div>
      <div className="absolute right-6 bottom-20 ">
        <Image src={Vector1} height={300} ></Image>
      </div>
        <Image className=" w-screen" src={Earth} ></Image>
      </div>
    
    </div>
  )
}

export default Signup