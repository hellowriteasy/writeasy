  "use client"
import React from "react";

import Hero from "./pages/Home.page";
 // Corrected import statement

export default function Home() {
  // function handlechange() {
  //   // Define your handleChange logic here
  // }

  return (
    
    <main className="">
       <Hero/>
      {/* <InputField type="password" placeholder="password"  onChange={handlechange} />
      <Button type="login">login</Button>
      <Button type="signup">signup</Button>
      <Button type="google"></Button> */}
    </main>
  );
}
