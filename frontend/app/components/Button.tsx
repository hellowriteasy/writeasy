// components/Button.tsx
"use client"
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  type?: "google" | "login" | "signup"; // Define the type prop
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, type, onClick }) => {
  let buttonContent: React.ReactNode;
  let buttonClass = "h-10 w-72 rounded-3xl mt-4 "; // Default class

  // Apply specific classes and content based on the type prop
  if (type === "google") {
    buttonClass += " bg-white text-dark border-2 rounded=2xl border-gray-600";
    buttonContent = (
      <div className="flex  justify-center items-center " >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="24"
          height="24"
        >
          {/* Google SVG logo */}
          <path
            fill="#4285F4"
            d="M23.5 40c5.88 0 10.71-1.94 14.33-5.28L39 32l-1.22-1.07c-1.29-1.13-2.86-2.01-4.7-2.65-2.84-.96-6.09-1.52-9.54-1.52-7.29 0-12.86 2.94-16.71 8.5-1.44 2.09-2.28 4.4-2.28 6.73C4.5 38.27 14.88 40 23.5 40z"
          ></path>
          <path fill="#34A853" d="M9.79 29.14C7.33 25.35 6 21.01 6 17c0-3.71 1.45-6.98 3.79-9.5L7.06 5.07C3.16 9.06 1 13.86 1 17c0 5.43 4.57 9.86 10.5 9.86 2.83 0 5.4-.99 7.43-2.64l-7.14-6.08z"></path>
          <path fill="#FBBC05" d="M8 10.17C5.39 13.44 4 16.99 4 17c0 .09 1.39 3.58 4 6.83l7.14-6.08C13.4 11.56 10.83 10 8 10"></path>
          <path fill="#EA4335" d="M23.5 7.38c1.97 0 3.75.67 5.16 1.99l7.33-7.33C34.36 1.3 29.46 0 23.5 0 14.2 0 6.34 5.39 2.65 12.82L9.79 20.1C11.64 14.14 16.92 10 23.5 10c3.09 0 5.93 1.12 8.11 2.97l6.07-6.07c-1.85-1.74-4.28-2.97-7.18-2.97z"></path>
        </svg>
       <span>Sign in with Google</span>
      </div>
    );
  } else if (type === "login" || type === "signup") {
    buttonClass += " bg-black text-white";
    buttonContent = children; // Render children as content
  }

  return (
    <button onClick={onClick} className={buttonClass }>
      {buttonContent}
    </button>
  );
};

export default Button;
