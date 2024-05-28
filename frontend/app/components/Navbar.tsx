'use client'
import React, { useEffect, useState } from 'react';
import Logo from "@/public/Landingpage-img/logo.svg";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import UserMenu from './UserMenu';
import useAuthStore from '../store/useAuthStore';

interface NavbarProps {
  titles: { label: string; path: string }[];
}

const Navbar: React.FC<NavbarProps> = ({ titles }) => {
  const path = usePathname();
  const router = useRouter();
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchLoggedInState = async () => {
      setIsLoading(false);
    };
    fetchLoggedInState();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const navContent = (
    <>
      <Link href="/">
        <div className="flex cursor-pointer flex-col w-40 sm:w-60 items-center justify-center flex-shrink-0 mr-6">
          <Image src={Logo} alt='logo' />
        </div>
      </Link>
      <div className="w-full flex justify-center lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow flex justify-center gap-2">
          <ul className="flex justify-center mr-4 sm:mr-28 items-center font-comic text-xl">
            {titles.map(link => {
              const isActive = path.startsWith(link.path) || path.includes(link.path);
              return (
                <li key={`${link.label}-${link.path}`} className={isActive ? 'active w-24 sm:w-32 h-8' : 'px-4 sm:px-6 py-2 text-center hover:text-white'}>
                  <Link className="pt-5 ps-6 cursor-pointer hover:text-white" href={link.path}>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="justify-center mr-4 sm:mr-20 flex gap-2 sm:gap-4 items-center">
          {loggedIn ? (
            <UserMenu />
          ) : (
            <div className="flex gap-2 sm:gap-4">
              <button onClick={() => router.push('/login')} className="text-lg sm:text-2xl font-bold text-center bg-custom-yellow border-2 w-16 sm:w-20 h-10 sm:h-12 hover:bg-white rounded-3xl border-black text-black font-comic">Login</button>
              <button onClick={() => router.push('/signup')} className="text-lg sm:text-2xl font-bold text-center bg-black border-2 w-24 sm:w-32 h-10 sm:h-12 rounded-3xl hover:opacity-80 border-black text-white font-comic">Sign up</button>
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (path === "/login" || path === "/signup" || path.startsWith("/admin")) {
    return (
      <nav className="navbar hidden w-screen sticky top-0 h-28 justify-between items-center bg-custom-yellow p-6 z-50">
        {navContent}
      </nav>
    );
  } else {
    return (
      <nav className="navbar flex w-screen sticky top-0 h-28 justify-between items-center bg-custom-yellow p-6 z-50">
        {navContent}
      </nav>
    );
  }
};

export default Navbar;
