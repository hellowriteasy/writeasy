'use client'
import React, { useState, useEffect } from 'react';
import Logo from "@/public/Landingpage-img/logo.svg";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import UserMenu from './UserMenu';
import useAuthStore from '../store/useAuthStore';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface NavbarProps {
  titles: { label: string; path: string }[];
}

const Navbar: React.FC<NavbarProps> = ({ titles }) => {
  const [loading, setLoading] = useState(true); // State to track loading status
  const path = usePathname();
  const router = useRouter();
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Clean up timeout
    return () => clearTimeout(timer);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navContent = (

    <>
      <div className="flex items-center justify-between w-11/12">
        <Link href="/">
          <div className="flex w-60 cursor-pointer items-center flex-shrink-0 mr-6">
            <Image src={Logo} alt='logo' />
          </div>
        </Link>
        <div className="hidden md:flex md:flex-grow  justify-center">
          <ul className="flex justify-center w-full items-center font-comic text-xl space-x-4">
            {titles.map(link => {
              const isActive = path.startsWith(link.path) || path.includes(link.path);
              return (
                <li key={`${link.label}-${link.path}`} className={isActive ? 'active sm:px-6 py-2  text-center  ' : ' sm:px-6 py-2 text-center '}>
                  <Link className="pt-5  text-[1.5vw] cursor-pointer" href={link.path}>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          {loggedIn ? (
            <UserMenu />
          ) : (
            <div className="flex gap-2 sm:gap-4">
              <button onClick={() => router.push('/login')} className="text-lg sm:text-2xl font-bold text-center bg-custom-yellow border-2 w-16 sm:w-20 h-10 sm:h-12 hover:bg-white rounded-3xl border-black text-black font-comic">Login</button>
              <button onClick={() => router.push('/signup')} className="text-lg sm:text-2xl font-bold text-center bg-black border-2 w-24 sm:w-32 h-10 sm:h-12 rounded-3xl hover:opacity-80 border-black text-white font-comic">Sign up</button>
            </div>
          )}
        </div>
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-black focus:outline-none">
            {isOpen ? <XMarkIcon className="h-8 w-8" /> : <Bars3Icon className="h-8 w-8" />}
          </button>
        </div>
      </div>
    </>
  );

  if (loading) {
    // Show loading effect
    return (
      <nav className="navbar flex w-screen sticky top-0 h-28 justify-between items-center bg-custom-yellow p-6 z-50">
        <div></div>
      </nav>
    );
  }

  // Once loaded, render the actual navbar content
  if(!path.includes("admin")|| path.includes("signup")|| path.includes("login")){
  return (
    <nav className="navbar flex w-screen sticky top-0 h-28 justify-between items-center bg-custom-yellow p-6 z-50">
      {navContent}
      <div className={`fixed top-0 left-0 h-full bg-custom-yellow p-4 flex flex-col items-center space-y-4 z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
        <button onClick={toggleMenu} className="self-end text-black focus:outline-none mb-4">
          <XMarkIcon className="h-8 w-8" />
        </button>
        <ul className="flex flex-col items-center gap-10 font-comic text-xl">
          {titles.map(link => {
            const isActive = path.startsWith(link.path) || path.includes(link.path);
            return (
              <li key={`${link.label}-${link.path}`} className={isActive ? 'active sm:px-6 py-2 text-center ' : ' sm:px-6 py-2 text-center '}>
                <Link className="pt-5  cursor-pointer " href={link.path} onClick={toggleMenu}>
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-col gap-4">
          {loggedIn ? (
            <UserMenu />
          ) : (
            <>
              <button onClick={() => { router.push('/login'); toggleMenu(); }} className="text-lg sm:text-2xl font-bold text-center bg-custom-yellow border-2 w-32 h-12 hover:bg-white rounded-3xl border-black text-black font-comic">Login</button>
              <button onClick={() => { router.push('/signup'); toggleMenu(); }} className="text-lg sm:text-2xl font-bold text-center bg-black border-2 w-32 h-12 rounded-3xl hover:opacity-80 border-black text-white font-comic">Sign up</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};}

export default Navbar;
