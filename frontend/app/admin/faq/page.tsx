"use client";
import { useState, useEffect } from "react";
import Card from "../../components/admin/faq/CardAdd";
import Modal from "../../components/admin/faq/Modal";
import ProtectedRoute from "@/app/utils/ProtectedRoute";
import { TFAQ } from "@/app/utils/types";
import { axiosInstance } from "@/app/utils/config/axios";
import { toast } from "react-toastify";

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [faqs, setFAQs] = useState<TFAQ[]>([]);
  const AxiosIns = axiosInstance("");

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await AxiosIns.get("/faq");
        setFAQs(response.data); // Assuming response data is an array of FAQs
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };

    fetchFAQs();
  }, []);

  const onSuccess = async () => {
    try {
      const response = await AxiosIns.get("/faq");
      setFAQs(response.data);
    } catch (error) {
      console.error("Error fetching FAQs after deletion:", error);
      toast.error("Failed to refresh FAQs after deletion.");
    }
  };

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 font-poppins min-h-screen">
        <div className="flex h-screen">
          <div className="flex-1 flex flex-col p-6 space-y-6">
            {/* <div className="flex justify-between items-center w-full bg-white shadow-sm p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-semibold text-gray-700">FAQ</div>
             
            </div> */}

            <div className="bg-white shadow-sm p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-xl font-semibold text-gray-700 font-comic">
                  All FAQs
                </div>
                <div className="text-lg flex gap-4 text-gray-500">
                  <i className="fas fa-plus cursor-pointer"></i>
                  <i className="fas fa-hashtag cursor-pointer"></i>
                </div>
                <button
                  className="bg-custom-yellow text-black border border-black px-4 py-2 rounded-lg font-comic"
                  onClick={handleAddClick}
                >
                  Add
                </button>
              </div>
              <div className="mt-4 space-y-4">
                {faqs.map((faq, index) => (
                  <Card
                    key={faq._id + faq.place}
                    id={faq._id}
                    question={faq.question}
                    answer={faq.answer}
                    position={faq.place}
                    onSuccess={onSuccess}
                  />
                ))}
              </div>
            </div>
          </div>
          {isModalOpen && (
            <Modal setIsModalOpen={setIsModalOpen} onSuccess={onSuccess} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Page;
