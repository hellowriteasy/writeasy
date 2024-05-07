  "use client"
import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Viewcontest from "./contest/Viewcontest"
import Contest from "./contest/Contest"
import CreateGames from "./creategames/page";
  //  import Games from "./pages/Games";
import Practice from "./Practices/page";
import Hero from "./pages/Home.page";
import Games from "./Games/page";
 // Corrected import statement
import TopWriting from "./components/Others/TopWriting";
export default function Home() {
  // function handlechange() {
  //   // Define your handleChange logic here
  // }
  const navTitles = ['Practices', 'Contests', 'Game','FAQ'];

  return (
    
    <main className="font-poppins two-line-bg ">
     
      <Hero></Hero>  

    
    </main>
  );
}
