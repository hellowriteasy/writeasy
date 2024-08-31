"use client";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import 'usePathname' from 'next/navigation'
import { useRouter } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";
import Logo from "@/public/Landingpage-img/logo.svg";
import Image from "next/image";
import useAdminSidebarStore from "@/app/store/useSidebarStore";
import { FaTimes } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";
const Navbar = () => {
  const path = usePathname(); // Get current path
  const router = useRouter();
  const { adminSidebarOpen, toggleSidebar } = useAdminSidebarStore();
  return (
    <nav className="flex  space-x-4 sm:justify-between items-center p-4  bg-custom-yellow text-black font-poppins text-3xl shadow-lg">
      <Link href={"/"}>
        <Image src={Logo} layout="responsive" alt="logo"></Image>
      </Link>
      {/* <div className="text-2xl font-bold ">
        <Link
          className="hover:opacity-60 transition duration-300 flex gap-2 "
          href="/"
        >
          <IoMdArrowRoundBack className="active w-20  h-10" />
        </Link>
      </div> */}
      <button onClick={toggleSidebar} className="ml-auto">
        {adminSidebarOpen ? (
          <FaTimes className="h-6 w-6" />
        ) : (
          <FaBars className="h-6 w-6" />
        )}
      </button>
    </nav>
  );
};

export default Navbar;
