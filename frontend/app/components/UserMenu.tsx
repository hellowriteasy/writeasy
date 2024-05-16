'use client'
import { useState } from "react";
import { FaAngleDown } from "react-icons/fa6";
import { IoPersonSharp } from "react-icons/io5";
import Link from "next/link";
import axios from "axios";
import useAuthStore from '../store/useAuthStore';

const UserMenu = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  const options = [
    { label: 'My Profile', value: 'profile' },
    { label: 'Settings', value: 'setting' },
    { label: 'Logout', value: 'logout' },
  ];

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleMouseEnter = () => {
    setShowOptions(true);
  };

  const handleMouseLeave = () => {
    setShowOptions(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout");
      logout();
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  return (
    <div 
      className="relative w-48 cursor-pointer" 
      onMouseEnter={handleMouseEnter} 
    >
      <div className="relative">
        <div className="w-full text-white h-14 text-center font-bold text-2xl font-comic bg-black border border-black rounded-3xl px-4 py-2 pr-7 focus:outline-none focus:border-black">
          {selectedOption || "Types"}
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
        <div onMouseLeave={handleMouseLeave} className="absolute w-full mt-2 bg-white border border-black rounded-lg shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              className="px-4 py-2 h-9 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                if (option.value === 'logout') {
                  handleLogout();
                }
                setSelectedOption(option.label);
                setShowOptions(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserMenu;
