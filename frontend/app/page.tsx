"use client"
import React from "react";

import Hero from "./pages/Home";
import useAuthStore from "./store/useAuthStore";

export default function Home() {
    const isSubcriptionActive = useAuthStore(
      (state) => state.isSubcriptionActive
    );
  console.log(isSubcriptionActive)
  return (
    <main className="font-poppins flex justify-center items-baseline flex-col two-line-bg">
   
        <Hero />
     
    </main>
  );
}

