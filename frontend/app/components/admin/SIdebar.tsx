"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons from React Icons

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const links = [
    "practices",
    "contests",
    "games",
    "stories",
    "email",
    "faq",
    "category",
    "user",
  ];
  const path = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="lg:hidden flex justify-between items-center p-2  text-white">
        <button onClick={toggleSidebar} className="">
          {isOpen ? (
            <FaTimes className="h-6 w-6" />
          ) : (
            <FaBars className="h-6 w-6" />
          )}
        </button>
      </div>

      <div
        className={`fixed inset-0  z-10 ${
          isOpen ? "block" : "hidden"
        } lg:hidden`}
        onClick={toggleSidebar}
      />
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition duration-300 ease-in-out z-20 w-64  rounded-sm lg:sticky lg:top-0 text-white font-poppins font-bold `}
      >
        <ul className="">
          {links.map((link) => {
            const isActive = path.startsWith(`/admin/${link}`);
            return (
              <li
                key={link}
                className={`text-start h-16 px-3 flex items-center cursor-pointer  border-t border-white ${
                  isActive
                    ? "bg-custom-yellow text-black border-t border-white  "
                    : "hover:bg-custom-yellow hover:text-black text-black"
                }`}
              >
                <Link
                  className={`block text-lg  font-medium py-2 rounded transition duration-300 `}
                  href={`/admin/${link}`}
                  onClick={toggleSidebar} // Close the sidebar when a link is clicked
                >
                  {link.charAt(0).toUpperCase() + link.slice(1)}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
