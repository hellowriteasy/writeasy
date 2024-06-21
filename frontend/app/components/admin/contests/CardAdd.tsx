'use client'
import { useState ,useRef } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import Link from "next/link";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { axiosInstance } from "@/app/utils/config/axios";
import DeleteModal from "../../DeleteModal";
interface CardProps {
  title: string;
  deadline: string;
  id: string;
}

const Card: React.FC<CardProps> = ({ title, deadline, id }) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const AxiosIns=axiosInstance("")
  const cancelButtonRef = useRef(null);
  const handleDeleteContest = async () => {
    try {
      setOpenDeleteModal(true);
      await AxiosIns.delete(`/contests/${id}`);
      setOpenDeleteModal(false);
      toast.success("Contest deleted successfully!");
    } catch (error) {
      setOpenDeleteModal(false);
      console.error("Error deleting contest:", error);
      toast.error("Failed to delete contest.");
    }
  };

  return (
  
      <div className="bg-white border border-gray-300 shadow-md rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xl font-semibold">{title}</div>
          <div className="flex space-x-2 gap-4">
            <button className="text-black">
              <FaEdit size={20} />
            </button>
            <button className="text-black text-3xl" onClick={() => setOpenDeleteModal(true)}>
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
