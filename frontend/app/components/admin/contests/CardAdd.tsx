"use client";
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "@/app/utils/config/axios";
import DeleteModal from "../../DeleteModal";
import Link from "next/link";
interface CardProps {
  title: string;
  deadline: string;
  id: string;
  onSuccess: () => void;
}

const Card: React.FC<CardProps> = ({ title, deadline, id, onSuccess }) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const AxiosIns = axiosInstance("");
  const handleDeleteContest = async () => {
    try {
      setOpenDeleteModal(true);
      await AxiosIns.delete(`/contests/${id}`);
      setOpenDeleteModal(false);
      onSuccess();
      toast.success("Contest deleted successfully!");
    } catch (error) {
      setOpenDeleteModal(false);
      console.error("Error deleting contest:", error);
      toast.error("Failed to delete contest.");
    }
  };

  return (
    <div className="bg-white border w-full border-gray-300 shadow-md rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="text-xl font-semibold">{title}</div>
        <div className="flex space-x-2 gap-4">
          <Link href={`/admin/contests/${id}`}>
            <button className="text-black">
              <FaEdit size={20} />
            </button>
          </Link>
          <button
            className="text-black text-3xl"
            onClick={() => setOpenDeleteModal(true)}
          >
            <FaTrash size={30} />
          </button>
        </div>
      </div>
      <div className="text-gray-600">Deadline: {deadline}</div>
      <DeleteModal
        isOpen={openDeleteModal}
        setIsOpen={setOpenDeleteModal}
        onConfirm={handleDeleteContest}
      />
    </div>
  );
};

export default Card;
