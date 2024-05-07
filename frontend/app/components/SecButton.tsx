import React, { FC, ReactNode } from "react";

interface ButtonProps {
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}

const SecButton: FC<ButtonProps> = ({ onClick, children, className }) => {
  return (
    <button
      onClick={onClick}
      className={`mx-auto hover:bg-slate-800 bg-black text-white w-28   h-10 border-2 border-black rounded-3xl ${className}`}
    >
      {children}
    </button>
  );
};

export default SecButton;
