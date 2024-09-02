import { useState, Fragment, useRef, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  Dialog,
  Transition,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { toast } from "react-toastify";
import { axiosInstance } from "@/app/utils/config/axios";
import DeleteModal from "@/app/components/DeleteModal"; // Adjust the import path as necessary

interface CardProps {
  title: string;
  type: string[];
  id: string;
  onSuccess: () => void;
}
interface Category {
  name: string;
  _id: string;
}
const Card: React.FC<CardProps> = ({ title, type, id, onSuccess }) => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [promptTitle, setPromptTitle] = useState(title);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  // Split initial type into array if it's a comma-separated string
  useEffect(() => {
    if (typeof type === "string") {
      const prompt_type = type as string;
      setSelectedTypes(prompt_type.split(","));
    } else {
      setSelectedTypes([]);
    }
  }, [type]);

  const AxiosIns = axiosInstance("");
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const { data } = await AxiosIns.get<{ categories: Category[] }>(
          "/category"
        );
        setCategory(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getCategory();
  }, []);
  const handleUpdate = async () => {
    try {
      const response = await AxiosIns.put(`/prompts/${id}`, {
        title: promptTitle,
        promptCategory: selectedTypes.join(","), // Join selected types into a comma-separated string for backend
        promptType: "practice",
      });
      setOpenEditModal(false);
      onSuccess();
      // toast.success("Prompt updated successfully!");
    } catch (error) {
      console.error("Error updating prompt:", error);
      // toast.error("Failed to update prompt.");
    }
  };

  const handleDelete = async () => {
    try {
      setOpenDeleteModal(true);
      const response = await AxiosIns.delete(`/prompts/${id}`);
      setOpenDeleteModal(false);
      onSuccess();
      // toast.success("Prompt deleted successfully!");
    } catch (error) {
      console.error("Error deleting prompt:", error);
      // toast.error("Failed to delete prompt.");
    }
  };

  return (
    <>
      <div className="bg-white border font-poppins border-gray-300 w-full shadow-sm rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2 sm:flex-col sm:items-start sm:gap-y-3">
          <div className="text-xl font-semibold font-comic sm:text-sm">
            <p>{title}</p>
            <div className="text-gray-600 sm:text-sm">{type}</div>
          </div>
          <div className="flex space-x-1">
            <button
              className="text-black"
              onClick={() => setOpenEditModal(true)}
            >
              <FaEdit size={20} className="sm:text-sm" color="black" />
            </button>
            <button
              className="text-black text-3xl"
              onClick={() => setOpenDeleteModal(true)}
            >
              <FaTrash color="red" className="sm:text-sm" size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Transition.Root show={openEditModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpenEditModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto ">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0 ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white   flex flex-col gap-y-2 items-center shadow-xl transition-all sm:my-8  sm:max-w-lg sm:w-[95%] mx-auto">
                  <div className=" w-full sm:pb-4 flex flex-col items-center p-2 ">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Edit Prompt
                      </Dialog.Title>
                      <div className="mt-2  ">
                        {/* <input
                            type="text"
                            className="mt-1 block w-full h-12 rounded-md border-gray-300 shadow-sm outline-none border ps-4 focus:ring-opacity-50"
                            placeholder="Prompt Title"
                            value={promptTitle}
                            onChange={(e) => setPromptTitle(e.target.value)}
                          /> */}
                        <Menu as="div" className="relative mt-3">
                          <MenuButton className="w-full text-left rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                            {selectedTypes.length > 0
                              ? selectedTypes.join(", ")
                              : "Select Type"}
                          </MenuButton>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <MenuItems className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {category.map((type) => (
                                <MenuItem key={type._id}>
                                  {({ active }) => (
                                    <button
                                      className={`${
                                        selectedTypes.includes(type.name)
                                          ? "bg-black text-white"
                                          : "text-gray-900"
                                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                      onClick={() =>
                                        setSelectedTypes((prevTypes) =>
                                          prevTypes.includes(type.name)
                                            ? prevTypes.filter(
                                                (t) => t !== type.name
                                              )
                                            : [...prevTypes, type.name]
                                        )
                                      }
                                    >
                                      {type.name}
                                    </button>
                                  )}
                                </MenuItem>
                              ))}
                            </MenuItems>
                          </Transition>
                        </Menu>
                        <textarea
                          rows={6}
                          className="mt-1 block w-full  p-2  rounded-md border-gray-300 shadow-sm outline-none border focus:ring-opacity-50"
                          placeholder="Prompt Title"
                          value={promptTitle}
                          onChange={(e) => setPromptTitle(e.target.value)}
                        >
                          {promptTitle}
                        </textarea>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                      onClick={handleUpdate}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpenEditModal(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <DeleteModal
        isOpen={openDeleteModal}
        setIsOpen={setOpenDeleteModal}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default Card;
