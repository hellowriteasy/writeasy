"use client";
import { ChangeEvent, Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "@/app/utils/config/axios";

interface ModalProps {
  setIsModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
}

const ModalGame: React.FC<ModalProps> = ({ setIsModalOpen, onSuccess }) => {
  const [promptTitle, setPromptTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const AxiosIns = axiosInstance("");
  const [isPinned,setIsPinned] =useState(false)
  const handleUpdate = async () => {
    try {
      const response = await AxiosIns.post("/prompts", {
        title: promptTitle,
        description: description,
        promptType: "game",
      });
      setIsModalOpen(false);
      onSuccess();
      // toast.success("Prompt added successfully!");
    } catch (err: any) {
      setError("Error submitting the prompt");
      console.error("Error:", err);
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8  sm:max-w-lg sm:w-[95%]">
                <div className="bg-white px-4 sm:px-2 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start items-center w-full ">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full ">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Add New Game Prompt
                      </Dialog.Title>
                      <div className="mt-2 w-full">
                        <input
                          type="text"
                          className="mt-1 block w-full h-12 rounded-md border-gray-300 shadow-sm outline-none border ps-4 focus:ring-opacity-50"
                          placeholder="Prompt Title"
                          value={promptTitle}
                          onChange={(e) => setPromptTitle(e.target.value)}
                        />
                      </div>

                      <div className="mb-4 mt-2 w-full">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="description"
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          rows={4}
                          className="mt-1 block w-full h-40 rounded-md border p-4 border-gray-300 shadow-sm outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                      <div className="w-full flex flex-row gap-x-2 my-2">
                        <input
                          type="checkbox"
                          checked={isPinned}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setIsPinned(e.target.checked);
                          }}
                        />
                        <p>Should pin this prompt</p>
                      </div>

                      {error && <p className="text-red-500">{error}</p>}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                    onClick={handleUpdate}
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

export default ModalGame;
