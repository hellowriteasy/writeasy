import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import Link from "next/link";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CardProps {
  title: string;
  deadline: string;
  id: string;
}

const Card: React.FC<CardProps> = ({ title, deadline, id }) => {
  const handleDeleteContest = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/contests/${id}`);
      toast.success("Contest deleted successfully!");
    } catch (error) {
      console.error("Error deleting contest:", error);
      toast.error("Failed to delete contest.");
    }
  };

  return (
    <Link href={`/admin/contests/${id}`}>
      <div className="bg-white border border-gray-300 shadow-md rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xl font-semibold">{title}</div>
          <div className="flex space-x-2 gap-4">
            <button className="text-black">
              <FaEdit size={20} />
            </button>
            <button onClick={handleDeleteContest} className="text-black">
              <FaTrash size={20} />
            </button>
          </div>
        </div>
        <div className="text-gray-600">Deadline: {deadline}</div>
      </div>
    </Link>
  );
};

export default Card;
