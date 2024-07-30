import { useState, Fragment, useRef, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import { axiosInstance } from "@/app/utils/config/axios";
import { TStory } from "@/app/utils/types";
import DeleteModal from "../../../DeleteModal";
import { useCustomToast } from "@/app/utils/hooks/useToast";

interface CardProps {
  story: TStory;
  onsuccess: () => void;
}

const Card: React.FC<CardProps> = ({ story, onsuccess }) => {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(true);
  const [feedback, setFeedback] = useState(story.correctionSummary);
  const [storyDetail, setStoryDetail] = useState(story.content);
  const [grade, setGrade] = useState(story.score); // Renamed to grade for clarity
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const AxiosIns = axiosInstance("");
  const toast = useCustomToast();

  useEffect(() => {
    setFeedback(story.correctionSummary);
    setStoryDetail(story.content);
    setGrade(story.score);
  }, [story]);

  const handleUpdate = async () => {
    try {
      await AxiosIns.put(`/stories/${story._id}`, {
        correctionSummary: feedback,
        content: storyDetail,
        score: grade,
      });
      toast("Story updated successfully", "success");
      setOpen(false);
      onsuccess();
    } catch (error) {
      console.error("There was an error updating the story!", error);
      toast("Failed to update story", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await AxiosIns.delete(`/stories/${story._id}`);
      setDeleteModalOpen(false);
      onsuccess(); // This function should be defined in the parent component, where this card is used
      // You might want to trigger a state update to remove the deleted story from the UI
    } catch (error) {
      console.error("There was an error deleting the story!", error);
      toast("Failed to delete story", "error");
    }
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-lg w-5/6 border z-50 border-gray-300 p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xl font-semibold">{story.title}</div>
          <div className="flex space-x-2 gap-4">
            <button className="text-black" onClick={() => setOpen(true)}>
              <FaEdit size={30} />
            </button>
            <button
              className="text-black"
              onClick={() => setDeleteModalOpen(true)}
            >
              <FaTrashAlt size={30} />
            </button>
          </div>
        </div>
        <div className="text-gray-700">Prompt : {story.prompt.title}</div>
        <div className="text-gray-700">User: {story.user.username}</div>
        <div className="text-gray-700">Score: {story.score}</div>
        <div className="text-gray-700">
          Submission Date: {new Date(story.submissionDateTime).toLocaleString()}
        </div>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative font-poppins z-50"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
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
            <div className="flex min-h-full w-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-5/6 z-50 sm:w-full sm:max-w-4xl">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          {story.title}
                        </Dialog.Title>
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          {story.user.username}
                        </Dialog.Title>
                        <div className="mt-2">
                          <div className="mb-4 flex gap-4  items-center">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Grade:
                            </label>
                            <input
                              className="mt-1 block w-20 h-10 rounded-md border-gray-300 shadow-sm outline-none border ps-4 focus:ring-opacity-50"
                              value={grade}
                              onChange={(e) => setGrade(Number(e.target.value))}
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Feedback
                            </label>
                            <textarea
                              className="mt-1 block w-full p-8 h-80 rounded-md border-gray-300 shadow-sm outline-none border ps-4 focus:ring-opacity-50"
                              placeholder="Enter your feedback"
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Story Details
                            </label>
                            <textarea
                              className="mt-1 block w-full h-96 p-8 rounded-md border-gray-300 shadow-sm outline-none border ps-4 focus:ring-opacity-50"
                              placeholder="Story details"
                              value={storyDetail}
                              onChange={(e) => setStoryDetail(e.target.value)}
                              disabled={edit}
                            />
                          </div>
                          <button
                            type="button"
                            className="inline-flex  mx-4 justify-center rounded-md bg-black font-poppins px-4 py-2 font-semibold text-white shadow-sm  sm:ml-3 sm:w-auto"
                            onClick={() => setEdit(false)}
                            disabled={!edit}
                          >
                            Edit
                          </button>
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

      <DeleteModal
        isOpen={deleteModalOpen}
        setIsOpen={setDeleteModalOpen}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default Card;
