'use client'
import React, { useState } from 'react';
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
import useAuthStore from '../store/useAuthStore';
import {useRouter} from 'next/navigation';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
 const router=useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });
      const userId = response.data.token._id;
      const token = response.data.token.token;
      console.log(response.data.token._id);
      login(userId, token);
      router.push('/', { scroll: false }) // Set user as logged in
    } catch (error) {
      setError("Login failed");
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
        <h1 className="text-center font-comic text-4xl pt-6"> <span className="font-bold">Hello!</span> Welcome to Writeasy</h1>
        <form onSubmit={handleSubmit} className="relative flex flex-col font-comic mt-14 z-10">
          <input className='border border-gray-500 w-72 z-10 rounded-3xl indent-7 h-10 focus:outline-none focus:border-yellow-600' type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className='border border-gray-500 w-72 z-10 rounded-3xl indent-7 h-10 focus:outline-none focus:border-yellow-600' type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <h1 className="text-end pt-4 font-comic text-sm underline font-bold"> <a href="#"> Forgot Password? </a></h1>
          <button className="text-center border rounded-3xl text-white hover:opacity-80 bg-black h-10 text-2xl" type="submit">Login</button>
          {error && <p className="text-red-500">{error}</p>}
          <h1 className="text-center pt-2 font-bold">or</h1>
          <Button type="google"></Button>
          <h1 className="text-center font-comic pt-4">Don't have an account? <Link href="/signup" className="font-bold">Signup</Link></h1>
          <div className="absolute w-32 h-16 -top-4 -right-28">
            <Image src={Rocket} alt='' />
          </div>
        </form>
        <div className="absolute top-60 w-20 h-10 left-10">
          <Image src={Group2} alt='' />
        </div>
        <div className="absolute top-20 right-0">
          <Image src={yellowvector} alt='' />
        </div>
        <div className="absolute left-80 top-28">
          <Image src={Sun} alt='' />
        </div>
      </div>
      <div className="relative mt-4">
        <div className="absolute left-80 bottom-24">
          <Image src={Group} alt='' height={200} />
        </div>
        <div className="absolute right-60 bottom-24">
          <Image src={Group3} alt='' height={200} />
        </div>
        <div className="absolute right-6 bottom-20">
          <Image src={Vector1} alt='' height={300} />
        </div>
      </div>
    </div>
  );
};

export default Login;
