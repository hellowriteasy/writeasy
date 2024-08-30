"use client";
import React, { ChangeEvent, SyntheticEvent, useState } from "react";
import Image from "next/image";

import Rocket from "../../public/Loginsignup-img/rocket.svg";
import Group2 from "../../public/Loginsignup-img/Group.svg";
import yellowvector from "@/public/Loginsignup-img/Vector-yellow.svg";
import Sun from "../../public/Loginsignup-img/sun.svg";
import { axiosInstance } from "../utils/config/axios";
import { useCustomToast } from "../utils/hooks/useToast";

const PasswordRest = () => {
  const [email, setEmail] = useState("");
  const axios = axiosInstance("");
  const toast = useCustomToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      if (email === "") return;
      await axios.post("/auth/users/sentLinkToResetPassword", {
        email,
      });
      toast("Email sent successfully", "success");
      setEmail("");
      setLoading(false);
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      toast(
        error?.response?.data?.message || "Something went wrong .",
        "error"
      );
    }
  };

  return (
    <div className="overflow-hidden two-line-bg  h-[50vh] mt-10">
      <div className="flex flex-col w-full h-full items-center">
        <div className="text-center font-comic   pt-6">
          <span className="font-bold lg:text-4xl md:text-5xl">
            Reset your password
          </span>
          <p className="text-gray-700  ">
            We will sent you a link to reset your password in your email
            address.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="relative flex flex-col font-comic  z-10"
        >
          <div className="relative w-full flex flex-col justify-center items-center mt-8">
            <input
              className="border border-gray-500 w-72 sm:w-72 md:w-80 lg:w-96 z-10 rounded-full indent-7 h-10 sm:h-12 focus:outline-none focus:border-yellow-600"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <button className="text-center border rounded-full my-4 text-white hover:opacity-80 min-w-full sm:min-w-60 sm:w-72 md:w-80 lg:w-96 mt-5 bg-black h-12 sm:h-14 text-xl sm:text-2xl">
            {loading ? "Sending..." : "Send Reset Password Link"}
          </button>

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
    </div>
  );
};

export default PasswordRest;
