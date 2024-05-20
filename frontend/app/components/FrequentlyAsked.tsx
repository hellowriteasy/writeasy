import Group from "@/public/Landingpage-img/groupqn.svg";
import Path from "@/public/Landingpage-img/path34.svg";
import Image from "next/image";
import cloud from "@/public/Game/sm-cloud.svg";
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Transition } from '@headlessui/react';

const FrequentlyAsked = () => {
  const Questions = [
    {
      "question": "What is Writeasy?",
      "answer": "Writeasy is a platform for writing and sharing stories.",
      "id": 1
    },
    {
      "question": "How does Writeasy work?",
      "answer": "Users can create an account, write stories, and share them with the community.",
      "id": 2
    },
    {
      "question": "Is Writeasy free to use?",
      "answer": "Yes, Writeasy is free to use with optional premium features.",
      "id": 3
    },
    {
      "question": "Can I collaborate with others on Writeasy?",
      "answer": "Yes, Writeasy allows collaboration with other users.",
      "id": 4
    }
  ];

  return (
    <div className="flex flex-col justify-center items-center w-screen text-black">
      <div className="flex relative w-screen justify-around items-center mt-4">
        <div className="mt-10">
          <Image src={Group} alt="group" />
        </div>
        <div className="text-3xl flex-col font-comic gap-3 flex justify-center items-center font-bold">
          <h1 className="text-center font-crayon text-7xl font-bold pt-10">Frequently Asked Questions</h1>
          <div className="w-full pt-16 px-4">
            <div className="mx-auto w-full max-w-lg divide-y divide-gray-300 rounded-xl">
              {Questions.map((question) => (
                <Disclosure as="div" className="p-6 text-center" key={question.id}>
                  {({ open }) => (
                    <>
                      <DisclosureButton className="group flex w-full items-center justify-center">
                        <span className="text-lg font-medium text-black">
                          {question.question}
                        </span>
                      </DisclosureButton>
                      <Transition
                        show={open}
                        enter="transition ease-out duration-300"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-200"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <DisclosurePanel className="mt-2 text-sm text-gray-800 bg-custom-yellow  rounded-full p-4  mx-auto w-max">
                          {question.answer}
                        </DisclosurePanel>
                      </Transition>
                    </>
                  )}
                </Disclosure>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <button className="mx-auto hover:bg-gray-200 bg-white text-black w-32 text-xl font-bold h-12 border-2 border-black rounded-3xl">
              More
            </button>
          </div>
        </div>
        <div className="mt-5">
          <Image src={Path} alt="path" />
        </div>
        <div className="absolute right-0 -bottom-10">
          <Image src={cloud} alt="cloud" />
        </div>
      </div>
    </div>
  );
};

export default FrequentlyAsked;
