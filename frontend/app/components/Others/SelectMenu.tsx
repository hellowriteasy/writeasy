import React, { useEffect, useState } from "react";
import { FaAngleDown } from "react-icons/fa6";
import { axiosInstance } from "../../utils/config/axios";

interface SelectMenuProps {
  selectedOption: string;
  onSelectOption: (option: string) => void;
}

interface Option {
  name: string;
  _id: string;
}

const SelectMenu: React.FC<SelectMenuProps> = ({
  selectedOption,
  onSelectOption,
}) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [options, setOptions] = useState<Option[] | null>([]);
  const AxiosIns = axiosInstance("");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const { data } = await AxiosIns.get<{ categories: Option[] }>(
          "/category"
        );
        setOptions(data.categories);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className="relative ms-2 z-10 w-48 sm:w-28 cursor-pointer">
      <div className="relative" onClick={toggleOptions}>
        <div className="w-full h-14 sm:h-8 text-center font-bold text-2xl sm:text-sm flex  items-center font-comic bg-white border border-black rounded-3xl px-4 py-2 pr-10 focus:outline-none focus:border-black">
          {selectedOption || "Types"}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center px-2 text-black">
          <FaAngleDown className="text-[2vw]" />
        </div>
      </div>
      {showOptions && (
        <div className="absolute w-full mt-2 bg-white border border-black rounded-lg shadow-lg">
          <div
            className="px-4 py-2 h-9  cursor-pointer hover:font-bold"
            onClick={() => {
              onSelectOption("");
              setShowOptions(false);
            }}
          >
            All
          </div>
          {options &&
            options.map((option) => (
              <div
                key={option._id}
                className="px-4 py-2 h-9  cursor-pointer hover:font-bold"
                onClick={() => {
                  onSelectOption(option.name);
                  setShowOptions(false);
                }}
              >
                {option.name}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SelectMenu;
