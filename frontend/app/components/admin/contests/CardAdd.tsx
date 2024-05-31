
import { FaEdit, FaTrash } from "react-icons/fa";

interface CardProps {
  title: string;
  deadline: string;
}

const Card: React.FC<CardProps> = ({ title, deadline }) => {
  return (
    <div className="bg-white border border-gray-300 shadow-md rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="text-xl font-semibold">{title}</div>
        <div className="flex space-x-2 gap-4">
          <button className="text-blue-500 hover:text-blue-600">
            <FaEdit size={20} />
          </button>
          <button className="text-red-500 hover:text-red-600">
            <FaTrash size={20} />
          </button>
        </div>
      </div>
      <div className="text-gray-600">Deadline: {deadline}</div>
    </div>
  );
};

export default Card;
