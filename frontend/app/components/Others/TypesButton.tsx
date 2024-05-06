import { useState } from 'react';
import { FaAngleDown } from "react-icons/fa6";

const SelectMenu = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const options = [
    { label: 'Types', value: '' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  const toggleOptions = () => {
    setShowOptions(!showOptions); // Toggle options visibility when clicking on the select element
  };

  return (
    <div className="relative w-48">
      <div className="relative" onClick={toggleOptions}>
        <div className="block text-center font-bold text-xl bg-white border border-black rounded-3xl px-4 py-2 pr-10 leading-tight focus:outline-none focus:border-black">
          {selectedOption || "Types"}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-6 flex items-center px-2 text-black">
          <FaAngleDown className="w-5 h-5" />
        </div>
      </div>
      {/* Custom dropdown options */}
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

export default SelectMenu;
