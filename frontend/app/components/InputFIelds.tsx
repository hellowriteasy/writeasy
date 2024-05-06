import React, { useState } from 'react';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useForm } from "react-hook-form";

// Reusable Input component
const InputField = ({ type, placeholder, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative w-full flex flex-col justify-center items-center mt-4">
      <input
        className="border border-gray-500 w-72 z-10 rounded-3xl indent-7 h-10 focus:outline-none focus:border-blue-500"
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
          {showPassword ? <FaEyeSlash className='text-xl' /> : <FaEye className='text-xl' />}
        </button>
      )}
    </div>
  );
};

export default InputField;
