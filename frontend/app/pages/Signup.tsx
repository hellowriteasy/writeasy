'use client'
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
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
import Button from "../components/Button";
import { useRouter } from "next/navigation";
import axios from "axios";
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string()

});

type FormFields = z.infer<typeof schema>;

const Signup = () => {
  const router=useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      email: "",
      password: "",
      username:""
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
  try {
    // Make a POST request to your API endpoint to create a new user
    await axios.post("http://localhost:5000/api/auth/register", data);
    
    // If successful, log the data
    
    console.log("User created:", data);
    router.push('/Login', { scroll: false })
    
    // Optionally, you can redirect the user to another page after successful registration
    // Replace "/dashboard" with the desired URL
    // router.push("/dashboard");
  } catch (error) {
    // If there's an error, handle it appropriately
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Network Error:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error.message);
    }
  }
}


  return (
    <div className="overflow-hidden two-line-bg">
      
        <div className="ms-10 mt-10">
          <Image src={logo} alt="logo" />
        </div>
      
      <div className="flex flex-col -mt-20 h-[500px] items-center overflow-hidden">
        <h1 className="text-center text-4xl pt-6 font-comic">
          <span className="font-bold">Hello!</span> Welcome to Writeasy
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)} 
          className="relative flex flex-col gap-2 font-comic mt-10 z-10"
        >
          <input  className="border border-gray-500 w-72 z-10 rounded-3xl indent-7 h-10 focus:outline-none focus:border-yellow-600" placeholder="Email" {...register("email")} />
          {errors.email && <div className="text-red-500">{errors.email.message}</div>}
          <input  {...register("username")}  className="border border-gray-500 w-72 z-10 rounded-3xl indent-7 h-10 focus:outline-none focus:border-yellow-600"  placeholder="Username" />
          {errors.username && <div className="text-red-500">{errors.username.message}</div>}
          <input  className="border border-gray-500 w-72 z-10 rounded-3xl indent-7 h-10 focus:outline-none focus:border-yellow-600" placeholder="Password" {...register("password")} />
          <input   className="border border-gray-500 w-72 z-10 rounded-3xl indent-7 h-10 focus:outline-none focus:border-yellow-600" placeholder="confirm password"  />
          {errors.password && <div className="text-red-500">{errors.password.message}</div>}

          <button  className="text-center border rounded-3xl text-white hover:opacity-80 bg-black h-10 text-2xl" >sign up</button>
          {errors.root && <div className="text-red-500">{errors.root.message}</div>}
          <h1 className="text-center font-comic pt-6">
            Already have an account? <a href="/login" className="font-bold">Login</a>
          </h1>
          <div className="absolute w-32 h-16 -top-4 -right-28">
            <Image src={Rocket} alt="rocket" />
          </div>
        </form>
        <div className="absolute top-60 w-20 h-10 left-10">
          <Image src={Group2} alt="rocket" />
        </div>
        <div className="absolute top-20 right-0">
          <Image src={Vector} alt="vector" />
        </div>

        <div className="absolute  left-80  top-28">
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
        <Image className="w-screen" alt="earth" src={Earth} />
      </div>
    </div>
  );
};

export default Signup;
