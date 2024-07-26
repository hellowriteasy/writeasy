"use client";
import React, { useEffect } from "react";
import Hero from "./pages/Home";
import useAuthStore from "./store/useAuthStore";
import { useCustomToast } from "./utils/hooks/useToast";
import { useRouter } from "next/navigation";
export default function Home() {
  const user = useAuthStore();
  const toast = useCustomToast();
  const router = useRouter();
  useEffect(() => {
    if (user.userId && !user.username) {

      toast("Please set your username", "success");
      router.push("/setting");
      return;
    }
  }, [user]);

  return (
    <main className="font-school flex justify-center items-baseline flex-col two-line-bg ">
      <Hero />
    </main>
  );
}
