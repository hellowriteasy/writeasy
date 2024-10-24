"use client";
import React, { useState, Fragment } from "react";
import { usePDF } from "react-to-pdf";
import { diffChars } from "diff";
import StoryEditor from "./Editor"; // Adjust the import path as necessary
import { TUser } from "@/app/utils/types";
import { axiosInstance } from "@/app/utils/config/axios";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter, usePathname } from "next/navigation";
import { diff_match_patch } from "diff-match-patch";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfDocument from "../ReactPdf/ReactPdfDocument";
import moment from "moment";

interface CardProps {
  id: string;
  title: string;
  description?: string;
  corrections: string;
  type: string;
  prompt_id: string;
  promptTitle: string;
  contestTitle: string;
  contributors: TUser[];
  isPublic?: boolean;
  createdAt: string;
  onsuccess: () => void;
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  corrections,
  description = "",
  type,
  contestTitle,
  promptTitle,
  prompt_id,
  contributors,
  isPublic,
  createdAt,
  onsuccess,
}) => {
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const AxiosIns = axiosInstance("");
  const router = useRouter();
  const pathname = usePathname();

  const toggleDescription = () => setShowFullDescription(!showFullDescription);

  const previewWords = 50;
  const descriptionText = description || "";
  const descriptionWords = descriptionText.split(" ");
  const truncatedDescription =
    descriptionWords.length > previewWords
      ? descriptionWords.slice(0, previewWords).join(" ") + "..."
      : descriptionText;

  const deleteClick = () => {
    AxiosIns.delete(`/stories/${id}`)
      .then(() => {
        onsuccess();
      })
      .catch((error) => {
        console.error("Failed to delete item.", error);
      });
  };

  const getDiff = (original: string, corrected: string) => {
    const dmp = new diff_match_patch();
    const diff = dmp.diff_main(original, corrected);
    dmp.diff_cleanupSemantic(diff);

    return diff.map((part, index) => {
      const style = {
        backgroundColor:
          part[0] === 1
            ? "#D6EDD4"
            : part[0] === -1
            ? "#FFD3D1"
            : "transparent",
        textDecoration: part[0] === -1 ? "line-through" : "none",
        color: part[0] === 1 ? "green" : part[0] === -1 ? "red" : "black",
      };

      // Split the text by newline characters, keeping consecutive newlines
      const segments = part[1].split(/(\n+)/);

      return (
        <span key={index} style={style}>
          {segments.map((segment, i) => {
            // If the segment is just newlines (e.g., '\n' or '\n\n'), return <br /> tags
            if (/\n+/.test(segment)) {
              return [...Array(segment.length)].map((_, brIndex) => (
                <br key={`${index}-${i}-${brIndex}`} />
              ));
            }
            // Otherwise, return the text segment
            return <>{segment}</>;
          })}
        </span>
      );
    });
  };

  if (showEditor) {
    return (
      <StoryEditor
        id={id}
        Content={descriptionText}
        Title={title}
        contributors={contributors}
      />
    );
  }

  const shouldHideButtons =
    pathname.endsWith("contest") || pathname.endsWith("game");
  const content = showFullDescription
    ? (descriptionText || "").replace(/\n/g, "<br>")
    : truncatedDescription.replace(/\n/g, "<br>");

  return (
    <div className="bg-white flex sm:w-10/12 flex-col justify-between w-3/4 mt-3 min-h-72 border-2 border-slate-300 shadow-sm rounded-3xl p-6 transition-all duration-300">
      <div ref={targetRef} className="flex flex-col mb-4">
        <h1 className="text-2xl sm:text-sm font-bold mb-4 font-unkempt">
          {contestTitle ? `${contestTitle} > ` : ""} {promptTitle}
        </h1>
        <p className="py-4 font-comic">
          Last modified : {moment(createdAt).format("lll")}
        </p>
        <div>
          <h2 className="py-2 font-bold font-unkempt">{title}</h2>
          <div
            dangerouslySetInnerHTML={{ __html: content }}
            className={`text-gray-700 sm:text-sm  font-comic transition-all duration-300 `}
          />
          {showDiff && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold font-comic">Corrections:</h3>
              <p className="py-4 font-comic">
                {corrections ? (
                  getDiff(description, corrections)
                ) : (
                  <div className="flex gap-x-1">
                    <span>
                      Correction is being done in background hold on please!
                    </span>
                    <span
                      className="underline cursor-pointer"
                      onClick={onsuccess}
                    >
                      Refresh
                    </span>
                  </div>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        {!shouldHideButtons && (
          <button
            // onClick={() => {
            //   setShowFullDescription(true);
            //   toPDF();
            // }}
            className="bg-white font-unkempt border-2 sm:p-0 sm:w-20 sm:h-8 sm:rounded-full sm:text-[10px] rounded-2xl border-slate-700 text-black px-4 py-2"
          >
            <PDFDownloadLink
              document={
                <PdfDocument corrected={corrections} originals={description} />
              }
              fileName={`${promptTitle}pdf`}
            >
              {({ blob, url, loading, error }) =>
                loading ? "Downloading.." : "PDF"
              }
            </PDFDownloadLink>
          </button>
        )}
        {type === "game" && (
          <button
            onClick={() => router.push(`/Games/${prompt_id}/play`)}
            className="bg-white font-unkempt border-2 sm:px-1 sm:w-20 sm:h-8 sm:rounded-full sm:text-[10px] rounded-2xl border-slate-700 text-black px-4 py-2"
          >
            Contribute
          </button>
        )}
        {type === "practice" && !isPublic ? (
          <button
            onClick={() =>
              router.push(`/Practices/${prompt_id}/playground?storyId=${id}`)
            }
            className="bg-white font-unkempt border-2 sm:px-1 sm:w-20 sm:h-8 sm:rounded-full sm:text-[10px] rounded-2xl border-slate-700 text-black px-4 py-2"
          >
            Continue
          </button>
        ) : (
          ""
        )}
        {!shouldHideButtons && (
          <button
            onClick={() => setShowDiff(!showDiff)}
            className="bg-white font-unkempt border-2 sm:p-1 sm:w-20 sm:h-8 sm:rounded-full sm:text-[10px] rounded-2xl border-slate-700 text-black px-4 py-2"
          >
            {showDiff ? "Original" : "Marked"}
          </button>
        )}
        <button
          onClick={() => setIsDeleteDialogOpen(true)}
          className="bg-white border-2 font-unkempt sm:p-1 sm:w-20 sm:h-8 sm:rounded-full sm:text-[10px] rounded-2xl border-slate-700 text-black px-4 py-2"
        >
          Delete
        </button>
        {descriptionWords.length > previewWords && (
          <button
            onClick={toggleDescription}
            className="bg-black sm:p-1 font-unkempt sm:w-20 sm:h-8 sm:rounded-full sm:text-[10px] text-white px-4 py-2 rounded-2xl"
          >
            {showFullDescription ? "Show Less" : "Read More"}
          </button>
        )}
      </div>

      <Transition appear show={isDeleteDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsDeleteDialogOpen(false)}
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
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium font-unkempt leading-6 text-gray-900"
                  >
                    Are you sure you want to delete this item?
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 font-unkempt">
                      This action cannot be undone. Are you sure you want to
                      proceed?
                    </p>
                  </div>

                  <div className="mt-4 flex space-x-4">
                    <button
                      type="button"
                      className="inline-flex font-unkempt justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                      onClick={() => {
                        deleteClick();
                        setIsDeleteDialogOpen(false);
                      }}
                    >
                      Yes, delete it
                    </button>
                    <button
                      type="button"
                      className="inline-flex font-unkempt justify-center rounded-md border border-transparent bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                      onClick={() => setIsDeleteDialogOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Card;
