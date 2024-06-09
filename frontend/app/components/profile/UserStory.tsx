'use client';
import React, { useState } from 'react';
import { usePDF } from 'react-to-pdf';
import axios from 'axios';
import { toast } from 'react-toastify';
import { diffChars } from 'diff';
import 'react-toastify/dist/ReactToastify.css';

interface CardProps {
  id: string;
  title: string;
  description?: string;
  corrections: string;
}

const Card: React.FC<CardProps> = ({ id, title, corrections, description = '' }) => {
  const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const toggleDescription = () => setShowFullDescription(!showFullDescription);

  const previewWords = 50;
  const descriptionText = description || '';
  const descriptionWords = descriptionText.split(' ');
  const truncatedDescription = descriptionWords.length > previewWords
    ? descriptionWords.slice(0, previewWords).join(' ') + '...'
    : descriptionText;

  const deleteClick = () => {
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
        axios.delete(`http://localhost:5000/api/stories/${id}`)
          .then(() => toast.success('Item deleted successfully!', { position: toast.POSITION.TOP_CENTER }))
          .catch((error) => {
            toast.error('Failed to delete item.', { position: toast.POSITION.TOP_CENTER });
            console.error('Error deleting item:', error);
          });
      },
    });
  };

  const compareSentences = (description = '', corrections = '') => {
    if (!description) {
      return <span style={{ color: 'red' }}>No original description provided.</span>;
    }

    if (!corrections) {
      return <span style={{ color: 'green' }}>No corrections provided.</span>;
    }

    const diff = diffChars(description, corrections);
    return diff.map((part, index) => {
      const color = part.added ? 'green' : part.removed ? 'red' : 'black';
      return <span key={index} style={{ color }}>{part.value}</span>;
    });
  };

  return (
    <div className="bg-white w-3/4 border-2 border-slate-300 shadow-sm rounded-3xl p-6 transition-all duration-300">
      <div ref={targetRef} className="flex flex-col mb-4">
        <h2 className="text-xl px-4 py-2 font-bold mb-2">{title}</h2>
        <p className={`text-gray-700 w-[95%] px-4 py-4 transition-all duration-300 ${showFullDescription ? 'max-h-full' : 'max-h-20 overflow-hidden'}`}>
          {showFullDescription ? descriptionText : truncatedDescription}
        </p>
        {showDiff && (
          <div className="mt-4">
            <h3 className="px-5 text-lg font-semibold">Corrections:</h3>
            <p className='py-4 px-5'>{compareSentences(description, corrections)}</p>
          </div>
        )}
      </div>
      <div className="flex justify-end space-x-4 mt-4">
        <button onClick={() => { setShowFullDescription(true); toPDF(); }} className="bg-white border-2 rounded-2xl border-slate-700 text-black px-4 py-2">
          PDF
        </button>
        <button onClick={() => setShowDiff(!showDiff)} className="bg-white border-2 rounded-2xl border-slate-700 text-black px-4 py-2">
          {showDiff ? 'Original' : 'Marked'}
        </button>
        <button onClick={deleteClick} className="bg-white border-2 rounded-2xl border-slate-700 text-black px-4 py-2">
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
