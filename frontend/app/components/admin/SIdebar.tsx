"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons from React Icons
import { TbWriting } from "react-icons/tb";
import { HiUserGroup } from "react-icons/hi";
import { SiBookstack } from "react-icons/si";
import { MdOutlineMail } from "react-icons/md";
import { FaQuestion } from "react-icons/fa";
import { BiHistory, BiSolidCategory } from "react-icons/bi";
import { FaUsersCog } from "react-icons/fa";
import { LuClipboardEdit } from "react-icons/lu";
import useAdminSidebarStore from "@/app/store/useSidebarStore";
import TopWritings from "@/app/admin/top-writings/page";

const Sidebar = () => {
  const { adminSidebarOpen, toggleSidebar } = useAdminSidebarStore();

  const links = [
    {
      practices: <TbWriting />,
    },
    { contests: <LuClipboardEdit /> },
    { games: <HiUserGroup /> },

    { stories: <SiBookstack /> },
    { email: <MdOutlineMail /> },
    { faq: <FaQuestion /> },
    { category: <BiSolidCategory /> },
    { user: <FaUsersCog /> },
    // { "top-writings": <HiUserGroup /> },
    {"Top-stories":<BiHistory/>}
  ] as Record<string, React.ReactNode>[];

  const path = usePathname();

  return (
    <>
      <div className="lg:hidden  flex justify-between items-start">
        {/* <button onClick={toggleSidebar} className="">
          {adminSidebarOpen ? (
            <FaTimes className="h-6 w-6" />
          ) : (
            <FaBars className="h-6 w-6" />
          )}
        </button> */}
      </div>
      <div
        className={`fixed inset-0  z-10 ${
          adminSidebarOpen ? "block" : "hidden"
        } lg:hidden`}
        onClick={toggleSidebar}
      />
      <div
        className={`fixed inset-y-0 left-0 transform ${
          adminSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition duration-300 ease-in-out z-20 w-64  rounded-sm lg:sticky lg:top-0 text-white font-poppins font-bold bg-white `}
      >
        <ul className="">
          {links.map((link) => {
            const key = Object.keys(link)[0];
            const isActive = path.startsWith(`/admin/${link}`);
            return (
              <Link
                key={key}
                className={`block text-lg  font-medium  rounded transition duration-300 `}
                href={`/admin/${key}`}
                onClick={toggleSidebar} // Close the sidebar when a link is clicked
              >
                <li
                  className={`text-start h-16 px-3 flex items-center gap-x-2 cursor-pointer  border-t border-white ${
                    isActive
                      ? "bg-custom-yellow text-black border-t border-white  "
                      : "hover:bg-custom-yellow hover:text-black text-black"
                  }`}
                >
                  {link[key]}
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
