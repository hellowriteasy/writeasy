import Link from 'next/link';
import React, { useState } from 'react';
import moment from "moment";

interface ContestitleProps {
  contest: {
    _id: string;
    contestTheme: string;
    submissionDeadline: string;
  };
}

const Contestitle: React.FC<ContestitleProps> = ({ contest }) => {
  const { contestTheme, submissionDeadline } = contest;
  const [showFullTheme, setShowFullTheme] = useState(false);

  const toggleShowFullTheme = () => {
    setShowFullTheme(prevShowFullTheme => !prevShowFullTheme);
  };

  const getTheme = () => {
    const words = contestTheme.split(' ');
    if (words.length > 15) {
      return showFullTheme ? contestTheme : words.slice(0, 15).join(' ') + '...';
    }
    return contestTheme;
  };

  return (
    <Link href={`/Contests/${contest._id}`}>
      <div className="w-full min-h-40 object-contain sm:h-28 sm:my-4 flex bg-white border-2 border-gray-300 rounded-3xl overflow-hidden">
        <div className="px-6 font-comic py-4">
          <div className='py-3'>
            <span className="text-yellow-400 text-xl font-bold">Ended At :</span> {moment(submissionDeadline).format("llll")}
          </div>
          <div className="font-bold font-comic sm:text-sm text-xl text-wrap mb-2">
            # {getTheme()}
            {contestTheme.split(' ').length > 15 && (
              <button onClick={toggleShowFullTheme} className="ml-2 text-yellow-500 underline">
                {showFullTheme ? 'Read Less' : 'Read More'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Contestitle;
