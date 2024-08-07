import { Fragment, useState } from 'react';
import { Dialog, Transition, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

interface ModalProps {
  setIsModalOpen: (isOpen: boolean) => void;
}
interface CardProps {
    title: string;
    type: string;
  }
const Modal: React.FC<ModalProps> = ({ setIsModalOpen }) => {
  const [promptTitle, setPromptTitle] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const handleUpdate = () => {
    // Add your update logic here
    setIsModalOpen(false);
  };

  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-5/6 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
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
                            
                            onChange={(e) => setPromptTitle(e.target.value)}
                          />
                         <Menu as="div" className="relative mt-3">
                            <MenuButton className="w-96 text-left rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                              { "Select Type"}
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
                                {["Type 1", "Type 2", "Type 3"].map((type) => (
                                  <MenuItem key={type}>
                                    {({ active }) => (
                                      <button
                                        className={`${
                                          active ? "bg-indigo-600 text-white" : "text-gray-900"
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                        onClick={() => setSelectedType(type)}
                                      >
                                        {type}
                                      </button>
                                    )}
                                  </MenuItem>
                                ))}
                              </MenuItems>
                            </Transition>
                          </Menu>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    onClick={handleUpdate}
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
  );
};

export default Modal;
