"use client";
import { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  Transition,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "@/app/utils/config/axios";
import { TPromptAdd } from "@/app/admin/contests/edit/page";

interface ModalProps {
  setIsModalOpen: (isOpen: boolean) => void;
  onAddPrompt: (prompt: TPromptAdd) => void;
}



const Modal: React.FC<ModalProps> = ({ setIsModalOpen, onAddPrompt }) => {
  const [promptTitle, setPromptTitle] = useState("");
  const AxiosIns = axiosInstance("");

  
  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      event.preventDefault();
      event.returnValue =
        "Refreshing the page may erase your changes. Are you sure you want to continue?";
      return "Refreshing the page may erase your changes. Are you sure you want to continue?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleAddPrompt = async () => {
    try {
      const response = await AxiosIns.post("/prompts", {
        title: promptTitle,
      
        promptType: "contest",
      });
      const { _id } = response.data;
      onAddPrompt({
        _id,
        promptText: promptTitle,
        title: promptTitle,
      });
      toast.success("Prompt added successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding prompt:", error);
      toast.error("Failed to add prompt.");
    }
  };

 

  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10 h-screen"
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:min-h-[50vh] h-[40vw]">
                <div className="bg-white px-4 pb-4 pt-5  sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Add Prompt
                      </Dialog.Title>
                      <div className="mt-2">
                        <input
                          type="text"
                          className="mt-1 block w-96 h-12 rounded-md border-gray-300 shadow-sm outline-none ps-4 focus:ring-opacity-50"
                          placeholder="Prompt Title"
                          value={promptTitle}
                          onChange={(e) => setPromptTitle(e.target.value)}
                        />
                       
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm  sm:ml-3 sm:w-auto"
                    onClick={handleAddPrompt}
                  >
                    Add
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
  );
};

export default Modal;
