'use client'
import { useState, useEffect } from "react";
import { FaAngleDown } from "react-icons/fa6";
import { IoPersonSharp } from "react-icons/io5";
import axios from "axios";
import useAuthStore from '../store/useAuthStore';
import Link from "next/link";
const UserMenu = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const username=useAuthStore((state)=>state.username)
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout");
      logout();
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  // Ensure options are not shown during the initial server render
  useEffect(() => {
    setShowOptions(false);
  }, []);
   
  return (
    <div 
      className="relative w-60 cursor-pointer" 
      onMouseEnter={() => setShowOptions(true)} 
     
    >
      <div className="relative font-comic">
        <div className="w-full text-white h-14 text-center font-bold text-2xl font-comic bg-black border border-black rounded-3xl px-4 py-2 pr-7 focus:outline-none focus:border-black">
          {selectedOption || `${username}`}
        </div>
        <div className="pointer-events-none absolute inset-y-0 -left-2 bg-white rounded-full flex items-center px-2 text-white">
          <IoPersonSharp className="w-10 h-5 text-black" />
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center px-2 text-white">
          <FaAngleDown className="text-3xl" />
        </div>
      </div>
      {/* Custom dropdown options */}
      {showOptions && (
        <div  onMouseLeave={() => setShowOptions(false)} className="absolute w-full mt-2 text-slate-900 bg-white border border-black rounded-lg shadow-lg">
          <Link href="/profile">
          <div
            className="px-4 py-2 h-9 cursor-pointer hover:bg-gray-200"
            onClick={() => {
              setSelectedOption('My Profile');
              setShowOptions(false);
            }}
          >
            My Profile
          </div>
          </Link>
          <Link href="/setting">
          <div
            className="px-4 py-2 h-9 cursor-pointer hover:bg-gray-200"
            onClick={() => {
              setSelectedOption('Settings');
              setShowOptions(false);
            }}
          >
            Settings
          </div>
          </Link>
          <div
            className="px-4 py-2 h-9 cursor-pointer hover:bg-gray-200"
            onClick={() => {
              handleLogout();
              setSelectedOption('Logout');
              setShowOptions(false);
            }}
            >
            Logout
            </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
