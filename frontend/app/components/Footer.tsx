"use client"
import footer from "@/public/Footer.svg"
import Image from "next/image"
import { usePathname } from "next/navigation"
const Footer = () => {
  const path=usePathname();
  if(path === "/login" || path === "/signup"||path.startsWith("/admin")){
  return (
    <div className=" hidden justify-center items-center  " >
     <Image src={footer} alt="footer" className="w-screen" ></Image>
    </div>
  )
}else{
  return(
    <div className=" flex justify-center h-full items-center   " >
    <Image src={footer} alt="footer" className="w-screen" ></Image>
   </div>
  );
}
}

export default Footer