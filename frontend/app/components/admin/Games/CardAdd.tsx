import { useState, Fragment, useRef } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Dialog, Transition, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

interface CardProps {
  title: string;
  description:string;
}


const CardAdd: React.FC<CardProps> = ({ title, description }) => {
  const [open, setOpen] = useState(false);
  const [promptTitle, setPromptTitle] = useState(title);
  const [Description, setDescription] = useState("");
 

  const cancelButtonRef = useRef(null);
 

  return (
    <>
      <div className="bg-white shadow-md border border-gray-300 w-5/6 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xl font-semibold">{title}</div>
          <div className="flex space-x-2 gap-4 ">
            <button className="text-blue-500  hover:text-blue-600" onClick={() => setOpen(true)}>
              <FaEdit size={30} />
            </button>
            <button className="text-red-500 text-3xl hover:text-red-600">
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
                  <div className="bg-white h-96 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                          Edit Prompt
                        </Dialog.Title>
                        <div className="mt-2">
                          <input
                            type="text"
                            className="mt-1 block w-96 h-12 rounded-md border-gray-300 shadow-sm outline-none border ps-4 focus:ring-opacity-50"
                            placeholder="Prompt Title"
                            value={promptTitle}
                            onChange={(e) => setPromptTitle(e.target.value)}
                          />
                         
                        </div>
                        <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
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
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                      onClick={() => setOpen(false)}
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
    </>
  );
};

export default CardAdd;
