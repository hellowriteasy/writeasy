import { useState, Fragment, useRef } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Link from 'next/link';

interface CardProps {
  title: string;
  deadline: string;
}


const Card: React.FC<CardProps> = ({ title, deadline }) => {
 
  const [promptTitle, setPromptTitle] = useState(title);
 

 

  return (
    <>
    <Link href="/admin/stories/contests/edit">
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xl font-semibold"> {title}</div>
          
        </div>
        <div className="text-gray-600"> deadline {deadline}</div>
      </div>

        </Link>      
    </>
  );
};

export default Card;
