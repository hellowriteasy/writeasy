"use client";
import React, { ChangeEvent, SyntheticEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/Landingpage-img/logo.svg";
import Rocket from "../../public/Loginsignup-img/rocket.svg";
import Group2 from "../../public/Loginsignup-img/Group.svg";
import yellowvector from "@/public/Loginsignup-img/Vector-yellow.svg";
import Sun from "../../public/Loginsignup-img/sun.svg";
import Group from "../../public/Loginsignup-img/Group (2).svg";
import Group3 from "../../public/Loginsignup-img/Group (1).svg";
import Vector1 from "../../public/Loginsignup-img/Vector.svg";
import Button from "../components/Button";
import useAuthStore from "../store/useAuthStore";
import { useRouter } from "next/navigation";
import Earth from "../../public/Landingpage-img/earth.svg";
import { axiosInstance } from "../utils/config/axios";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import type { NextPage } from "next";

const Login: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const AxiosIns = axiosInstance("");

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const response = await AxiosIns.post(`/auth/login`, {
        email,
        password,
      });
      const {
        _id: userId,
        token,
        username,
        role,
        subscriptionType,
      } = response.data;
      login(userId, token);
      router.push("/", { scroll: false });
    } catch (error: any) {
      console.log(error)
      setError(error.response?.data?.msg || "Login failed");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLogin = (e: SyntheticEvent) => {
    e.preventDefault();
    // Add the logic for Google login here
    // For now, we'll just redirect to the signup page as a placeholder
    router.push("/signup");
  };

  return (
    <div className="overflow-hidden two-line-bg">
      <Link href="/">
        <div className="ms-10 md-hide mt-10">
          <Image src={logo} alt="logo" />
        </div>
      </Link>
      <div className="flex flex-col w-full h-full items-center">
        <h1 className="text-center font-comic sm:text-2xl lg:text-4xl md:text-5xl pt-6">
          <span className="font-bold">Hello!</span> Welcome to Writeasy
        </h1>
        <form
          onSubmit={handleSubmit}
          className="relative flex flex-col font-comic mt-14 z-10"
        >
          <div className="relative w-full flex flex-col justify-center items-center mt-4">
            <input
              className="border border-gray-500 w-72 sm:w-72 md:w-80 lg:w-96 z-10 rounded-3xl indent-7 h-10 sm:h-12 focus:outline-none focus:border-yellow-600"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div className="relative w-full flex flex-col justify-center items-center mt-4">
            <input
              className="border border-gray-500 w-72 sm:w-72 md:w-80 lg:w-96 z-10 rounded-3xl indent-7 h-10 sm:h-12 focus:outline-none focus:border-yellow-600"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
            <button
              type="button"
              className="absolute right-3 sm:right-4 md:right-5 lg:right-6 z-20"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <FaEye className="text-lg sm:text-xl" />
              ) : (
                <FaEyeSlash className="text-lg sm:text-xl" />
              )}
            </button>
          </div>

          <h1 className="text-end pt-4 font-comic text-sm underline font-bold">
            <Link href="#">Forgot Password?</Link>
          </h1>
          <button className="text-center border rounded-3xl my-4 text-white hover:opacity-80 min-w-full sm:min-w-60 sm:w-72 md:w-80 lg:w-96 mt-5 bg-black h-12 sm:h-14 text-xl sm:text-2xl">
            Login
          </button>
          {error && <p className="text-red-500 mx-auto">{error}</p>}
          <h1 className="text-center pt-2 font-bold">or</h1>

          <div className="absolute w-32 h-16 vvsm-hide -top-4 -right-28">
            <Image src={Rocket} alt="rocket" />
          </div>
        </form>
        <Button type="google" />
        <h1 className="text-center font-comic pt-4">
          Don &lsquo;t have an account?{" "}
          <Link href="/signup" className="font-bold cursor-pointer">
            Signup
          </Link>
        </h1>
        <div className="absolute top-60 w-20 vsm-hide h-10 left-10">
          <Image src={Group2} alt="group2" />
        </div>
        <div className="absolute sm-hide top-20 right-0">
          <Image src={yellowvector} alt="yellow vector" />
        </div>
        <div className="absolute md-hide left-80 top-28">
          <Image src={Sun} alt="sun" />
        </div>
      </div>

      <div className="relative">
        <div className="absolute md-hide left-80 bottom-24">
          <Image src={Group} height={200} alt="group" />
        </div>
        <div className="absolute md-hide right-60 bottom-24">
          <Image src={Group3} height={200} alt="group3" />
        </div>
        <div className="absolute vsm-hide right-6 bottom-20">
          <Image src={Vector1} height={300} alt="vector1" />
        </div>
        <Image className="w-screen mt-10" alt="earth" src={Earth} />
      </div>
    </div>
  );
};

export default Login;
