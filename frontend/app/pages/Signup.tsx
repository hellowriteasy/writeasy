"use client";
import React, { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Earth from "../../public/Landingpage-img/earth.svg";
import Group from "../../public/Loginsignup-img/Group (2).svg";
import Group2 from "../../public/Loginsignup-img/Group.svg";
import Group3 from "../../public/Loginsignup-img/Group (1).svg";
import Vector from "../../public/Loginsignup-img/Vector-yellow.svg";
import Vector1 from "../../public/Loginsignup-img/Vector.svg";
import Rocket from "../../public/Loginsignup-img/rocket.svg";
import Sun from "../../public/Loginsignup-img/sun.svg";
import logo from "../../public/Landingpage-img/logo.svg";
import Link from "next/link";
import { axiosInstance } from "../utils/config/axios";
import Button from "../components/Button";
import { FaEyeSlash, FaEye } from "react-icons/fa";

const schema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
    username: z.string().regex(/^[a-zA-Z0-9_ @]+$/, {
      message:
        "Username can only contain letters, numbers, underscores, spaces, and the '@' symbol.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormFields = z.infer<typeof schema>;

const Signup = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const AxiosIns = axiosInstance("");

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await AxiosIns.post("/auth/register", {
        email: data.email,
        password: data.password,
        username: data.username,
      });

      router.push("/login");
    } catch (error: any) {
      setError(error.response?.data?.msg || "Failed to register.");
      console.error("Error:", error);
    }
  };

  const handleGoogleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      const response = await AxiosIns.get("/auth/google");
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Handle callback after Google OAuth completes
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      // Send the received code to your backend for token exchange
      exchangeCodeForToken(code);
    }
  }, []);

  const exchangeCodeForToken = async (code: string) => {
    try {
      const response = await AxiosIns.post("/auth/google/callback", { code });
      // Assuming the backend redirects to '/' after successful authentication
      router.push("/");
    } catch (error) {
      console.error("Error exchanging code for token:", error);
    }
  };

  return (
    <div className="overflow-y-hidden two-line-bg">
      <Link href="/">
        <div className="ms-10 sm-hide mt-10">
          <Image src={logo} alt="logo" />
        </div>
      </Link>
      <div className="flex flex-col w-screen items-center overflow-hidden">
        <h1 className="text-center text-2xl sm:text-4xl pt-6 font-comic">
          <span className="font-bold">Hello!</span> Welcome to Writeasy
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative flex flex-col items-center gap-2 font-comic mt-10 z-10"
        >
          <div className="relative w-full flex flex-col justify-center items-center mt-4">
            <input
              className="border border-gray-500 w-72 sm:w-72 md:w-80 lg:w-96 z-10 rounded-full indent-7 h-10 sm:h-12 focus:outline-none focus:border-yellow-600"
              type="text"
              placeholder="Username"
              {...register("username")}
            />
            {errors.username && (
              <div className="text-red-500">{errors.username.message}</div>
            )}
          </div>
          <div className="relative w-full flex flex-col justify-center items-center mt-4">
            <input
              className="border border-gray-500 w-72 sm:w-72 md:w-80 lg:w-96 z-10 rounded-full indent-7 h-10 sm:h-12 focus:outline-none focus:border-yellow-600"
              type="text"
              placeholder="Email"
              {...register("email")}
            />
            {errors.email && (
              <div className="text-red-500">{errors.email.message}</div>
            )}
          </div>
          <div className="relative w-full flex flex-col justify-center items-center mt-4">
            <input
              className="border border-gray-500 w-72 sm:w-72 md:w-80 lg:w-96 z-10 rounded-full indent-7 h-10 sm:h-12 focus:outline-none focus:border-yellow-600"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
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
            {errors.password && (
              <div className="text-red-500">{errors.password.message}</div>
            )}
          </div>

          <div className="relative w-full flex flex-col justify-center items-center mt-4">
            <input
              className="border border-gray-500 w-72 sm:w-72 md:w-80 lg:w-96 z-10 rounded-full indent-7 h-10 sm:h-12 focus:outline-none focus:border-yellow-600"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              className="absolute right-3 sm:right-4 md:right-5 lg:right-6 z-20"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? (
                <FaEye className="text-lg sm:text-xl" />
              ) : (
                <FaEyeSlash className="text-lg sm:text-xl" />
              )}
            </button>
            {errors.confirmPassword && (
              <div className="text-red-500">
                {errors.confirmPassword.message}
              </div>
            )}
          </div>

          <button className="text-center border rounded-full text-white hover:opacity-80 w-full sm:w-72 md:w-80 lg:w-96 mt-5 bg-black h-12 sm:h-14 text-xl sm:text-2xl">
            Sign Up
          </button>
          {error && <p className="text-red-500 mx-auto">{error}</p>}

          <div className="absolute w-32 h-16 vvsm-hide -top-4 -right-28">
            <Image src={Rocket} alt="rocket" />
          </div>
        </form>
        <Button type="google" />
        <h1 className="text-center font-comic pt-6">
          Already have an account?{" "}
          <Link href="/login" className="font-bold underline">
            Login
          </Link>
        </h1>
        <div className="absolute top-60 w-20 vsm-hide h-10 left-10">
          <Image src={Group2} alt="group" />
        </div>
        <div className="absolute top-20 sm-hide right-0">
          <Image src={Vector} alt="vector" />
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
        <Image className="w-full mt-10" alt="earth" src={Earth} />
      </div>
    </div>
  );
};

export default Signup;
