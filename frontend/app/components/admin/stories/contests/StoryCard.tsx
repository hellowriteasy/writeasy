import { useState, Fragment, useRef, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import { axiosInstance } from "@/app/utils/config/axios";
import { TStory } from "@/app/utils/types";
import { useCustomToast } from "@/app/utils/hooks/useToast";
import { FaTrash } from "react-icons/fa6";
import DeleteModal from "@/app/components/DeleteModal";
interface CardProps {
  story: TStory;
  refetchStory: () => void;
}

const Card: React.FC<CardProps> = ({ story, refetchStory }) => {
  const [open, setOpen] = useState(false);
  const [storyDetail, setStoryDetail] = useState(story.content);
  const [isTopStory, setIsTopStory] = useState(false);
  const cancelButtonRef = useRef(null);
  const toast = useCustomToast();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const AxiosIns = axiosInstance("");
  useEffect(() => {
    setStoryDetail(story.content);
    setIsTopStory(!!story.isTopWriting);
  }, [story]);

  const handleChangeTopStoryCheckBox = async () => {
    if (isTopStory) {
      await handleUnMarkFromTopStory();
    }

    if (!isTopStory) {
      await handleMarkAsTopStory();
    }
  };

  const handleMarkAsTopStory = async () => {
    try {
      const res = await AxiosIns.post(`/stories/mark-top-story/${story._id}`);
      if (res.status === 200) {
        setIsTopStory(true);
        toast("Story marked as top story", "success");
      }
    } catch (error) {
      console.log(error);
      toast("Failed to mark as top story", "error");
    }
    //
  };
  const handleUnMarkFromTopStory = async () => {
    try {
      const res = await AxiosIns.post(`/stories/remove-top-story/${story._id}`);
      if (res.status === 200) {
        setIsTopStory(false);
        toast("Story removed from top story", "success");
      }
    } catch (error) {
      console.log(error);
      toast("Failed to mark as top story", "error");
    }
  };
  const handleDeleteStory = async () => {
    try {
      const res = await AxiosIns.delete(`/stories/${story._id}`);
      if (res.status === 200) {
        refetchStory();
        toast("Story deleted successfully", "success");
      }
    } catch (error) {
      toast("Failed to delete story", "error");
    }
  };
  return (
    <>
      <div className="bg-white shadow-md rounded-lg w-full border z-50 border-gray-300 p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xl font-semibold">
            {story.contest?.contestTheme}/{story.prompt.title}
          </div>
        </div>
        {isTopStory ? (
          <>
            <div className="text-gray-700">⭐️ Top story</div>

            <div className="text-gray-700">Score : {story.score || "N/A"}</div>
          </>
        ) : null}

        <div className="text-gray-700">Prompt : {story.prompt.title}</div>
        <div className="text-gray-700">User: {story.user.username}</div>

        {/* <div className="text-gray-700">Score: {contest.score}</div> */}

        <div className="text-gray-700">
          Submission Date: {new Date(story.submissionDateTime).toLocaleString()}
        </div>
        <div className="flex space-x gap-4 my-2">
          <button className="text-black" onClick={() => setOpen(true)}>
            <FaEdit size={20} />
          </button>
          <button
            className="text-red-500"
            onClick={() => setOpenDeleteModal(true)}
          >
            <FaTrash size={20} />
          </button>
        </div>
      </div>
      <DeleteModal
        title="Are you sure you want to delete this story? This action can't be undone."
        isOpen={openDeleteModal}
        setIsOpen={setOpenDeleteModal}
        onConfirm={handleDeleteStory}
      />
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
                          {/* {contest.user.username} */}
                        </Dialog.Title>
                        <div className="mt-2">
                          <div className="mb-4 flex gap-4  items-center">
                            <div className="mb-4 flex gap-2 items-center">
                              <input
                                type="checkbox"
                                name="top_writing"
                                checked={isTopStory}
                                onChange={handleChangeTopStoryCheckBox}
                              />
                              <p>Mark as top writing</p>
                            </div>
                          </div>
                          {/* <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Feedback
                            </label>
                            <textarea
                              className="mt-1 block w-full p-8 h-80 rounded-md border-gray-300 shadow-sm outline-none border ps-4 focus:ring-opacity-50"
                              placeholder="Enter your feedback"
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                            />
                          </div> */}
                          <div className="mb-4">
                            <textarea
                              className="mt-1 block w-full h-96 p-8 rounded-md border-gray-300 shadow-sm outline-none border ps-4 focus:ring-opacity-50"
                              placeholder="Story details"
                              value={storyDetail}
                              onChange={(e) => setStoryDetail(e.target.value)}
                              // disabled={Edit}
                              disabled={true}
                            />
                          </div>
                          {/* <button
                            type="button"
                            className="inline-flex  mx-4 justify-center rounded-md bg-black font-poppins px-4 py-2 font-semibold text-white shadow-sm  sm:ml-3 sm:w-auto"
                            onClick={() => setEdit(false)}
                            disabled={!Edit}
                          >
                            Edit
                          </button> */}
                          {/* <button
                            onClick={() => setShowDiff(!showDiff)}
                            className="bg-white border-2 rounded-2xl border-slate-700 text-black px-4 py-2"
                          >
                            {showDiff ? "Original" : "Marked"}
                          </button> */}
                          {/* {showDiff && (
                            <div className="mt-4 p-8 bg-white rounded-xl border border-slate-300">
                              {compareSentences(storyDetail, corrections)}
                            </div>
                          )} */}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    {!Edit && (
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm  sm:ml-3 sm:w-auto"
                        onClick={handleUpdate}
                      >
                        Update
                      </button>
                    )}
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div> */}
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
