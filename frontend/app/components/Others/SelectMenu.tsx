import React, { useState } from 'react';
import { FaAngleDown } from "react-icons/fa6";

interface SelectMenuProps {
  selectedOption: string;
  onSelectOption: (option: string) => void;
}

const SelectMenu: React.FC<SelectMenuProps> = ({ selectedOption, onSelectOption }) => {
  const [showOptions, setShowOptions] = useState(false);

  const options = [
    { label: 'Adventure', value: 'Adventure' },
    { label: 'Fiction', value: 'Fiction' },
    { label: 'Fantasy', value: 'Fantasy' },
    { label: 'Comedy', value: 'Comedy' }
  ];

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className="relative z-10 w-48 cursor-pointer">
      <div className="relative" onClick={toggleOptions}>
        <div className="w-full h-14 text-center font-bold text-2xl font-comic bg-white border border-black rounded-3xl px-4 py-2 pr-10 focus:outline-none focus:border-black">
          {selectedOption || "Types"}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center px-2 text-black">
          <FaAngleDown className="text-3xl" />
        </div>
      </div>
      {showOptions && (
        <div className="absolute w-full mt-2 bg-white border border-black rounded-lg shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              className="px-4 py-2 h-9 border-y border-slate-400 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                onSelectOption(option.value);
                setShowOptions(false);
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

export default SelectMenu;
