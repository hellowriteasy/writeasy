import { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  Transition,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "@/app/utils/config/axios";
import useUploadFile from "@/app/hooks/useFileUpload";

interface ModalProps {
  setIsModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
}

interface CardProps {
  title: string;
  type: string;
}
interface Category {
  _id: string;
  name: string;
}

const Modal: React.FC<ModalProps> = ({ setIsModalOpen, onSuccess }) => {
  const [promptTitle, setPromptTitle] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // State for selected categories
  const [promptCards, setPromptCards] = useState<CardProps[]>([]);
  const [category, setCategory] = useState<Category[]>([]); // State to store added prompt cards
  const [file, setFile] = useState<File | null>(null);
  const AxiosIns = axiosInstance("");
  const { uploadFile } = useUploadFile();
  const handleAdd = async () => {
    const promptData = {
      title: promptTitle,
      promptCategory: selectedCategories, // Use selectedCategories array
      promptType: "practice",
      image: "",
    };

    let imageUrl = "";
    if (file) {
      imageUrl = await uploadFile(file);
      promptData.image = imageUrl;
    }

    AxiosIns.post("/prompts", promptData)
      .then((response) => {
        const newPrompt: CardProps = {
          title: promptTitle,
          type: selectedCategories.join(", "), // Concatenate selected categories for display
        };
        setPromptCards([...promptCards, newPrompt]); // Add the new prompt card to the state
        setIsModalOpen(false);
        onSuccess();
        // toast.success('Prompt added successfully!');
      })
      .catch((error) => {
        console.error("There was an error posting the data!", error);
        // toast.error('Failed to add prompt.');
      });
  };

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat !== category)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
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
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFile(file);
    }
  };
  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsModalOpen(false)}
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
          <div className="fixed inset-0  bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative flex flex-col  items-center transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-1/2 h-full sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-2 pt-2 sm:p-6 sm:pb-4 w-full">
                  <div className="sm:flex sm:items-start w-full">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full ">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Add Prompt
                      </Dialog.Title>
                      <div className="mt-2 w-full ">
                        <input
                          className="mt-1 block h-12 rounded-md border-gray-300 shadow-sm outline-none border ps-4 focus:ring-opacity-50 w-full"
                          placeholder="Prompt Title"
                          value={promptTitle}
                          onChange={(e) => setPromptTitle(e.target.value)}
                        />

                        <Menu as="div" className="relative  mt-3">
                          <MenuButton className="w-full text-left rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                            {selectedCategories.length === 0
                              ? "Select Category"
                              : selectedCategories.join(", ")}
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
                            <MenuItems className=" mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {category.length > 1 ? (
                                category.map((data) => (
                                  <MenuItem key={data._id}>
                                    {({ active }) => (
                                      <button
                                        className={`${
                                          selectedCategories.includes(data.name)
                                            ? "bg-custom-yellow text-white"
                                            : "text-gray-900"
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                        onClick={() =>
                                          toggleCategory(data.name)
                                        }
                                      >
                                        {data.name}
                                      </button>
                                    )}
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem>
                                  {({ active }) => (
                                    <button
                                      className={`"text-gray-900"
                                     group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                      Loading categories...
                                    </button>
                                  )}
                                </MenuItem>
                              )}
                            </MenuItems>
                          </Transition>
                        </Menu>
                        {file ? (
                          <div className="mt-4 ">
                            <img
                              src={URL.createObjectURL(file)}
                              alt="practise image"
                              className="w-full h-60 object-contain rounded-md"
                            />
                          </div>
                        ) : (
                          ""
                        )}
                        <input
                          className="mt-4 mr-auto"
                          type="file"
                          name="image"
                          onChange={handleImageFileChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 flex items-center  gap-4 sm:flex sm:flex-row-reverse  sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm  sm:ml-3 sm:w-auto"
                    onClick={handleAdd}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setIsModalOpen(false)}
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
  );
};

export default Modal;
