"use client";
import React from "react";
import { axiosInstance } from "../utils/config/axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useCustomToast } from "../utils/hooks/useToast";

const Unsubscribe = () => {
  const axiosIns = axiosInstance("");
  const searchParams = useSearchParams();
  const email = new URLSearchParams(searchParams).get("email");
  const toast = useCustomToast();
  const router = useRouter();
  const handleUnsubscribeEmail = async () => {
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
      <div>
        <button
          onClick={handleUnsubscribeEmail}
          className="border text-2xl sm:text-3xl mx-auto font-comic hover:bg-slate-800 border-slate-400 bg-black rounded-3xl text-white w-40 sm:w-48 md:w-56 lg:w-60 h-12 sm:h-14"
        >
          Unsubscribe
        </button>
      </div>
    </div>
  );
};

export default Unsubscribe;
