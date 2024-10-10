import React, { useEffect, useState } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Box,
  Flex,
} from "@chakra-ui/react";
import { FaAngleDown } from "react-icons/fa";
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

  return (
    <Box>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<FaAngleDown />}
          iconSpacing={5}
          bg="white"
          border="1px solid black"
          rounded="full"
          className="w-48 rounded-3xl h-12 px-3"
        >
          {selectedOption || "All"}
        </MenuButton>
        <MenuList bg={"white" } zIndex="999" border={"1px solid black"} className="p-4 rounded-md d ">
          <MenuItem
            onClick={() => {
              onSelectOption("");
            }}
          >
            All
          </MenuItem>
          {options &&
            options.map((option) => (
              <MenuItem
                className="h-8"
                key={option._id}
                onClick={() => {
                  onSelectOption(option.name);
                }}
              >
                {option.name}
              </MenuItem>
            ))}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default SelectMenu;
