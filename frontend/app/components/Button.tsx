// components/Button.tsx
"use client";
import React from "react";
import Google from "../../public/Loginsignup-img/Googlelogo.svg";
import Image from "next/image";

interface ButtonProps {
  children?: React.ReactNode;
  type?: "google" | "login" | "signup";
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, type, onClick }) => {
  let buttonContent: React.ReactNode;
  let buttonClass = "h-12 w-full sm:w-72 md:w-80 lg:w-96 rounded-3xl mt-4"; // Default class

  if (type === "google") {
    buttonClass += " bg-white text-dark border-2 hover:bg-slate-200 border-gray-600";
    buttonContent = (
      <div className="flex gap-2 justify-center items-center">
        <Image alt="google" width={20} height={20} src={Google} />
        <span>Sign in with Google</span>
      </div>
    );
  } else if (type === "login" || type === "signup") {
    buttonClass += " bg-black hover:bg-slate-900 text-white";
    buttonContent = children;
  }

  return (
    <button onClick={onClick} className={buttonClass}>
      {buttonContent}
    </button>
  );
};

export default Button;
