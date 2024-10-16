import React, { FC, InputHTMLAttributes } from "react";

// Define the type of props by extending InputHTMLAttributes
interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {}

const SearchInput: FC<SearchInputProps> = (props) => {
  return (
    <div>
      <input
        type="text"
        className="w-full flex-grow h-12 rounded-3xl  border-2 outline-yellow-500 border-custom-yellow px-2 "
        {...props}
      />
    </div>
  );
};

export default SearchInput;
