  "use client"
import React from "react";
import Pay from "./pages/Pay";
import Hero from "./pages/Home.page";
import Prompt from "@/app/components/Others/Prompt"
   import WeeklyTest from "./components/Others/WeeklyTest"
   import SelectMenu from "./components/Others/TypesButton"
 // Corrected import statement
import TopWriting from "./components/Others/TopWriting";
export default function Home() {
  // function handlechange() {
  //   // Define your handleChange logic here
  // }

  return (
    
    <main className="font-poppins two-line-bg ">
       {/* <Hero/> */}
         {/* <Prompt></Prompt>
         <TopWriting></TopWriting>
         <WeeklyTest></WeeklyTest> */}
          <SelectMenu></SelectMenu>
    </main>
  );
}
