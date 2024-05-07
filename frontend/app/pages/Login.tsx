"use client"
import Earth from "../../public/Landingpage-img/earth.svg";
import Group from "../../public/Loginsignup-img/Group (2).svg"
import Group2 from "../../public/Loginsignup-img/Group.svg"
import Group3 from "../../public/Loginsignup-img/Group (1).svg"
import Vector from "../../public/Loginsignup-img/Vector (1).svg"
import Vector1 from "../../public/Loginsignup-img/Vector.svg"
import yellowvector from "@/public/Loginsignup-img/Vector-yellow.svg"
import Rocket from "../../public/Loginsignup-img/rocket.svg"
import Sun from "../../public/Loginsignup-img/sun.svg"
import logo from "@/public/Landingpage-img/logo.svg"
import InputField from "../components/InputFIelds";
import Button from "../components/Button";
import Image from "next/image";
import Link from "next/link";
const Login = () => {
 function handlechange(){
  console.log("working")
 }
  return (
    <div className="overflow-hidden  two-line-bg  " >
       <Link href="/">
     <div className="ms-10 mt-10">
      <Image src={logo} alt="logo"></Image>
     </div>
      </Link>
      <div className=" flex flex-col -mt-20  h-full items-center" >
      <h1  className="text-center font-comic  text-4xl pt-6 " >  <span className="font-bold" >Hello!</span> Welcome to Writeasy</h1>

      <form action="" className="relative font-comic mt-14 z-10 " >
      <InputField type="email" placeholder="Email"   onChange={handlechange} />
     
      <InputField type="password" placeholder="Password"  onChange={handlechange} />
    <h1 className= "text-end pt-4 font-comic text-sm underline font-bold " > <a href="#">  Forgot Password? </a>
    </h1>
     
      <Button type="login" >Login</Button>
      <h1 className= "text-center pt-2  font-bold " >or
    </h1>
    <Button type="google" ></Button>
    <h1 className="text-center font-comic pt-4" >Don't have an account? <Link href="/signup" className="font-bold" >Signup</Link></h1>
      <div className="absolute w-32 h-16 -top-4 -right-28 ">
        <Image src={Rocket}  ></Image>
      </div>
      </form>
      <div className="absolute top-60 w-20 h-10 left-10 ">
        <Image src={Group2} ></Image>
      </div>
      <div className="absolute  top-20 right-0 ">
        <Image src={yellowvector}  ></Image>
      </div>
      
      <div className="absolute left-80  top-28 ">
        <Image src={Sun} ></Image>
      </div>
      </div>
       
      <div className="relative mt-4 " >
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

export default Login