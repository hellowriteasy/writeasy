'use client';
import React from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import Earth from "../../public/Landingpage-img/earth.svg";
import Group from "../../public/Loginsignup-img/Group (2).svg";
import Group2 from "../../public/Loginsignup-img/Group.svg";
import Group3 from "../../public/Loginsignup-img/Group (1).svg";
import Vector from "../../public/Loginsignup-img/Vector-yellow.svg";
import Vector1 from "../../public/Loginsignup-img/Vector.svg";
import Rocket from "../../public/Loginsignup-img/rocket.svg";
import Sun from "../../public/Loginsignup-img/sun.svg";
import logo from "../../public/Landingpage-img/logo.svg";
import InputField from "../components/InputFIelds";
import Link from "next/link";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
  username: z.string().regex(/^[a-zA-Z0-9_ @]+$/, {
    message: "Username can only contain letters, numbers, underscores, spaces, and the '@' symbol."
  })
  
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormFields = z.infer<typeof schema>;

const Signup = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        email: data.email,
        password: data.password,
        username: data.username
      });
      console.log("User created:", data);
      router.push('/login', { scroll: false });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="overflow-y-hidden two-line-bg">
      <Link href="/">
        <div className="ms-10 mt-10">
          <Image src={logo} alt="logo" />
        </div>
      </Link>
      <div className="flex flex-col -mt-20  items-center overflow-hidden">
        <h1 className="text-center text-4xl pt-6 font-comic">
          <span className="font-bold">Hello!</span> Welcome to Writeasy
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="relative flex flex-col gap-2 font-comic mt-10 z-10">
          <InputField
            types="text"
            placeholder="Email"
            {...register("email")}
          />
          {errors.email && <div className="text-red-500">{errors.email.message}</div>}

          <InputField
            types="text"
            placeholder="Username"
            {...register("username")}
          />
          {errors.username && <div className="text-red-500">{errors.username.message}</div>}

          <InputField
            types="password"
            placeholder="Password"
            {...register("password")}
          />
          {errors.password && <div className="text-red-500">{errors.password.message}</div>}

          <InputField
            types="password"
            placeholder="Confirm Password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <div className="text-red-500">{errors.confirmPassword.message}</div>}

          <button className="text-center border rounded-3xl text-white hover:opacity-80 w-96 mt-5 bg-black h-14 text-2xl">
            Sign Up
          </button>
          <h1 className="text-center font-comic pt-6">
            Already have an account? <Link href="/login" className="font-bold underline">Login</Link>
          </h1>
          <div className="absolute w-32 h-16 -top-4 -right-28">
            <Image src={Rocket} alt="rocket" />
          </div>
        </form>
        <div className="absolute top-60 w-20 h-10 left-10">
          <Image src={Group2} alt="group" />
        </div>
        <div className="absolute top-20 right-0">
          <Image src={Vector} alt="vector" />
        </div>

        <div className="absolute left-80 top-28">
          <Image src={Sun} alt="sun" />
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

export default Signup;
