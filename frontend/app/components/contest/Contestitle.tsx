import React from 'react';

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
    <div className="w-[50vw] h-40 flex bg-white border-2 border-gray-300 rounded-3xl overflow-hidden">
      <div className="px-6 font-comic py-4">
        <div className="font-bold font-comic text-5xl text-wrap mb-2">#{contestTheme}</div>
        <p className="font-comic pt-8 text-3xl">
          <span className='font-bold'>Date:</span> {formattedDate}
        </p>
      </div>
    </div>
  );
};

export default Contestitle;
