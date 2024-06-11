import React, { Suspense } from "react";
import UserStory from "./components/profile/UserStory";
import LoadingAnimation from "./loading";
import Hero from "./pages/Home";

export default function Home() {
  return (
    <main className="font-poppins flex justify-center items-baseline flex-col two-line-bg">
   
        <Hero />
     
    </main>
  );
}

