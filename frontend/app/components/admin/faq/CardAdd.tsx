'use client'
import { useState, Fragment, useRef, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Dialog, Transition, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { toast } from 'react-toastify';
import { axiosInstance } from '@/app/utils/config/axios';
import DeleteModal from '../../DeleteModal';
interface CardProps {
  question: string;
  answer: string;
  position: number;
  id: string;
  onSuccess: () => void; 
}

const Card: React.FC<CardProps> = ({ question, answer, position, id, onSuccess }) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [promptQuestion, setPromptQuestion] = useState(question);
  const [promptAnswer, setPromptAnswer] = useState(answer);
  const [promptPosition, setPromptPosition] = useState(position);

  const AxiosIns = axiosInstance('');
  const cancelButtonRef = useRef(null);

  const handleUpdate = async () => {
    try {
      const response = await AxiosIns.put(`/faq/${id}`, {
        question: promptQuestion,
        answer: promptAnswer,
        place: promptPosition,
      });

      setOpen(false);
      onSuccess();
      toast.success('FAQ updated successfully!');
    } catch (error) {
      console.error('Error updating FAQ:', error);
      toast.error('Failed to update FAQ.');
    }
  };

  const handleDelete = async () => {
    try {
      setOpenDeleteModal(true);
      await AxiosIns.delete(`/faq/${id}`);
      setOpenDeleteModal(false);
      onSuccess(); 
      toast.success('FAQ deleted successfully!');
    } catch (error) {
      setOpenDeleteModal(false);
      console.error('Error deleting FAQ:', error);
      toast.error('Failed to delete FAQ.');
    }
  };

  return (
    <>
      <div className="bg-white border font-poppins border-gray-300 w-5/6 shadow-md rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xl font-semibold">{question}</div>
          <div className="flex space-x-2 gap-4">
            <button className="text-black " onClick={() => setOpen(true)}>
              <FaEdit size={30} />
            </button>
            <button className="text-black text-3xl" onClick={() => setOpenDeleteModal(true)}>
              <FaTrash size={30} />
            </button>
          </div>
        </div>
        <div className="text-gray-600">{answer}</div>
        <div className="text-gray-600">Position: {position}</div>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => setOpen(false)}>
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
                          Edit FAQ
                        </Dialog.Title>
                        <div className="mt-2">
                          <input
                            type="text"
                            className="mt-1 block w-96 h-12 rounded-md border-gray-300 shadow-sm outline-none border ps-4 focus:ring-opacity-50"
                            placeholder="Question"
                            value={promptQuestion}
                            onChange={(e) => setPromptQuestion(e.target.value)}
                          />
                          <input
                            type="text"
                            className="mt-1 block w-96 h-12 rounded-md border-gray-300 shadow-sm outline-none border ps-4 focus:ring-opacity-50"
                            placeholder="Answer"
                            value={promptAnswer}
                            onChange={(e) => setPromptAnswer(e.target.value)}
                          />
                          <input
                            type="number"
                            className="mt-1 block w-96 h-12 rounded-md border-gray-300 shadow-sm outline-none border ps-4 focus:ring-opacity-50"
                            placeholder="Position"
                            value={promptPosition}
                            onChange={(e) => setPromptPosition(Number(e.target.value))}
                          />
                        </div>
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
      <DeleteModal
        isOpen={openDeleteModal}
        setIsOpen={setOpenDeleteModal}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default Card;
