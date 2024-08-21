import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import "react-toastify/dist/ReactToastify.css";

interface ModalProps {
  children: React.ReactNode;
  onSuccess: () => void;
  title: string;
  description: string;
}

const ConfirmModal: React.FC<ModalProps> = ({
  onSuccess,
  children,
  title,
  description,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>{children}</button>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
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
            <div className="fixed inset-0  bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto ">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0 ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative flex flex-col  items-center transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 w-1/2 h-full sm:w-full sm:max-w-lg bg-white ">
                  <div className="flex flex-col gap-4 p-5">
                    <div className="flex flex-col items-center">
                      <h1 className="text-2xl font-school">{title}</h1>
                      <p className="font-school">{description}</p>
                    </div>
                    <div className="flex justify-center content-center  gap-3">
                      <button
                        onClick={() => setIsOpen(false)}
                        className=" font-school border text-xl sm:text-3xl py-2    bg-gray-300 rounded-3xl text-black w-40 md:w-36 lg:w-40 h-12 sm:w-12 sm:h-6 flex items-center justify-center sm:text-[10px] sm:rounded-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          onSuccess();
                          setIsOpen(false);
                        }}
                        className=" font-school border text-xl sm:text-3xl py-2   hover:bg-slate-800  bg-red-600 rounded-3xl text-white w-40 md:w-36 lg:w-40 h-12 sm:w-12 sm:h-6 flex items-center justify-center sm:text-[10px] sm:rounded-sm"
                      >
                        Confirm
                      </button>
                    </div>
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

export default ConfirmModal;
