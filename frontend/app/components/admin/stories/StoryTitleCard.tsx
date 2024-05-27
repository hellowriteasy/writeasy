import { useState, Fragment, useRef } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Dialog, Transition } from '@headlessui/react';

interface CardProps {
  _id: string;
  user: string;
  title: string;
  content: string;
  wordCount: number;
  submissionDateTime: string;
  prompt: string;
  storyType: string;
  correctionSummary: string;
  corrections: string;
  score: number;
}

const Card: React.FC<CardProps> = ({
  _id,
  user,
  title,
  content,
  wordCount,
  submissionDateTime,
  prompt,
  storyType,
  correctionSummary,
  corrections,
  score
}) => {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [storyDetail, setStoryDetail] = useState(content);

  const cancelButtonRef = useRef(null);

  return (
    <>
      <div className="bg-white shadow-md rounded-lg w-5/6 border border-gray-300 p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xl font-semibold">{title}</div>
          <div className="flex space-x-2 gap-4">
            <button className="text-blue-500 hover:text-blue-600" onClick={() => setOpen(true)}>
              <FaEdit size={30} />
            </button>
            <button className="text-red-500 text-3xl hover:text-red-600">
              <FaTrash size={30} />
            </button>
          </div>
        </div>
        <div className="text-gray-600">User: {user}</div>
        <div className="text-gray-600">Submission Date: {new Date(submissionDateTime).toLocaleString()}</div>
        <div className="text-gray-600">Score: {score}</div>
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl"> {/* Increased max-width to max-w-4xl */}
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                          {title}
                        </Dialog.Title>
                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                          {user}
                        </Dialog.Title>
                        <div className="mt-2">
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Feedback
                            </label>
                            <textarea
                              className="mt-1 block w-full h-24 rounded-md border-gray-300 shadow-sm outline-none border ps-4 focus:ring-opacity-50"
                              placeholder="Enter your feedback"
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                            />
                          </div>
                          <div className="mb-4 ">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Story Details
                            </label>
                            <textarea
                              className="mt-1 block w-full h-96 p-4 rounded-md border-gray-300 shadow-sm outline-none border ps-4 focus:ring-opacity-50"
                              placeholder="Story details"
                              value={storyDetail}
                              onChange={(e) => setStoryDetail(e.target.value)}
                            />
                          </div>
                          <div className="mb-4 flex space-x-2">
                            <button className="bg-gray-200 text-gray-800 px-3 py-2 rounded-l-lg border-r-0">
                              Marked
                            </button>
                            <button className="bg-gray-200 text-gray-800 px-3 py-2 rounded-r-lg border-l-0">
                              Original
                            </button>
                          </div>
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

export default Card;
