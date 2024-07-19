"use client";
import React, { SyntheticEvent, useState } from "react";
import { axiosInstance } from "../utils/config/axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useCustomToast } from "../utils/hooks/useToast";

const Unsubscribe = () => {
  const axiosIns = axiosInstance("");
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const toast = useCustomToast();
  const router = useRouter();
  const handleUnsubscribeEmail = async (e: SyntheticEvent) => {
    e.preventDefault()
    if (!email) return;
    try {
      await axiosIns.post(`/auth/users/unsubscribe-email`, {
        email,
      });
      toast("Email unsubscribed successfully", "success");
      router.push("/");
    } catch (error: any) {
      toast(
        error?.response?.data?.message || "Failed to unsubscribed email",
        "error"
      );

      console.log(error);
      //
    }
  };

  return (
    <div className="flex flex-col justify-center w-full items-center h-[400px] gap-y-5">
      <p className="text-2xl w-8/12 text-center">
        <p>Dear Subscriber,</p>
        <p>
          Note that by unsubscribing, you will no longer receive updates and
          exclusive content from us.
        </p>
      </p>
      <form onSubmit={handleUnsubscribeEmail} className="flex flex-col gap-y-3">
        <input
          className="border border-gray-500 w-72 sm:w-72 md:w-80 lg:w-96 z-10 rounded-3xl indent-7 h-10 sm:h-12 focus:outline-none focus:border-yellow-600"
          placeholder="Enter your email"
          value={email || ""}
          type="email"
          required
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <button
          onClick={handleUnsubscribeEmail}
          className="border text-2xl sm:text-3xl mx-auto font-comic hover:bg-slate-800 border-slate-400 bg-black rounded-3xl text-white w-40 sm:w-48 md:w-56 lg:w-60 h-12 sm:h-14"
        >
          Unsubscribe
        </button>
      </form>
    </div>
  );
};

export default Unsubscribe;
