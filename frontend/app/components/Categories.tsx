'use client'
import { useState } from 'react';
import { IoMdArrowDropdown } from "react-icons/io";

const Categories = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const options = [
    { label: 'Adventure', value: 'Adventure' },
    { label: 'Fiction', value: 'Fiction' },
    { label: 'Fantasy', value: 'Fantasy' },
    
  ];

  const toggleOptions = () => {
    setShowOptions(!showOptions); // Toggle options visibility when clicking on the select element
  };

  return (
    <div className="relative w-[50vw] cursor-pointer ">
      <div className="relative " onClick={toggleOptions}>
        <div className=" w-full h-14     text-xl font-comic bg-white border border-black rounded-3xl px-4 py-3 ps-10  focus:outline-none focus:border-black">
          {selectedOption || "Choose Categories (3)"}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center px-2 text-black">
          < IoMdArrowDropdown className="text-3xl" />
        </div>
      </div>
      
      {showOptions && (
        <div className="absolute w-full mt-2 bg-white border border-black rounded-lg shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              className="px-4 py-2 h-9 border-y border-slate-400  cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setSelectedOption(option.value);
                setShowOptions(false); // Hide options when an option is selected
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories