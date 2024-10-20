"use client";
import React, { useState } from "react";
import Logo from "../../public/Landingpage-img/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "./UserMenu";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

interface NavbarProps {
  titles: { label: string; path: string }[];
}

const Navbar: React.FC<NavbarProps> = ({ titles }) => {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navContent = (
    <>
      <div className="flex items-center justify-between w-full ">
        <Link href="/">
          <div className="flex min-w-20 cursor-pointer items-center flex-shrink-0 mr-6">
            <Image
              src={Logo}
              layout="responsive"
              objectFit="contain"
              alt="logo"
            />
          </div>
        </Link>
        <div className="mid:hidden md:flex md:flex-grow justify-center">
          <ul className="flex justify-center w-full items-center font-unkempt text-xl space-x-2">
            {titles.map((link) => {
              const isActive =
                path.startsWith(link.path) || path.includes(link.path);
              return (
                <li
                  key={`${link.label}-${link.path}`}
                  className={
                    isActive
                      ? "cursor-pointer active px-6 py-2 rounded-full text-center"
                      : "cursor-pointer py-2 px-6 rounded-full text-center"
                  }
                >
                  <Link
                    href={link.path}
                    className="pt-5 text-[1.4vw] font-bold cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="hidden md:flex mid:hidden items-center space-x-5">
          <UserMenu />
        </div>
        <div className="md:hidden mid:block flex items-center">
          <button
            onClick={toggleMenu}
            className="text-black focus:outline-none"
          >
            {/* {isOpen ? (
              <XMarkIcon className="h-8 w-8" />
            ) : ( */}
            <Bars3Icon className="h-8 w-8" />
            {/* )} */}
          </button>
        </div>
      </div>
    </>
  );

  // Conditional rendering based on the path
  if (
    path.includes("admin") ||
    path.includes("signup") ||
    path.includes("login")
  ) {
    return null; // Hide navbar for admin, signup, and login pages
  }

  return (
    <nav className="navbar flex w-full sticky top-0 h-28 justify-between items-center bg-custom-yellow p-6 z-50 font-unkemptbell">
      {navContent}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-custom-yellow p-6 flex flex-col items-center space-y-6 z-50 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out `}
      >
        <button
          onClick={toggleMenu}
          className="self-end text-black focus:outline-none mb-4"
        >
          <XMarkIcon className="h-8 w-8" />
        </button>
        <ul className="flex flex-col items-center gap-6 font-unkempt text-md">
          {titles.map((link) => {
            const isActive =
              path.startsWith(link.path) || path.includes(link.path);
            return (
              <li
                key={`${link.label}-${link.path}`}
                className={
                  isActive
                    ? " cursor-pointer active px-6 py-2 rounded-full text-center"
                    : "cursor-pointer py-2 px-6 rounded-full text-center"
                }
              >
                <Link
                  href={link.path}
                  onClick={toggleMenu}
                  className="pt-5 text-xl font-bold cursor-pointer"
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex justify-center items-center  flex-col gap-4 w-full">
          <UserMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
