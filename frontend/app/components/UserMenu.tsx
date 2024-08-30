// components/UserMenu.js
"use client";
import { useState, useEffect } from "react";
import { FaAngleDown } from "react-icons/fa6";
import useAuthStore from "../store/useAuthStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { axiosInstance } from "../utils/config/axios";
import Image from "next/image";
import Logo from "@/public/Landingpage-img/logo.svg";
import { IoPersonSharp } from "react-icons/io5";
const UserMenu = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const username = useAuthStore((state) => state.username || "My Profile");
  const role = useAuthStore((state) => state.role); // Get the user's role
  const loggedIn = useAuthStore((state) => state.loggedIn); // Get the user's login status
  const profile_picture = useAuthStore((state) => state.profile_picture); // Get the user's login status
  const router = useRouter();
  const AxiosIns = axiosInstance("");

  const handleLogout = async () => {
    try {
      await AxiosIns.post("/auth/logout");
      logout();
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  useEffect(() => {
    setShowOptions(false);
  }, [loggedIn]);

  return (
    <div
      className="relative min-w-60 max-w-90 w-full font-comic cursor-pointer"
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      {loggedIn ? (
        <>
          <div className="relative flex font-comic justify-between items-center  bg-black border border-black rounded-full h-14  focus:outline-none focus:border-black">
            <div className="pointer-events-none  w-14 h-14 rounded-full  overflow-hidden  border-custom-yellow  border-4">
              {profile_picture && profile_picture.startsWith("https") ? (
                <img
                  className="w-full h-full object-cover  "
                  src={profile_picture}
                  alt="profile picture"
                />
              ) : (
                //
                <img
                  className="w-full h-full object-cover  "
                  src={
                    "https://firebasestorage.googleapis.com/v0/b/debai-d0809.appspot.com/o/images%2Ficon.ico?alt=media&token=efc7ea40-4104-49b7-b61b-42e4ba4a9da1"
                  }
                  alt="profile picture"
                />
              )}
            </div>
            <div className=" text-md text-white font-bold text-center">
              {selectedOption || `${username}`}
            </div>
            <div className="pointer-events-none inset-y-0  flex items-center px-2 text-white">
              <FaAngleDown className="text-[2vw]" />
            </div>
          </div>

          {showOptions && (
            <div className="absolute w-full text-slate-900 bg-white border border-black rounded-lg shadow-lg">
              <Link href="/profile">
                <div
                  className="px-4 py-2 h-9 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setSelectedOption("My Profile");
                    setShowOptions(false);
                  }}
                >
                  My Writings
                </div>
              </Link>
              <Link href="/setting">
                <div
                  className="px-4 py-2 h-9 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setSelectedOption("Settings");
                    setShowOptions(false);
                  }}
                >
                  My Profile
                </div>
              </Link>
              {role === "admin" && (
                <Link href="/admin/practices">
                  <div
                    className="px-4 py-2 h-9 cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                      setSelectedOption("Admin Page");
                      setShowOptions(false);
                    }}
                  >
                    Admin
                  </div>
                </Link>
              )}
              <div
                className="px-4 py-2 h-9 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  handleLogout();
                  setSelectedOption("Logout");
                  setShowOptions(false);
                }}
              >
                Logout
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex gap-2 sm:gap-4">
          <button
            onClick={() => router.push("/login")}
            className="text-lg sm:text-2xl font-bold text-center bg-custom-yellow border-2 w-16 sm:w-20 h-10 sm:h-12 hover:bg-white rounded-full border-black text-black font-comic"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="text-lg sm:text-2xl font-bold text-center bg-black border-2 w-24 sm:w-32 h-10 sm:h-12 rounded-full hover:opacity-80 border-black text-white font-comic"
          >
            Sign up
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
