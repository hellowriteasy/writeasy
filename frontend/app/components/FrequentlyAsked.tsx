"use client";
import { useState, useEffect } from "react";
import Group from "@/public/Landingpage-img/groupqn.svg";
import Path from "@/public/Landingpage-img/path34.svg";
import Image from "next/image";
import cloud from "@/public/Game/sm-cloud.svg";
import { Disclosure } from "@headlessui/react";
import { Transition } from "@headlessui/react";
import axios from "axios";
import { axiosInstance } from "../utils/config/axios";
import useAuthStore from "../store/useAuthStore";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

const FrequentlyAsked = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const { token } = useAuthStore();
  const axiosIns = axiosInstance(token || "");
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axiosIns.get("/faq");
        setFaqs(response.data);
        setOpenId(response.data[0]?._id || null); // Initialize with the first question open if available
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };

    fetchFaqs();
  }, []);

  const displayedFaqs = showAll ? faqs : faqs.slice(0, 5);

  const handleShowMore = () => {
    setShowAll(true);
  };

  return (
    <div className="relative w-full min-h-screen text-black flex flex-col items-center px-4 md:px-10">
      <div className="absolute left-4 md:left-10 vsm-hide top-20 md:top-32">
        <Image className="w-[13vw]" src={Group} alt="group" />
      </div>
      <div className="absolute right-4 md:right-10 top-40 md:top-60">
        <Image className="w-[5vw]" src={Path} alt="path" />
      </div>
      <div className="text-3xl flex flex-col items-center font-bold font-comic gap-3">
        <h1 className="text-center font-crayon text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold pt-5 md:pt-10">
          Frequently Asked Questions
        </h1>

        <div className="w-full pt-16 px-4">
          <div className="mx-auto w-full max-w-lg">
            <div className="divide-y divide-gray-300 rounded-xl flex flex-col items-center">
              {displayedFaqs.map((question) => (
                <Disclosure
                  as="div"
                  className="p-4 md:p-6 w-full"
                  key={question._id}
                >
                  {({ open }) => (
                    <>
                      <Disclosure.Button
                        className="group flex w-full items-center justify-center focus:outline-none"
                        onClick={() =>
                          setOpenId(
                            openId === question._id ? null : question._id
                          )
                        }
                      >
                        <span className="text-lg md:text-xl font-medium text-black">
                          {question.question}
                        </span>
                      </Disclosure.Button>
                      <Transition
                        show={openId === question._id}
                        enter="transition ease-out duration-300"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-200"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Disclosure.Panel className="mt-2 text-sm text-center md:text-base text-gray-800 bg-custom-yellow rounded-full p-4 mx-auto w-full">
                          {question.answer}
                        </Disclosure.Panel>
                      </Transition>
                    </>
                  )}
                </Disclosure>
              ))}
            </div>
          </div>
        </div>
        {faqs.length > 5 && !showAll && (
          <div className="mt-4">
            <button
              className="mx-auto hover:bg-gray-200 bg-white text-black w-24 md:w-32 text-lg md:text-xl font-bold h-10 md:h-12 border-2 border-black rounded-3xl"
              onClick={handleShowMore}
            >
              More
            </button>
          </div>
        )}
      </div>
      <div className="absolute right-4 md:right-0 bottom-0 md:-bottom-10">
        <Image src={cloud} alt="cloud" />
      </div>
    </div>
  );
};

export default FrequentlyAsked;
