'use client';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';
type TsubscriptionProps = {
  setIsModalOpen?: (value:boolean) => void;
}
const Subscription: React.FC<TsubscriptionProps> = ({ setIsModalOpen }) => {
  const router = useRouter();

  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() =>{ setIsModalOpen && setIsModalOpen(false)}}
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
          <div className="fixed inset-0   transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 bg-black opacity-75 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="flex items-center justify-center h-14">
                  <button
                    onClick={() => router.push(`/Pricing`)}
                    className="h-14 w-full px-5 bg-custom-yellow text-slate-950 text-3xl font-bold font-comic rounded-3xl"
                  >
                    Upgrade to premium
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

export default Subscription;
