"use client";
import React, { ChangeEvent, SyntheticEvent, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import logo from "@/public/Landingpage-img/logo.svg";
import Rocket from "../../public/Loginsignup-img/rocket.svg";
import Group2 from "../../public/Loginsignup-img/Group.svg";
import yellowvector from "@/public/Loginsignup-img/Vector-yellow.svg";
import Sun from "../../public/Loginsignup-img/sun.svg";
import Group from "../../public/Loginsignup-img/Group (2).svg";
import Group3 from "../../public/Loginsignup-img/Group (1).svg";
import Vector1 from "../../public/Loginsignup-img/Vector.svg";
import Button from "../components/Button";
import InputField from "../components/InputFIelds";
import useAuthStore from "../store/useAuthStore";
import { useRouter } from "next/navigation";
import Earth from "../../public/Landingpage-img/earth.svg";
import { axiosInstance } from "../utils/config/axios";
import type { NextPage } from "next";

const Login: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      setError(error.response?.data?.message || "Login failed");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const permission = Notification.requestPermission();
    }
  }, []);

  return (
    <div className="overflow-hidden  two-line-bg">
      <Link href="/">
        <div className="ms-10 md-hide mt-10">
          <Image src={logo} alt="logo" />
        </div>
      </Link>
      <div className="flex flex-col w-full  h-full items-center">
        <h1 className="text-center font-comic sm:text-2xl lg:text-4xl md:text-5xl pt-6">
          <span className="font-bold">Hello!</span> Welcome to Writeasy
        </h1>
        <form
          onSubmit={handleSubmit}
          className="relative flex flex-col font-comic mt-14 z-10"
        >
          <InputField
            types="email"
            placeholder="Email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
          <InputField
            types="password"
            placeholder="Password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
          <h1 className="text-end pt-4  font-comic text-sm underline font-bold">
            <Link href="#">Forgot Password?</Link>
          </h1>
          <button className="text-center border rounded-3xl m-y-4 text-white hover:opacity-80 min-w-full  sm:min-w-60 sm:w-72 md:w-80 lg:w-96 mt-5 bg-black h-12 sm:h-14 text-xl sm:text-2xl">
            Login
          </button>
          {error && <p className="text-red-500">{error}</p>}
          <h1 className="text-center pt-2 font-bold">or</h1>
          <Button type="google" />
          <h1 className="text-center font-comic pt-4">
            Don &lsquo;t have an account?{" "}
            <Link href="/signup" className="font-bold cursor-pointer">
              Signup
            </Link>
          </h1>
          <div className="absolute w-32 h-16 vvsm-hide -top-4 -right-28">
            <Image src={Rocket} alt="rocket" />
          </div>
        </form>
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
