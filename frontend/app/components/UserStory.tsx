// components/Card.tsx
'use client'
import React, { useState } from 'react';
import { usePDF } from 'react-to-pdf';

interface CardProps {
  title: string;
  description: string;
}

const Card: React.FC<CardProps> = ({ title, description }) => {
  const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const previewLength = 100; // Number of characters to show in preview
  const truncatedDescription = description.length > previewLength
    ? description.slice(0, previewLength) + '...'
    : description;

  return (
    <div className="bg-white w-3/4 border-2 border-slate-300 shadow-sm rounded-3xl p-6 transition-all duration-300">
      <div ref={targetRef} className="flex flex-col mb-4">
        <h2 className="text-xl px-4 py-2 font-bold mb-2">{title}</h2>
        <p className={`text-gray-700 w-[95%] px-4 py-4 transition-all duration-300 ${showFullDescription ? 'max-h-full' : 'max-h-20 overflow-hidden'}`}>
          {showFullDescription ? description : truncatedDescription}
        </p>
      </div>
      <div className="flex justify-end space-x-4 mt-4">
        <button onClick={() => toPDF()} className="bg-white border-2 rounded-2xl border-slate-700 text-black px-4 py-2">
          PDF
        </button>
        <button className="bg-white border-2 rounded-2xl border-slate-700 text-black px-4 py-2">
          Marked
        </button>
        <button className="bg-white border-2 rounded-2xl border-slate-700 text-black px-4 py-2">
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
