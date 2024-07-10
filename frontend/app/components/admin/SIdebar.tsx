"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import icons from React Icons

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const links = ['practices', 'contests', 'games', 'stories', 'email', 'faq', 'category', 'user'];
  const path = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
     <div className="lg:hidden flex justify-between items-center p-4 bg-gray-900 text-white">
       
        <button onClick={toggleSidebar}>
          {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
        </button>
       </div>
     
      <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-10 ${isOpen ? 'block' : 'hidden'} lg:hidden`} onClick={toggleSidebar} />
      <div
        className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition duration-300 ease-in-out z-20 w-64 bg-gray-900 shadow-md rounded-sm lg:sticky lg:top-0 text-white font-poppins font-bold p-6`}
      >
        <ul className="space-y-4">
          {links.map((link) => {
            const isActive = path.startsWith(`/admin/${link}`);
            return (
              <li key={link} className="text-center">
                <Link
                  className={`block text-lg font-medium py-2 rounded transition duration-300 ${
                    isActive ? 'bg-gray-700' : 'hover:bg-gray-700 hover:text-white'
                  }`}
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
