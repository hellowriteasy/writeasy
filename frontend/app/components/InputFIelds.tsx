import React, { useState, forwardRef, ForwardedRef } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";

enum InputTypes {
  TEXT = "text",
  PASSWORD = "password",
  EMAIL = "email",
  NUMBER = "number",
}

interface InputFieldProps {
  types: "password" | "email" | "number" | "text";
  placeholder: string;
  value: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  // You can add more props as needed
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ types, placeholder, ...props }, ref: ForwardedRef<HTMLInputElement>) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="relative w-full flex flex-col justify-center items-center mt-4">
        <input
          className="border border-gray-500   w-96 z-10 rounded-3xl indent-7 h-12  focus:outline-none focus:border-yellow-600"
          type={showPassword ? "text" : types}
          placeholder={placeholder}
          ref={ref}
          {...props}
        />
        {types === InputTypes.PASSWORD && (
          <button
            type="button"
            className="absolute right-2 z-20"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <FaEye className="text-xl" />
            ) : (
              <FaEyeSlash className="text-xl" />
            )}
          </button>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
export { InputTypes };
