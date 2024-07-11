import { useState, useEffect, Fragment } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Dialog, Transition, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { axiosInstance } from "@/app/utils/config/axios";

interface CardProps {
  title: string;
  type?: string[]; // Make the type prop optional
  id: string;
}



const   Card: React.FC<CardProps> = ({ title, type = [], id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Title, setTitle] = useState(title);
  const AxiosIns = axiosInstance("");

  

  const handleDeleteContest = async () => {
    try {
      await AxiosIns.delete(`/prompts/${id}`);
      toast.success("Contest deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete contest.");
    }
  };

  const handleUpdateContest = async () => {
    try {
      await AxiosIns.put(`/prompts/${id}`, {
        promptText: Title,
        promptType: 'contest'
      });

      // Update title and categories if the response is successful
      setTitle(Title);

      toast.success("Contest updated successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating contest:", error);
      toast.error("Failed to update contest.");
    }
  };

 
  return (
    <>
      <div className="bg-white border border-gray-300 shadow-md rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xl font-semibold">{Title}</div> {/* Use Title state here */}
          <div className="flex space-x-2 gap-4">
            <button onClick={() => setIsModalOpen(true)} className="text-black">
              <FaEdit size={20} />
            </button>
            <button onClick={handleDeleteContest} className="text-black">
              <FaTrash size={20} />
            </button>
          </div>
        </div>
      
      </div>

      {isModalOpen && (
        <Transition.Root show={isModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
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
              <div className="flex min-h-full h-[600px] items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:min-h-[50vh] h-[90vh]">
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                            Update Contest
                          </Dialog.Title>
                          <div className="mt-2">
                            <input
                              type="text"
                              className="mt-1 block w-96 h-12 rounded-md border-gray-300 shadow-sm outline-none ps-4 focus:ring-opacity-50"
                              placeholder="Prompt Title"
                              value={Title}
                              onChange={(e) => setTitle(e.target.value)}
                            />
                           
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm  sm:ml-3 sm:w-auto"
                        onClick={handleUpdateContest}
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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
      )}
    </>
  );
};

export default Card;
