'use client'
import React, { useState } from 'react';
import { usePDF } from 'react-to-pdf';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CardProps {
  id: string; // Add id property to CardProps interface
  title: string;
  description?: string;
}

const Card: React.FC<CardProps> = ({ id, title, description = '' }) => {
  const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const previewLength = 100; // Number of characters to show in preview
  const truncatedDescription = description.length > previewLength
    ? description.slice(0, previewLength) + '...'
    : description;

  function deleteClick() {
    // Show confirmation message using React Toastify
    toast.warn('Are you sure you want to delete this item?', {
      position: toast.POSITION.TOP_CENTER,
      autoClose: false,
      closeOnClick: false,
      draggable: true,
      closeButton: false,
      hideProgressBar: true,
      pauseOnHover: true,
      progress: undefined,
      onClose: () => {
        // If user confirms deletion, make the delete request
        axios.delete(`http://localhost:8000/api/stories/${id}`)
          .then(() => {
            toast.success('Item deleted successfully!', {
              position: toast.POSITION.TOP_CENTER,
            });
          })
          .catch((error) => {
            toast.error('Failed to delete item.', {
              position: toast.POSITION.TOP_CENTER,
            });
            console.error('Error deleting item:', error);
          });
      },
    });
  }

  return (
    <div className="bg-white w-3/4 border-2 border-slate-300 shadow-sm rounded-3xl p-6 transition-all duration-300">
      <div ref={targetRef} className="flex flex-col mb-4">
        <h2 className="text-xl px-4 py-2 font-bold mb-2">{title}</h2>
        <p className={`text-gray-700 w-[95%] px-4 py-4 transition-all duration-300 ${showFullDescription ? 'max-h-full' : 'max-h-20 overflow-hidden'}`}>
          {showFullDescription ? description : truncatedDescription}
        </p>
      </div>
      <div className="flex justify-end space-x-4 mt-4">
      <button onClick={() => {
  setShowFullDescription(true); // Show full description before generating PDF
  toPDF(); // Generate PDF
}} className="bg-white  border-2 rounded-2xl border-slate-700 text-black px-4 py-2">
  PDF
</button>
        <button className="bg-white border-2 rounded-2xl border-slate-700 text-black px-4 py-2">
          Marked
        </button>
        <button
          onClick={deleteClick}
          className="bg-white border-2 rounded-2xl border-slate-700 text-black px-4 py-2"
        >
          Delete
        </button>
        <button onClick={toggleDescription} className="bg-black text-white px-4 py-2 rounded">
          {showFullDescription ? 'Show Less' : 'Read More'}
        </button>
      </div>
    </div>
  );
};

export default Card;
