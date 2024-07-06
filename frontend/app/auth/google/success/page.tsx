"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/app/store/useAuthStore";

const Success = () => {
  const searchParams = useSearchParams();
  const user_id = new URLSearchParams(searchParams).get("user_id");
  const token = new URLSearchParams(searchParams).get("token");
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  useEffect(() => {
    if (user_id && token) {
      login(user_id, token);
      router.push("/");
    }
  }, [user_id, token]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-lg">
        <p>Redirectinggg to home page ...</p>
      </div>
    </div>
  );
};

export default Success;
