"use client"
import React, { useState } from 'react';
// Reusable Input component
const InputField = ({ type, placeholder, value, onChange }: { type: string; placeholder: string; value: string; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative w-full flex flex-col justify-center items-center  mt-4">
      <input
        className="border border-gray-500 w-72 z-10 rounded-3xl indent-7 h-10  focus:outline-none focus:border-blue-500"
        type={showPassword ? 'text' : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {type === 'password' && (
        <button
          type="button"
          className="absolute right-2 z-20"
          
          onClick={togglePasswordVisibility}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      )}
    </div>
  );
};
export default InputField;
