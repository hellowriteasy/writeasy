import { useState, Fragment, useRef, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import { diffChars } from "diff";
import { axiosInstance } from "@/app/utils/config/axios";
import { TStory } from "@/app/utils/types";
import { useCustomToast } from "@/app/utils/hooks/useToast";
interface CardProps {
  contest: TStory;
}

const Card: React.FC<CardProps> = ({ contest }) => {
  const [open, setOpen] = useState(false);
  const [Edit, setEdit] = useState(true);
  const [showDiff, setShowDiff] = useState(false);
  const [feedback, setFeedback] = useState(contest.correctionSummary);
  const [storyDetail, setStoryDetail] = useState(contest.content);
  const [isTopStory, setIsTopStory] = useState(false);
  const [corrections, setCorrections] = useState(contest.corrections);
  const [grade, setGrade] = useState(contest.score); // Renamed to grade for clarity
  const cancelButtonRef = useRef(null);
  const toast = useCustomToast();
  const AxiosIns = axiosInstance("");
  useEffect(() => {
    setFeedback(contest.correctionSummary);
    setStoryDetail(contest.content);
    setCorrections(contest.corrections);
    setGrade(contest.score);
    setIsTopStory(!!contest.isTopWriting);
  }, [contest]);

  const handleUpdate = async () => {
    try {
      const response = await AxiosIns.put(
        `http://localhost:8000/api/stories/${contest._id}`,
        {
          correctionSummary: feedback,
          content: storyDetail,
          score: grade,
        }
      );
      toast("contest updated successfully", "success");
      setOpen(false);
    } catch (error) {
      console.error("There was an error updating the story!", error);
      toast("failed to update contest", "error");
    }
  };

  const compareSentences = (description = "", corrections = "") => {
    if (!description) {
      return (
        <span style={{ color: "red", backgroundColor: "lightcoral" }}>
          No original description provided.
        </span>
      );
    }

    if (!corrections) {
      return (
        <span style={{ color: "green", backgroundColor: "lightgreen" }}>
          No corrections provided.
        </span>
      );
    }

    const diff = diffChars(description, corrections);
    return diff.map((part, index) => {
      const style = {
        backgroundColor: part.added
          ? "lightgreen"
          : part.removed
          ? "lightcoral"
          : "transparent",
        textDecoration: part.removed ? "line-through" : "none",
        color: part.added ? "green" : part.removed ? "red" : "black",
      };
      return (
        <span key={index} style={style}>
          {part.value}
        </span>
      );
    });
  };

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
      const res = await AxiosIns.post(`/stories/mark-top-story/${contest._id}`);
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
      const res = await AxiosIns.post(
        `/stories/remove-top-story/${contest._id}`
      );
      if (res.status === 200) {
        setIsTopStory(false);
        toast("Story removed from top story", "success");
      }
    } catch (error) {
      console.log(error);
      toast("Failed to mark as top story", "error");
    }
  };
  return (
    <>
      <div className="bg-white shadow-md rounded-lg w-full border z-50 border-gray-300 p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xl font-semibold">{contest.contest?.contestTheme}/{ contest.prompt.title}</div>
          <div className="flex space-x-2 gap-4">
            <button className="text-black" onClick={() => setOpen(true)}>
              <FaEdit size={30} />
            </button>
          </div>
        </div>
        {contest.isTopWriting ? (
          <div className="text-gray-700">⭐️ Top story</div>
        ) : null}

        <div className="text-gray-700">Prompt : {contest.prompt.title}</div>
        <div className="text-gray-700">User: {contest.user.username}</div>

        {/* <div className="text-gray-700">Score: {contest.score}</div> */}

        <div className="text-gray-700">
          Submission Date:{" "}
          {new Date(contest.submissionDateTime).toLocaleString()}
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
                          {contest.title}
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
                              disabled={Edit}
                            />
                          </div>
                          <button
                            type="button"
                            className="inline-flex  mx-4 justify-center rounded-md bg-black font-poppins px-4 py-2 font-semibold text-white shadow-sm  sm:ml-3 sm:w-auto"
                            onClick={() => setEdit(false)}
                            disabled={!Edit}
                          >
                            Edit
                          </button>
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
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
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
