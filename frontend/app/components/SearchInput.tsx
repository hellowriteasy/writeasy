import React, { FC, InputHTMLAttributes } from "react";

// Define the type of props by extending InputHTMLAttributes
interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {}

const SearchInput: FC<SearchInputProps> = (props) => {
  return (
    <div>
      <input
        type="text"
        className="w-full flex-grow h-10 rounded-3xl  border border-black px-2"
        {...props}
      />
    </div>
  );
};

export default SearchInput;
