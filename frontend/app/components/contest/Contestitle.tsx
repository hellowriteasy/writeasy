import Link from 'next/link';
import React from 'react';
import moment from "moment"
interface ContestitleProps {
  contest: {
    _id: string;
    contestTheme: string;
    submissionDeadline: string;
  };
}

const Contestitle: React.FC<ContestitleProps> = ({ contest }) => {
  
  const { contestTheme, submissionDeadline } = contest;
  const formattedDate = new Date(submissionDeadline).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/Contests/${contest._id}`}>
      <div className="w-full h-40 sm:h-28 sm:my-4 flex bg-white border-2 border-gray-300 rounded-3xl overflow-hidden">
        <div className="px-6 font-comic py-4 ">
          <div className="font-bold font-comic sm:text-xl text-sm text-wrap mb-2">
            #{contestTheme}
          </div>
          <p className="font-comic sm:text-sm pt-8 sm:pt-2 text-sm">
            <span className="font-bold">Ended At :</span> {moment(submissionDeadline).format("llll")}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Contestitle;
