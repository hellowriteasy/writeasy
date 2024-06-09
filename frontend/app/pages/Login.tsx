'use client';
import React, { SyntheticEvent, useState } from 'react';
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
import Button from '../components/Button';
import InputField from '../components/InputFIelds';
import useAuthStore from '../store/useAuthStore';
import { useRouter } from 'next/navigation';
import Earth from "../../public/Landingpage-img/earth.svg";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleSubmit = async (e:SyntheticEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8000/api/auth/login`, {
        email,
        password
      });

      const { _id: userId, token, username, role, subscriptionType } = response.data;
      login(userId, token, username, role, subscriptionType);
     
      router.push('/', { scroll: false });
    } catch (error:any) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="overflow-hidden two-line-bg">
      <Link href="/">
        <div className="ms-10 mt-10">
          <Image src={logo} alt="logo" />
        </div>
      </Link>
      <div className="flex flex-col -mt-20 h-full items-center">
        <h1 className="text-center font-comic text-4xl pt-6">
          <span className="font-bold">Hello!</span> Welcome to Writeasy
        </h1>
        <form onSubmit={handleSubmit} className="relative flex flex-col font-comic mt-14 z-10">
          <InputField
            types="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            types="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <h1 className="text-end pt-4 font-comic text-sm underline font-bold">
            <Link href="#">Forgot Password?</Link>
          </h1>
          <button className="text-center border rounded-3xl text-white hover:opacity-80 bg-black h-12 mt-4 text-2xl" type="submit">
            Login
          </button>
          {error && <p className="text-red-500">{error}</p>}
          <h1 className="text-center pt-2 font-bold">or</h1>
          <Button type="google" />
          <h1 className="text-center font-comic pt-4">
            Don't have an account? <Link href="/signup" className="font-bold cursor-pointer">Signup</Link>
          </h1>
          <div className="absolute w-32 h-16 -top-4 -right-28">
            <Image src={Rocket} alt='rocket' />
          </div>
        </form>
        <div className="absolute top-60 w-20 h-10 left-10">
          <Image src={Group2} alt='group2' />
        </div>
        <div className="absolute top-20 right-0">
          <Image src={yellowvector} alt='yellow vector' />
        </div>
        <div className="absolute left-80 top-28">
          <Image src={Sun} alt='sun' />
        </div>
      </div>
     
      <div className="relative">
        <div className="absolute left-80 bottom-24">
          <Image src={Group} height={200} alt="group" />
        </div>
        <div className="absolute right-60 bottom-24">
          <Image src={Group3} height={200} alt="group3" />
        </div>
        <div className="absolute right-6 bottom-20">
          <Image src={Vector1} height={300} alt="vector1" />
        </div>
        <Image className="w-screen mt-10"  alt="earth" src={Earth} />
      </div>
    </div>
  );
};

export default Login;
