"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import 'usePathname' from 'next/navigation'
import { useRouter } from 'next/navigation';
import { IoMdArrowRoundBack } from "react-icons/io";
const Navbar = () => {
  const path = usePathname(); // Get current path
  const router = useRouter();
  return (
    <nav className="flex   items-center p-4 px-28 bg-custom-yellow text-black font-poppins text-3xl shadow-lg">
      <div className="text-2xl font-bold ">
        <Link className="hover:opacity-60 transition duration-300 flex gap-2 " href="/">
        <IoMdArrowRoundBack className='active w-20 h-10' />

     
        </Link>
      </div>
     
    </nav>
  );
};

export default Navbar;
