"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import 'usePathname' from 'next/navigation'
import { useRouter } from 'next/navigation';
import { IoMdArrowRoundBack } from "react-icons/io";
import Logo from "@/public/Landingpage-img/logo.svg"
import Image from 'next/image';
const Navbar = () => {
  const path = usePathname(); // Get current path
  const router = useRouter();
  return (
    <nav className="flex  justify-around items-center p-4  bg-custom-yellow text-black font-poppins text-3xl shadow-lg">
      <div className="text-2xl font-bold ">
        <Link className="hover:opacity-60 transition duration-300 flex gap-2 " href="/">
        <IoMdArrowRoundBack className='active w-20  h-10' />

     
        </Link>
      </div>
      <div>
        <Image src={Logo} layout='responsive'  alt="logo"></Image>
      </div>
    </nav>
  );
};

export default Navbar;