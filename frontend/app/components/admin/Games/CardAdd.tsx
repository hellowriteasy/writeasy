import { useState, Fragment, useRef,useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Dialog, Transition, Menu, MenuItem } from '@headlessui/react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { axiosInstance } from '@/app/utils/config/axios';
import DeleteModal from '../../DeleteModal';
interface CardProps {
  title: string;
  description: string;
  id: string;
  categories: string[];
  onSuccess: () => void; 
}
interface Category{
  _id:string,
  name:string
}

const CardAdd: React.FC<CardProps> = ({ title, description, id, categories,onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [promptTitle, setPromptTitle] = useState(title);
  const [promptDescription, setPromptDescription] = useState(description);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categories);
  const [Categories, setCategories] = useState<Category[]>([]);
  const cancelButtonRef = useRef(null);
  const AxiosIns = axiosInstance("");

  const handleUpdate = async () => {
    try {
      await AxiosIns.put(`/prompts/${id}`, {
        title: promptTitle,
        description: promptDescription,
        promptType: 'game',
        promptCategory: selectedCategories,
      });
      setOpen(false);
      onSuccess();
      toast.success('Prompt updated successfully!');
    } catch (error) {
      toast.error('Error updating prompt.');
      console.error('Error:', error);
    }
  };

  const handleDelete = async () => {
    try {
      setOpenDeleteModal(true)
      await AxiosIns.delete(`/prompts/${id}`);
      setOpenDeleteModal(false)
      onSuccess();
      toast.success('Prompt deleted successfully!');
      // Optionally, remove the prompt from the UI here or refresh the list.
    } catch (error) {
      setOpenDeleteModal(false)
      toast.error('Error deleting prompt.');
      console.error('Error:', error);
    }
  };
  
  const toggleCategory = (category: string) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((cat) => cat !== category)
        : [...prevCategories, category]
    );
  };
  useEffect(() => {
    const getCategory = async () => {
      try {
        const { data } = await AxiosIns.get<{ categories: Category[] }>('/category');
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getCategory();
  }, []);



  return (
    <>
      <div className="bg-white shadow-md border border-gray-300 w-5/6 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xl font-semibold">{title}</div>
          <div className="flex space-x-2 gap-4">
            <button className="text-black" onClick={() => setOpen(true)}>
              <FaEdit size={30} />
            </button>
            <button className="text-black text-3xl" onClick={() => setOpenDeleteModal(true)}>
              <FaTrash size={30} />
            </button>
          </div>
        </div>
        <div className="text-gray-800 w-5/6">{description}</div>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
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

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white h-auto px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                          Edit Prompt
                        </Dialog.Title>
                        <div className="mt-2">
                          <input
                            type="text"
                            className="mt-1 block w-full h-12 rounded-md border-gray-300 shadow-sm outline-none border ps-4 focus:ring-opacity-50"
                            placeholder="Prompt Title"
                            value={promptTitle}
                            onChange={(e) => setPromptTitle(e.target.value)}
                          />
                        </div>
                        <div className="mt-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categories">
                            Categories
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {Categories.map((category) => (
                              <button
                                key={category._id}
                                className={`px-3 py-1 rounded-full border ${
                                  selectedCategories.includes(category.name)
                                    ? 'bg-black text-white'
                                    : 'bg-gray-200 text-gray-700'
                                }`}
                                onClick={() => toggleCategory(category.name)}
                              >
                                {category.name}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                            Description
                          </label>
                          <textarea
                            id="description"
                            rows={4}
                            className="mt-1 block w-full h-40 rounded-md border p-4 border-gray-300 shadow-sm outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Description"
                            value={promptDescription}
                            onChange={(e) => setPromptDescription(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm  sm:ml-3 sm:w-auto"
                      onClick={handleUpdate}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
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
      <ToastContainer />
      <DeleteModal
        isOpen={openDeleteModal}
        setIsOpen={setOpenDeleteModal}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default CardAdd;
