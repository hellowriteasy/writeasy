
import React from 'react';
import Image from 'next/image';

interface StoryProps {
  story: {
    user: string;
    title: string;
    content: string;
    wordCount: number;
    submissionDateTime: string;
    score: number;
    corrections: string;
    contest: string;
    prompt: string;
    storyType: string;
  };
}

const Storytitle: React.FC<StoryProps> = ({ story }) => {
  return (
    <div className="w-full mx-auto border-2 border-gray-200 white rounded-3xl h-96 overflow-hidden">
      {/* Card title and image */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center px-6 py-4">
          <h2 className="text-4xl font-bold">{story.title}</h2>
        </div>
      </div>
      <div className='w-full relative flex h-12'>
        <div className='w-10 absolute h-10 left-3 bg-slate-500 rounded-full border'>
          <Image src="" alt="" />
        </div>
        <div className='w-10 h-10 absolute left-8 bg-slate-500 rounded-full border'>
          <Image src="" alt="" />
        </div>
        <h5 className='absolute left-20 pt-2'>Story by <span className='font-bold'>{story.user}</span></h5>
      </div>
      {/* Paragraph */}
      <div className="text-sm text-gray-900 p-4">
        {story.content}
      </div>
      {/* Read more button */}
      <div className="px-6 py-4 flex justify-end">
        <button className="bg-black text-white py-2 w-40 h-12 px-4 rounded-3xl">Read more</button>
      </div>
    </div>
  );
};

export default Storytitle;
