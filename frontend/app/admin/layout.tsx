import React from "react";

import Navbar from "@/app/components/admin/Navbar";
import Sidebar from "../components/admin/SIdebar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="w-full">{children}</div>
      </div>
    </>
  );
};

export default layout;
