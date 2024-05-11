'use client'
import React from 'react';
import Logo from "@/public/Landingpage-img/logo.svg"
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import 'usePathname' from 'next/navigation'
import { useRouter } from 'next/navigation'
import UserMenu from './UserMenu';
interface NavbarProps {
  titles: { label: string; path: string }[]; // Update type definition
}

const Navbar: React.FC<NavbarProps> = ({ titles }) => {
  const path = usePathname(); // Get current path
  const router = useRouter()
  if(path === "/login" || path === "/signup"){

  
  return (
    <nav className="navbar hidden  w-screen sticky top-0 h-28 justify-between items-center bg-custom-yellow p-6 z-50">
      <Link href="/">
        <div className="flex cursor-pointer flex-col w-60 items-center justify-center flex-shrink-0 mr-6">
          <Image src={Logo} alt='logo' />
        </div>
      </Link>
      <div className="w-full flex justify-center lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow flex justify-center gap-2">
          <ul className="flex justify-center mr-28 items-center font-comic text-xl ">
            {titles.map(link => {
            const isActive = path.startsWith(link.path) || path.includes(link.path);
              return (
                <li  key={`${link.label}-${link.path}`} className={isActive ? 'active w-32 h-8' : 'px-6 py-2 text-center hover:text-white '}>
                  <Link
                    className=" pt-5 ps-6  cursor-pointer hover:text-white"
                    href={link.path}
                  >
                    {link.label}  
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className='justify-center mr-20 flex gap-4 items-center'>
          {/* <button onClick={() => router.push('/login')} className='text-2xl font-bold text-center bg-custom-yellow border-2 w-20 h-12 hover:bg-white rounded-3xl border-black text-black font-comic'>Login</button>
          <button onClick={() => router.push('/signup')} className='text-2xl font-bold text-center bg-black border-2 w-32 h-12 rounded-3xl hover:opacity-80 border-black text-white font-comic'>Sign up</button> */}
          <UserMenu></UserMenu>
        </div>
      </div>
    </nav>
  );
}else{
  return(
  <nav className="navbar flex  w-screen sticky top-0 h-28 justify-between items-center bg-custom-yellow p-6 z-50">
      <Link href="/">
        <div className="flex cursor-pointer flex-col w-60 items-center justify-center flex-shrink-0 mr-6">
          <Image src={Logo} alt='logo' />
        </div>
      </Link>
      <div className="w-full flex justify-center lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow flex justify-center gap-2">
          <ul className="flex justify-center mr-28 items-center font-comic text-xl ">
            {titles.map(link => {
              const isActive = path === link.path; // Check if the link is active
              return (
                <li  key={`${link.label}-${link.path}`} className={isActive ? 'active w-32 h-8' : 'px-6 py-2 text-center hover:text-white '}>
                  <Link
                    className=" pt-5 ps-6  cursor-pointer hover:text-white"
                    href={link.path}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className='justify-center mr-20 flex gap-4 items-center'>
          {/* <button onClick={() => router.push('/login')} className='text-2xl font-bold text-center bg-custom-yellow border-2 w-20 h-12 hover:bg-white rounded-3xl border-black text-black font-comic'>Login</button>
          <button onClick={() => router.push('/signup')} className='text-2xl font-bold text-center bg-black border-2 w-32 h-12 rounded-3xl hover:opacity-80 border-black text-white font-comic'>Sign up</button> */}
          <UserMenu></UserMenu>
        </div>
      </div>
    </nav>
  );

}
};

export default Navbar;
